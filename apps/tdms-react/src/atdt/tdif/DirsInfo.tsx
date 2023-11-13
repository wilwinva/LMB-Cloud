import React, { ReactElement, useMemo } from 'react';
import { Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { HeaderRow, ValueRow } from '@nwm/uifabric';
import { DirsInfoFragment } from './__generated__/DirsInfoFragment';

export interface DirsTableProps {
  stackWidth: number;
  data: DirsInfoFragment[];
}

export const DIRS_INFO_FRAGMENT = gql`
  fragment DirsInfoFragment on db_tdms_dirs_tdms_dtns {
    dirs_tdms_doc {
      doc_id
      document_number
      revision
    }
    input_category
  }
`;

const headerCellText = ['DIRS Doc ID', 'Doc Status', 'Input Category', 'Q Status'];

export default function DirsInfo(props: DirsTableProps) {
  const { stackWidth, data } = props;
  const cellText = useMemo(() => buildRows(data), [data]);
  const dirsTable = cellText.map((row, idx) => {
    return (
      <ValueRow key={idx} stackDimension={{ height: 20, width: stackWidth }} cellNumber={row.length} cellText={row} />
    );
  });

  return (
    <Stack>
      <HeaderRow
        stackDimension={{ height: 30, width: stackWidth }}
        cellNumber={headerCellText.length}
        cellText={headerCellText}
      />
      {dirsTable}
    </Stack>
  );
}

function buildRow(data: DirsInfoFragment, idx: number): ReactElement[] {
  const docId = <Text key={`docId:${idx}`}>{data.dirs_tdms_doc ? data.dirs_tdms_doc.doc_id : ''}</Text>;
  const docStatus = <Text key={`docStatus:${idx}`}>TO DO - DIRS API</Text>;
  const inputCategory = <Text key={`inputCategory:${idx}`}>{data.input_category ? data.input_category : ''}</Text>;
  const qStatus = <Text key={`qStatus:${idx}`}>TO DO - DIRS Data</Text>;

  return [docId, docStatus, inputCategory, qStatus];
}
function buildEmptyRow() {
  const docId = <Text key={`docId:0`}>{''}</Text>;
  const docStatus = <Text key={`docStatus:0`}>{''}</Text>;
  const inputCategory = <Text key={`inputCategory:0`}>{''}</Text>;
  const qStatus = <Text key={`qStatus:0`}>{''}</Text>;

  return [[docId, docStatus, inputCategory, qStatus]];
}
function buildRows(data: DirsInfoFragment[]) {
  return data.length === 0 ? buildEmptyRow() : data.map((val, idx) => buildRow(val, idx));
}
