import { Facade } from '../Facade';

interface Dummy {
  hello: string;
  stupid: boolean;
  f: (a: number) => number;
}

test('Does Facade typing work for mocking stuff', () => {
  const d: Dummy = {
    hello: 'hello',
    stupid: false,
    f: (a) => a,
  };
  const a: Facade<Dummy, 'hello'> = (dummy: Dummy) => ({
    hello: `${dummy.hello}goodbye`,
  });
  expect(a(d).hello).toEqual('hellogoodbye');
  const b: Facade<Dummy, 'hello' | 'stupid'> = (dummy: Dummy) => ({
    hello: `${dummy.hello}abcd`,
    stupid: true,
  });
  expect(b(d).hello).toEqual('helloabcd');
  expect(b(d).stupid).toEqual(true);
  const c: Facade<Dummy, 'hello' | 'stupid' | 'f'> = (dummy: Dummy) => ({
    hello: dummy.hello,
    stupid: dummy.stupid,
    f: (a: number) => 1,
  });
  expect(c(d).hello).toEqual('hello');
  expect(c(d).stupid).toEqual(false);
  expect(c(d).f(2)).toEqual(1);
});
