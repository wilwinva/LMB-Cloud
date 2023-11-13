import { AcquiredDeveloped } from '../InfoTable';
import { InfoTableFragment } from '../__generated__/InfoTableFragment';
import { ProductOutput } from '../InfoTable';

const baseInfoTableFragment: InfoTableFragment | undefined = {
  __typename: 'db_tdms_data_set',
  data_set_description: null,
  data_set_title: null,
  data_set_periods: [],
  tdif: null,
  data_set_tbvs: [],
  type: null,
  estab_fact: null,
  pud: null,
  pi_first_nm: null,
  pi_middle_nm: null,
  pi_last_nm: null,
  pi_org: null,
  rpt: null,
  qual_flg: null,
  prelim_data: null,
  tpo: null,
};

describe('when getting data type value', () => {
  describe("and data_type is 'A'", () => {
    test("and estab_fact is 'X' then 'Acquired - Established Fact'", () => {
      expect(
        AcquiredDeveloped({
          ...baseInfoTableFragment,
          type: 'A',
          estab_fact: 'X',
        })
      ).toEqual('Acquired - Established Fact');
    });
    test("and estab_fact is not 'X' then 'Acquired'", () => {
      expect(
        AcquiredDeveloped({
          ...baseInfoTableFragment,
          type: 'A',
        })
      ).toEqual('Acquired');
    });
  });
  describe("and data_type is 'D'", () => {
    test("and tpo is 'X' then 'Developed - Product Output'", () => {
      expect(
        AcquiredDeveloped({
          ...baseInfoTableFragment,
          type: 'D',
          tpo: 'X',
        })
      ).toEqual('Developed - Product Output');
    });
    test("and pud is 'X' then 'Developed - Product Under Development'", () => {
      expect(
        AcquiredDeveloped({
          ...baseInfoTableFragment,
          type: 'D',
          pud: 'X',
        })
      ).toEqual('Developed - Product Under Development');
    });
    test("and tpo is not 'X' and pud is not 'X'", () => {
      expect(
        AcquiredDeveloped({
          ...baseInfoTableFragment,
          type: 'D',
        })
      ).toEqual('Developed');
    });
  });
  test("and data_type is not 'A' and data_type is not 'D' then 'Developed'", () => {
    expect(AcquiredDeveloped(baseInfoTableFragment)).toEqual('');
  });
});

describe('when getting product output', () => {
  test("and tpo is 'X' then should return 'YES'", () => {
    expect(ProductOutput('X')).toEqual('YES');
  });
  test("and tpo is 'x' then should return 'YES'", () => {
    expect(ProductOutput('x')).toEqual('YES');
  });
  test("and tpo is empty string then should return 'NO'", () => {
    expect(ProductOutput('')).toEqual('NO');
  });
  test("and tpo is blank string then should return 'NO'", () => {
    expect(ProductOutput(' ')).toEqual('NO');
  });
  test("and tpo is null then should return 'NO'", () => {
    expect(ProductOutput(null)).toEqual('NO');
  });
});
