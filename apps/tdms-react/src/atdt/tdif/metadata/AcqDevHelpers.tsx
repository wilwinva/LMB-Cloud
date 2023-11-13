import { formatDate, invalidDate } from '../../../components/helpers/FormatDateTime';
import React, { useMemo } from 'react';
import { mergeStyleSets, Stack, StackItem } from 'office-ui-fabric-react';
import { AcqDevInformationFragment_data_set_locations } from './__generated__/AcqDevInformationFragment';
import { headerStyles, stackItemStyles, valueRowStyles, valueStyles } from './BaseStyles';

export const formatPeriodsObject = (item: any, seperator: string = '/') => {
  if (invalidDate(item.start_dt) || invalidDate(item.stop_dt)) {
    return undefined;
  }
  return ` ${formatDate(item.start_dt)} ${seperator} ${formatDate(item.stop_dt)}`;
};

const styles = {
  nameStyles: {
    minWidth: 750,
    maxWidth: 750,
  },
  coordStyles: {
    minWidth: 150,
    maxWidth: 150,
  },
  valueRowStyles: valueRowStyles,
};

export interface LocationProps {
  data: AcqDevInformationFragment_data_set_locations[];
}
export function GetLocations(props: LocationProps) {
  const { data } = props;
  const classNames = mergeStyleSets(styles);

  const valueRow = (key: string | number, item?: AcqDevInformationFragment_data_set_locations) => {
    return [
      <Stack key={key} horizontal className={classNames.valueRowStyles}>
        <StackItem className={classNames.nameStyles} styles={stackItemStyles} grow={5}>
          {item?.name ?? ''}
        </StackItem>
        <StackItem className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          {item?.x1_coord ?? ''}
        </StackItem>
        <StackItem className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          {item?.x2_coord ?? ''}
        </StackItem>
        <StackItem className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          {item?.y1_coord ?? ''}
        </StackItem>
        <StackItem className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          {item?.y2_coord ?? ''}
        </StackItem>
        <StackItem className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          {item?.z1_coord ?? ''}
        </StackItem>
        <StackItem className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          {item?.z2_coord ?? ''}
        </StackItem>
      </Stack>,
    ];
  };

  function atLeastOneValue(item: AcqDevInformationFragment_data_set_locations) {
    return (
      item?.name !== '' ||
      item?.x1_coord !== '' ||
      item?.x2_coord !== '' ||
      item?.y1_coord !== '' ||
      item?.y2_coord !== '' ||
      item?.z1_coord !== '' ||
      item?.z2_coord !== ''
    );
  }

  const valueRows = useMemo(
    () =>
      data.length > 0
        ? data.map((item: AcqDevInformationFragment_data_set_locations, idx: number) => {
            if (atLeastOneValue(item)) {
              return valueRow(idx, item);
            }
            return <></>;
          })
        : undefined, //valueRow(0, undefined),
    [data]
  );

  return (
    <Stack key={'locations'} horizontal={false}>
      <Stack key={'locations_headers'} styles={headerStyles} horizontal>
        <StackItem key={'nameHeader'} className={classNames.nameStyles} styles={stackItemStyles} grow={5}>
          Name
        </StackItem>
        <StackItem key={'x1Header'} className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          X1
        </StackItem>
        <StackItem key={'x2Header'} className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          X2
        </StackItem>
        <StackItem key={'y1Header'} className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          Y1
        </StackItem>
        <StackItem key={'y2Header'} className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          Y2
        </StackItem>
        <StackItem key={'z1Header'} className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          Z1
        </StackItem>
        <StackItem key={'z2Header'} className={classNames.coordStyles} styles={stackItemStyles} grow={1}>
          Z2
        </StackItem>
      </Stack>
      <Stack styles={valueStyles}>{valueRows}</Stack>
    </Stack>
  );
}
