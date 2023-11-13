import React from 'react';
import { Link } from 'react-router-dom';
import { curry } from 'lodash/fp';
import { array2String } from '../../omniBar/helpers';
import { gql } from '@apollo/client';
import {
  ListDtnDataParametersFragment_data_set_parameters,
  ListDtnDataParametersFragment_data_set_parameters_parameter,
} from './__generated__/ListDtnDataParametersFragment';

export const LIST_DTN_DATA_PARAMETERS_FRAGMENT = gql`
  fragment ListDtnDataParametersFragment on db_tdms_data_set {
    data_set_parameters(where: { parameter_no: { _neq: 0 } }) {
      id
      parameter_no
      parameter {
        id
        name
        definition
      }
    }
  }
`;

/** Id is made optional to work with the way SepTableList is doing the parameter's lookup. The optionality could be
 * removed if a foreign key is added to dbsep.column_descriptions that replaced the string manipulation being used now.
 * Alternatively, we might be able to move that logic to a stored procedure and return its results via Hasura.
 * */
export type DataParameter = Omit<ListDtnDataParametersFragment_data_set_parameters_parameter, 'id'> & { id?: number };
export type DataParameters = Omit<ListDtnDataParametersFragment_data_set_parameters, 'id' | 'parameter'> & {
  id?: number;
  parameter: DataParameter | null;
};
export type ListDtnDataParameters = DataParameters[];

export interface ListDtnDataParametersProps {
  data: ListDtnDataParameters | undefined;
  onDefinitionClick: (...args: any[]) => void;
}

const buildParameterEntry = curry(
  (
    onDefinitionClick: ListDtnDataParametersProps['onDefinitionClick'],
    { parameter }: DataParameters,
    arrIdx: { idx: number; length: number }
  ) => {
    const { idx, length } = arrIdx;
    const parameterItem = parameter?.definition ? (
      <Link key={idx} to={''} onClick={() => onDefinitionClick(parameter)}>
        {parameter?.name}
      </Link>
    ) : (
      parameter?.name
    );

    return (
      <span key={idx}>
        {parameterItem}
        {length && idx < length - 1 ? ', ' : ''}
      </span>
    );
  }
);

export default function ListDtnDataParameters({ data = [], onDefinitionClick }: ListDtnDataParametersProps) {
  const length = data.length;

  return data.length > 0 ? (
    <>{data?.map((param, idx) => buildParameterEntry(onDefinitionClick, param, { idx, length }))}</>
  ) : (
    <></>
  );
}

export const getDtnDataParameterText = (params: ListDtnDataParameters = []) => {
  const _params = params ? params.map((param) => param.parameter) : [];
  return array2String(_params, 'name');
};
