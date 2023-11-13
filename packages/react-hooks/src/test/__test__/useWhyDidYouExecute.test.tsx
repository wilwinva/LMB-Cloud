import { diff } from '../useWhyDidYouExecute';

test('diff works', () => {
  const obj1 = { prop1: 'prop1', prop2: 'prop2', prop4: 'prop4' };
  const obj2 = { prop1: 'diff', prop3: 'prop3', prop4: 'prop4' };

  const result = diff(obj1, obj2);
  expect(result).toStrictEqual({
    prop1: ['prop1', 'diff'],
    prop2: ['prop2', undefined],
    prop3: [undefined, 'prop3'],
  });
});
