import React, { ReactElement } from 'react';
import { IStackStyles, Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { pipe } from 'lodash/fp';
import { IStyleObject } from '@nwm/types';
import { useCustomizations } from '@nwm/uifabric';

import { InfoTableFragment } from './__generated__/InfoTableFragment';
import PiInfo from './PiInfo';
import { CellStack, StackRowProps } from './StackRow';
import Preliminary from './Preliminary';
import { getQualificationStatus, QcHeader, QcValueHeader } from '../QcHelper';
import { alignCenterStyles, Dimension } from '../dimension';
import { TdifDisplayTypes } from '../TdifDisplayTypes';
import { formatDate } from '../../../components/helpers/FormatDateTime';
import { getVerificationStatus } from '../VerificationStatusHelper';
import { StatusTableFragment } from '../../../components/omniBar/results/__generated__/StatusTableFragment';
import { HeaderInformationFragment } from '../../../atdt/tdif/metadata/__generated__/HeaderInformationFragment';

export const INFO_TABLE_FRAGMENT = gql`
  fragment InfoTableFragment on db_tdms_data_set {
    data_set_description {
      descr
    }
    data_set_title {
      title
    }
    data_set_periods {
      start_dt
      stop_dt
    }
    tdif {
      qced_flg
      qced_dt
      submit_dt
    }
    data_set_tbvs {
      tbv_num
      tbv_status
    }
    type
    estab_fact
    pud
    pi_first_nm
    pi_middle_nm
    pi_last_nm
    pi_org
    rpt
    qual_flg
    prelim_data
    tpo
  }
`;

interface RowDimensions extends Dimension {}
interface CellDimensions {
  header: Dimension;
  value: Dimension;
}
interface StackDimension {
  row: RowDimensions;
  cell: CellDimensions;
}
interface StackDimensions {
  small: StackDimension;
  medium: StackDimension;
}

const stackDimensions: StackDimensions = {
  small: {
    row: {
      width: 'auto',
    },
    cell: {
      header: {
        width: 245,
        height: 75,
      },
      value: {
        width: 245,
        height: 67,
      },
    },
  },
  medium: {
    row: {
      width: 'auto',
    },
    cell: {
      header: {
        width: 245,
        height: 75,
      },
      value: {
        width: 440,
        height: 67,
      },
    },
  },
};

export interface InfoTableProps {
  data: InfoTableFragment;
  tdifDisplayTypes: TdifDisplayTypes;
}

export function AcquiredDeveloped(it: InfoTableFragment | StatusTableFragment | HeaderInformationFragment | undefined) {
  if (it) {
    const { type, estab_fact, pud, tpo } = it;
    if (type === 'A') {
      return estab_fact === 'X' ? 'Acquired - Established Fact' : 'Acquired';
    } else if (type === 'D') {
      if (tpo === 'X') {
        return 'Developed - Product Output';
      } else if (pud === 'X') {
        return 'Developed - Product Under Development';
      }
      return 'Developed';
    }
  }
  return '';
}

export function ProductOutput(tpo: String | null) {
  if (tpo) {
    const actualTpo = tpo.trim().toUpperCase();
    if (actualTpo === 'X') {
      return 'YES';
    }
  }
  return 'NO';
}

export default function InfoTable(props: React.PropsWithChildren<InfoTableProps>) {
  const { data, tdifDisplayTypes } = props;

  const settings = useCustomizations().settings.extended!;
  const borderStyle = settings.borders.default;

  const stackStyles: IStackStyles = {
    root: {
      background: settings.palette.white,
      borderLeft: borderStyle,
      borderTop: borderStyle,
      width: 'auto',
      paddingTop: settings.spacing.s4,
    },
  };

  const stackRowProps: Omit<StackRowProps, 'headerText' | 'valueText' | 'headerTextClass'> = {
    stackItemHeaderStyles: {
      root: {
        background: '#DBD9BD',
        color: settings.palette.black,
        borderRight: borderStyle,
        borderBottom: borderStyle,
        ...alignCenterStyles,
      },
    },
    stackItemValueStyles: {
      root: {
        color: settings.palette.black,
        borderRight: borderStyle,
        borderBottom: borderStyle,
        display: 'flex',
        overflow: 'auto',
        padding: settings.paddings.p4,
      },
    },
  };

  const smallStackRowProps: Omit<StackRowProps, 'headerText' | 'valueText'> = {
    stackItemHeaderStyles: {
      root: {
        ...(stackRowProps.stackItemHeaderStyles.root as IStyleObject),
        ...stackDimensions.small.cell.header,
      },
    },
    stackItemValueStyles: {
      root: {
        ...(stackRowProps.stackItemValueStyles.root as IStyleObject),
        ...stackDimensions.small.cell.value,
      },
    },
  };

  const mediumStackRowProps: Omit<StackRowProps, 'headerText' | 'valueText'> = {
    stackItemHeaderStyles: {
      root: {
        ...(stackRowProps.stackItemHeaderStyles.root as IStyleObject),
        ...stackDimensions.medium.cell.header,
      },
    },
    stackItemValueStyles: {
      root: {
        ...(stackRowProps.stackItemValueStyles.root as IStyleObject),
        ...stackDimensions.medium.cell.value,
      },
    },
  };

  const prelimToBoolean = (data: string | null) => data === 'X';
  const getPrelimDataStatusText = (prelim_data: boolean) => (prelim_data ? 'YES' : 'NO');
  const getPrelimDataStatus = pipe(prelimToBoolean, getPrelimDataStatusText);

  const isBrief = tdifDisplayTypes.displayBrf1 || tdifDisplayTypes.displayBrf2;

  return (
    <Stack styles={stackStyles}>
      <CellStack
        stackRowProps={[{ ...smallStackRowProps, headerText: 'Title', valueText: data.data_set_title?.title }]}
      />
      <CellStack
        stackRowProps={[
          { ...smallStackRowProps, headerText: 'Description', valueText: data.data_set_description?.descr },
        ]}
      />
      {isBrief && (
        <CellStack
          stackRowProps={[
            { ...smallStackRowProps, headerText: 'Originator/Preparer', valueText: <PiInfo {...data} /> },
            { ...smallStackRowProps, headerText: 'Report Number', valueText: data.rpt },
          ]}
        />
      )}
      {!isBrief && (
        <>
          <CellStack
            stackRowProps={[
              {
                ...mediumStackRowProps,
                headerText: 'Acquired or Developed',
                valueText: AcquiredDeveloped(data),
              },
              { ...smallStackRowProps, headerText: 'Originator/Preparer', valueText: <PiInfo {...data} /> },
            ]}
          />

          <CellStack
            stackRowProps={[
              { ...mediumStackRowProps, headerText: 'Qualification', valueText: getQualificationStatus(data.qual_flg) },
              { ...smallStackRowProps, headerText: 'Report Number', valueText: data.rpt },
            ]}
          />

          <CellStack
            stackRowProps={[
              {
                ...mediumStackRowProps,
                headerText: 'Verification',
                valueText: getVerificationStatus(data.data_set_tbvs),
              },
              {
                ...smallStackRowProps,
                headerText: 'TDIF Submittal',
                valueText: data.tdif?.submit_dt ? formatDate(data.tdif.submit_dt) : '',
              },
            ]}
          />

          <CellStack
            stackRowProps={[
              { ...mediumStackRowProps, headerText: 'Preliminary?', valueText: getPrelimDataStatus(data.prelim_data) },
              {
                ...smallStackRowProps,
                headerText: AcqDevHeader,
                valueText: <Preliminary {...data} />,
              },
            ]}
          />

          <CellStack
            stackRowProps={[
              {
                ...mediumStackRowProps,
                headerText: 'Product Output',
                valueText: ProductOutput(data.tpo),
              },
              { ...smallStackRowProps, headerText: QcHeader, valueText: <QcValueHeader {...data} /> },
            ]}
          />
        </>
      )}
    </Stack>
  );
}

const AcqDevHeader: ReactElement = (
  <>
    <Text>Acq/Dev</Text>
    <Text> Start - End</Text>
  </>
);
