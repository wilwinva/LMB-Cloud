import React from 'react';
import { Text, Stack } from 'office-ui-fabric-react';
import { FieldsByPaperQuery_paper_doc_main_types } from '../schema-components/__generated__/FieldsByPaperQuery';
import { FieldsByRisDataQuery_risdata_doc_main_types } from '../schema-components/__generated__/FieldsByRisDataQuery';
import { FieldsByEmailQuery_email_doc_main_types } from '../schema-components/__generated__/FieldsByEmailQuery';
import { FieldsByEfilesQuery_efiles_doc_main_types } from '../schema-components/__generated__/FieldsByEfilesQuery';

interface FieldsTabDataProps {
  lpage: string;
  fpage: string;
  title: string;
  doc_date: string;
  ctr: string;
  acc_no: string;
  types:
    | FieldsByPaperQuery_paper_doc_main_types[]
    | FieldsByRisDataQuery_risdata_doc_main_types[]
    | FieldsByEmailQuery_email_doc_main_types[]
    | FieldsByEfilesQuery_efiles_doc_main_types[];
}
export default function FieldsTabData(props: FieldsTabDataProps) {
  const typesComponent: JSX.Element[] = [];
  props.types?.forEach(
    (
      d:
        | FieldsByPaperQuery_paper_doc_main_types
        | FieldsByRisDataQuery_risdata_doc_main_types
        | FieldsByEmailQuery_email_doc_main_types
        | FieldsByEfilesQuery_efiles_doc_main_types
    ) => typesComponent.push(<Text as="div">{d.doc_type}</Text>)
  );
  return (
    <>
      <Stack horizontal>
        <Text>Accession #:</Text>
        <Stack.Item>{props.acc_no}</Stack.Item>
      </Stack>
      <Stack horizontal>
        <Text>Pages:</Text>
        <Stack.Item>
          {props.ctr} - {props.fpage} - {props.lpage}
        </Stack.Item>
      </Stack>
      <Stack horizontal>
        <Text>Doc Date :</Text>
        <Stack.Item>{props.doc_date}</Stack.Item>
      </Stack>
      <Stack horizontal>
        <Text>Title:</Text>
        <Stack.Item>{props.title}</Stack.Item>
      </Stack>
      <Stack horizontal>
        <Text>Document Type:</Text>
        <Stack.Item className="doc-types">{typesComponent.map((d) => d)}</Stack.Item>
      </Stack>
    </>
  );
}
