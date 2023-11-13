import React, { useMemo } from 'react';
import { StackItem, Stack, mergeStyleSets } from 'office-ui-fabric-react';
import { headerStyles, stackItemStyles, valueStyles, valueRowStyles } from './BaseStyles';
import { RecordRoadmapInformationFragment_data_set_records_roadmaps } from './__generated__/RecordRoadmapInformationFragment';

const styles = {
  apiStyles: {
    minWidth: 50,
    maxWidth: 50,
  },
  numberStyles: {
    minWidth: 150,
    maxWidth: 150,
  },
  titleStyles: {
    minWidth: 500,
    maxWidth: 500,
  },
  docStyles: {
    minWidth: 130,
    maxWidth: 130,
  },
  contentStyles: {
    minWidth: 500,
  },
  valueRowStyles: valueRowStyles,
};

export interface RecordsRoadmapProps {
  data: RecordRoadmapInformationFragment_data_set_records_roadmaps[];
}

export function GetRecordRoadmaps(props: RecordsRoadmapProps) {
  const { data } = props;
  const classNames = mergeStyleSets(styles);

  const valueRow = (key: string | number, item?: RecordRoadmapInformationFragment_data_set_records_roadmaps) => {
    return [
      <Stack key={key} horizontal className={classNames.valueRowStyles}>
        <StackItem className={classNames.apiStyles} styles={stackItemStyles} grow={1}>
          {item?.rec_flag ?? ''}
        </StackItem>
        <StackItem className={classNames.numberStyles} styles={stackItemStyles} grow={1}>
          {item?.rec_num ?? ''}
        </StackItem>
        <StackItem className={classNames.titleStyles} styles={stackItemStyles} grow={3}>
          {item?.rec_title ?? ''}
        </StackItem>
        <StackItem className={classNames.docStyles} styles={stackItemStyles} grow={1}>
          {item?.doc_type ?? ''}
        </StackItem>
        <StackItem className={classNames.contentStyles} styles={stackItemStyles} grow={3}>
          {item?.rec_contents ?? ''}
        </StackItem>
      </Stack>,
    ];
  };

  const valueRows = useMemo(
    () =>
      data.length > 0
        ? data.map((item: RecordRoadmapInformationFragment_data_set_records_roadmaps, idx) => {
            return valueRow(idx, item);
          })
        : undefined, //valueRow(0, undefined),
    [data]
  );

  return (
    <Stack key={'roadmap'} horizontal={false}>
      <Stack key={'roadmap_headers'} styles={headerStyles} horizontal>
        <StackItem className={classNames.apiStyles} styles={stackItemStyles} grow={1}>
          A/P/I
        </StackItem>
        <StackItem className={classNames.numberStyles} styles={stackItemStyles} grow={1}>
          Record Number
        </StackItem>
        <StackItem className={classNames.titleStyles} styles={stackItemStyles} grow={3}>
          Record Title
        </StackItem>
        <StackItem className={classNames.docStyles} styles={stackItemStyles} grow={1}>
          Doc Type
        </StackItem>
        <StackItem className={classNames.contentStyles} styles={stackItemStyles} grow={3}>
          Record Contents
        </StackItem>
      </Stack>
      <Stack key={'roadmap_values'} styles={valueStyles}>
        {valueRows}
      </Stack>
    </Stack>
  );
}
