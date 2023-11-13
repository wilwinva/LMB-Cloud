import React, { ReactElement, useMemo } from 'react';
import { ITextStyles, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { HeaderRow, useCustomizations, ValueRow } from '@nwm/uifabric';
import {
  ParameterInfoFragment,
  ParameterInfoFragment_data_set_comments,
  ParameterInfoFragment_data_set_parameters,
} from './__generated__/ParameterInfoFragment';
import { TdifDisplayTypes } from './TdifDisplayTypes';
import AcquisitionInfo, { ACQUISITION_INFO_FRAGMENT } from './AcquisitionInfo';

export interface ParameterInfoProps {
  stackWidth: number;
  data: ParameterInfoFragment;
  tdifDisplayTypes: TdifDisplayTypes;
}

export const PARAMETER_INFO_FRAGMENT = gql`
  fragment ParameterInfoFragment on db_tdms_data_set {
    data_set_parameters(where: { parameter: { name: { _neq: "" } } }) {
      parameter {
        name
      }
    }
    data_set_comments {
      descr
    }
    ...AcquisitionInfoFragment
  }
  ${ACQUISITION_INFO_FRAGMENT}
`;

export default function ParameterInfo(props: ParameterInfoProps) {
  const { stackWidth, data, tdifDisplayTypes } = props;

  const settings = useCustomizations().settings.extended!;
  const isBrief = tdifDisplayTypes.displayBrf1 || tdifDisplayTypes.displayBrf2;

  const headerCellTextParameters = isBrief ? ['Parameters'] : ['Parameters', 'Comments'];

  const textStyles: Partial<ITextStyles> = {
    root: {
      height: 75,
      padding: settings.spacing.s2,
      marginLeft: settings.margins.neg(settings.spacing.s2),
      marginRight: settings.margins.neg(settings.spacing.s2),
      borderBottom: settings.borders.default,
    },
  };

  const cellTextParam = useMemo(() => buildParametersList(data, textStyles, isBrief), [data]);
  const cellNumberParam = cellTextParam.length;
  return (
    <>
      <HeaderRow
        stackDimension={{ height: 30, width: stackWidth }}
        cellNumber={cellNumberParam}
        cellText={headerCellTextParameters}
      />
      <ValueRow
        stackDimension={{ height: 175, width: stackWidth }}
        cellNumber={cellNumberParam}
        cellText={cellTextParam}
      />
      {!isBrief && <AcquisitionInfo stackWidth={stackWidth} data={data} tdifDisplayTypes={tdifDisplayTypes} />}
    </>
  );
}

function buildParametersList(
  data: ParameterInfoFragment,
  textStyles: Partial<ITextStyles>,
  isBrief: boolean
): ReactElement[] {
  const parameters = data.data_set_parameters;
  const comments = data.data_set_comments;
  return isBrief ? [buildParameters(parameters)] : [buildParameters(parameters), buildComments(comments)];

  function buildParameters(parameters: ParameterInfoFragment_data_set_parameters[]) {
    return (
      <>
        <Text nowrap={false} block key={'disclaimer-1'}>
          Disclaimer:
        </Text>
        <Text nowrap={false} block styles={textStyles} key={'disclaimer-2'}>
          Parameters listed may representative of the information residing in TDMS and/or RPC. Refer to the applicable
          TDMS components and RPC Pkg ID(s)\Accession Numbers for further information.
        </Text>
        {data.data_set_parameters.map((data: ParameterInfoFragment_data_set_parameters, idx: number) => {
          return buildItem(data.parameter!.name, idx);
        })}
      </>
    );
  }

  function buildComments(comments: ParameterInfoFragment_data_set_comments[]) {
    return (
      <>
        {comments.map((data: ParameterInfoFragment_data_set_comments, idx: number) => {
          return buildItem(data.descr, idx);
        })}
      </>
    );
  }
}

function buildItem(item: string, idx: number) {
  return (
    <div key={idx}>
      <Text>{item}</Text>
    </div>
  );
}
