import { extractFirstValidInteger, INTEGER_CEILING } from '../helpers';

describe('when extracting first valid integer', () => {
  test('and string does not contain numbers then should return nothing', async () => {
    const string = 'abcd efghi jklmnop';
    expect(extractFirstValidInteger(string)).toEqual(undefined);
  });
  test('and string does contain numbers below ceiling then should return the first number', async () => {
    const string = 'abcd 1234 efghi';
    expect(extractFirstValidInteger(string)).toEqual(1234);
  });
  test('and string does contain numbers over ceiling then should return nothing', async () => {
    const string = `abcd ${INTEGER_CEILING + 1} ${INTEGER_CEILING + 2}`;
    expect(extractFirstValidInteger(string)).toEqual(undefined);
  });
  test('and string does contain numbers over ceiling but numbers are not delimited by spaces then should return nothing', async () => {
    expect(
      extractFirstValidInteger(`abcd ${INTEGER_CEILING + 1} ${INTEGER_CEILING + 1}followed_by_anything_but_space`)
    ).toEqual(undefined);
  });
  test('and string is fairly long then should return nothing', async () => {
    expect(extractFirstValidInteger('test1231312313123')).toEqual(undefined);
  });
  test('should not match when surrounded by period and end of string', async () => {
    expect(extractFirstValidInteger('test.000')).toEqual(undefined);
  });
  test('should match when surrounded by whitespace and end of string', async () => {
    expect(extractFirstValidInteger('test 000')).toEqual(0);
  });
  test('should match when surrounded by whitespace and start of string', async () => {
    expect(extractFirstValidInteger('000 test')).toEqual(0);
  });
});
