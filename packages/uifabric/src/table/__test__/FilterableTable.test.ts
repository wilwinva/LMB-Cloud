import { filterItems, Filter, FilterMap } from '../FilterableTable';

type QcedDateOnly = Required<Record<'qcedDate', string>>;

describe('when filtering items', () => {
  test('and qced date filter is 06 then only 06 matches should exist', () => {
    expect(
      filterItems(
        (() => {
          let result: FilterMap<QcedDateOnly> = {};
          result['qcedDate'] = {
            key: 'qcedDate',
            getTarget: (it) => it.qcedDate,
            current: '06',
          };
          return result;
        })(),
        ['01-26-2004', '09-17-2003', '05-21-2003', '01-23-1998', '01-06-1901'].map((it) => ({ qcedDate: it }))
      )
    ).toEqual([{ qcedDate: '01-06-1901' }]);
  });
});
