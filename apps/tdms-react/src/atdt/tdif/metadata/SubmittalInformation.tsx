import React from 'react';
import { Link } from 'react-router-dom';
import { borders, HeaderRow, ValueRow } from '@nwm/uifabric';
import { IStyle, mergeStyleSets, Stack, StackItem, Text } from 'office-ui-fabric-react';

import { gql } from '@apollo/client';
import { formatValidDate } from '../../../components/helpers/FormatDateTime';
import { SubmittalInformationFragment } from './__generated__/SubmittalInformationFragment';
import { getQualificationStatus } from '../QcHelper';

export const SUBMITTAL_INFORMATION_FRAGMENT = gql`
  fragment SubmittalInformationFragment on db_tdms_data_set {
    pi_first_nm
    pi_middle_nm
    pi_last_nm
    pi_org
    prelim_data
    qual_flg
    rpt
    data_set_comments {
      descr
    }
    data_set_description {
      descr
    }
    data_set_parameters(where: { parameter_no: { _neq: 0 } }) {
      parameter_no
      parameter {
        name
      }
    }
    data_set_wbs(where: { wbs_no: { _neq: "" } }) {
      wbs_no
    }
    data_set_supersedes(where: { supersedes_dtn: { _neq: "" } }) {
      supersedes_dtn
    }
    data_set_superseded_bies(where: { superseded_by_dtn: { _neq: "" } }) {
      superseded_by_dtn
    }
    data_set_title {
      title
    }
    tdif {
      preparer_first_nm
      preparer_middle_nm
      preparer_last_nm
      preparer_org
      submit_dt
    }
  }
`;
type ValueRowInnerStyles = {
  headerStyles: IStyle;
  valueRowStyles: IStyle;
  qualStatusStyles: IStyle;
  wrapperStyles: IStyle;
};
type ValueRowClassNames = Record<keyof ValueRowInnerStyles, string>;
const _styles: ValueRowInnerStyles = {
  headerStyles: {
    width: '48.5vw',
    marginLeft: '-0.25rem',
    padding: '0.25rem',
    borderTop: borders.borderTop,
    borderBottom: borders.borderBottom,
    background: '#dbd9bd',
    overflow: 'hidden',
  },
  valueRowStyles: {
    width: '47vw',
    overflow: 'hidden',
  },
  qualStatusStyles: {
    paddingBottom: 20,
  },
  wrapperStyles: {
    width: '60vw',
  },
};

//todo -- this is a placeholder
const UpdateLink = <Link to={'.'}>Update</Link>;

export interface SubmittalInformationProps {
  data: SubmittalInformationFragment;
  styles: {
    maxWidth: number;
  };
}
export function SubmittalInformation(props: SubmittalInformationProps) {
  const { data, styles } = props;
  const {
    tdif,
    data_set_comments,
    data_set_description,
    data_set_parameters,
    data_set_wbs,
    data_set_supersedes,
    data_set_superseded_bies,
    data_set_title,
  } = data;

  const { maxWidth } = styles;
  const stackDimension = {
    height: 'auto',
    width: maxWidth,
  };

  const classNames = mergeStyleSets(_styles);

  return (
    <Stack>
      <HeaderRow
        stackDimension={stackDimension}
        cellNumber={1}
        cellText={['PART I Identification of Submittal and Source']}
        background="themePrimary"
        color="themeSecondary"
      />
      <Stack>
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[<Text>TDIF Submittal Date</Text>, <Text>Qualification Status {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[
            <Text>{formatValidDate(data.tdif?.submit_dt)}</Text>,
            buildQualFlgPrelimData(data.qual_flg, data.prelim_data, classNames),
          ]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>TDIF Preparer {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[
            <PersonInfo
              first_name={tdif?.preparer_first_nm}
              middle_name={tdif?.preparer_middle_nm}
              last_name={tdif?.preparer_last_nm}
              org={tdif?.preparer_org}
            />,
          ]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Originator Preparer {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[
            <PersonInfo
              first_name={data?.pi_first_nm}
              middle_name={data?.pi_middle_nm}
              last_name={data?.pi_last_nm}
              org={data?.pi_org}
            />,
          ]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[<Text>Parameter Number(s) {UpdateLink}</Text>, <Text>WBS Number(s) {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[
            <Stack>
              {data_set_parameters.map((param, idx) => (
                <Text key={idx}>{`${param.parameter_no} ${param.parameter?.name}`}</Text>
              ))}
            </Stack>,
            <Stack>
              {data_set_wbs.map((set, idx) => (
                <Text key={idx}>{set.wbs_no}</Text>
              ))}
            </Stack>,
          ]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[<Text>Supersedes DTN(s) {UpdateLink}</Text>, <Text>Superseded by DTN(s) {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[
            <Stack>
              {data_set_supersedes.map((set, idx) => (
                <Text key={idx}>{set.supersedes_dtn}</Text>
              ))}
            </Stack>,
            <Stack>
              {data_set_superseded_bies.map((set, idx) => (
                <Text key={idx}>{set.superseded_by_dtn}</Text>
              ))}
            </Stack>,
          ]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Report Number {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow stackDimension={stackDimension} cellNumber={1} cellText={[<Text>{data.rpt}</Text>]} />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Data Set Title {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow stackDimension={stackDimension} cellNumber={1} cellText={[<Text>{data_set_title?.title}</Text>]} />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Data Set Description {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>{data_set_description?.descr}</Text>]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Comments {UpdateLink}</Text>]}
          topOff
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[
            <Stack>
              {data_set_comments.map((comment, idx) => (
                <Text key={idx}>{comment.descr}</Text>
              ))}
            </Stack>,
          ]}
        />
      </Stack>
    </Stack>
  );
}

interface PersonInfoProps {
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  org?: string | null;
}

function PersonInfo(props: PersonInfoProps) {
  const { first_name, middle_name, last_name, org } = props;
  return (
    <Stack>
      <Text>
        {`${withSeparator(last_name, first_name)}
                ${withSeparator(first_name, middle_name)}
                ${middle_name}`}
      </Text>
      {org ? <Text>{org}</Text> : undefined}
    </Stack>
  );
}

const withSeparator = (s1?: string | null, s2?: string | null, sep: string = ', ') => {
  if (s1 && s2) {
    return `${s1}${sep}`;
  } else if (s1) {
    return s1;
  } else if (s2) {
    return s2;
  }

  return '';
};

function buildQualFlgPrelimData(qual_flg: string | null, prelim_data: string | null, classNames: ValueRowClassNames) {
  const qualFlg = qual_flg ? getQualificationStatus(qual_flg) : '';
  const prelimData = prelim_data === 'X' ? 'YES' : 'NO';
  return (
    <Stack>
      <StackItem className={classNames.qualStatusStyles}>
        <Text>{qualFlg}</Text>
      </StackItem>
      <Stack className={classNames.headerStyles} verticalAlign="center" horizontalAlign="center">
        <Text>Preliminary Data {UpdateLink} </Text>
      </Stack>
      <StackItem className={classNames.valueRowStyles}>
        <Text>{prelimData}</Text>
      </StackItem>
    </Stack>
  );
}
