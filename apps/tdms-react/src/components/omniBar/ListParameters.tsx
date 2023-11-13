import React from 'react';
import { Link } from 'react-router-dom';
import { curry } from 'lodash/fp';

export interface DataSetParam {
  parameter: {
    definition: string | null;
    name: string | null;
  } | null;
  parameter_no: number;
}

export interface ListParametersType {
  params: DataSetParam[] | null;
  onDefinitionClick: (...args: any[]) => void;
  byName?: boolean;
}

const buildParameterEntryByName = curry(
  (
    onDefinitionClick: ListParametersType['onDefinitionClick'],
    { parameter, parameter_no }: DataSetParam,
    idx: number,
    ary: ListParametersType['params']
  ) => {
    const parameterItem = parameter?.definition ? (
      <Link to={''} onClick={() => onDefinitionClick(parameter)}>
        {parameter?.name}
      </Link>
    ) : (
      parameter?.name
    );

    return (
      <span key={idx}>
        {parameterItem}
        {ary && idx < ary.length - 1 ? ', ' : ''}
      </span>
    );
  }
);
const buildParameterEntryByNumber = curry(
  (
    onDefinitionClick: ListParametersType['onDefinitionClick'],
    { parameter, parameter_no }: DataSetParam,
    idx: number,
    ary: ListParametersType['params']
  ) => {
    const parameterItem = parameter?.definition ? (
      <Link to={''} onClick={() => onDefinitionClick(parameter)}>
        {parameter_no}
      </Link>
    ) : (
      parameter_no
    );

    return (
      <span key={idx}>
        {parameterItem}
        {ary && idx < ary.length - 1 ? ', ' : ''}
      </span>
    );
  }
);

export default function ListParameters({ params = [], onDefinitionClick, byName = true }: ListParametersType) {
  return byName ? (
    <>{params?.map(buildParameterEntryByName(onDefinitionClick))}</>
  ) : (
    <>{params?.map(buildParameterEntryByNumber(onDefinitionClick))}</>
  );
}
