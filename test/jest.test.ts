import { Data } from "./../app/src/f-db"


test('Current Value', () => {
  let d = new Data(2)

  expect(d.get()).toBe(2)

  d.set(4)
  
  expect(d.get()).toBe(4)
});
