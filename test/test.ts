import { Data, DataSubscription } from "../app/src/f-db"
import 'jest-extended';


test('Current Value', () => {
  let d = new Data(2)

  expect(d.get()).toBe(2)

  d.set(4)
  
  expect(d.get()).toBe(4)
})


test('Subscription init', () => {
  let d = new Data(2)

  d.get((e) => {
    expect(e).toBe(2)
  })
})


test('Subscription noinit', () => {
  let d = new Data(2)

  d.get((e) => {
    fail()
  }, false)
})


test('Unsunscription', () => {
  let d = new Data(2)

  let f = (e) => {
    expect(e).toBe(4)
  }

  d.get(f, false)
  d.set(4)
  d.got(f)
})


test('Subscription value change', () => {
  let d = new Data(2)

  d.get((e) => {
    expect(e).toBeOneOf([2,3,4])
  })

  d.set(3)
  d.set(4)
})


test('Subscription value change', () => {
  let d = new Data(2)

  d.get((e) => {
    expect(e).toBeOneOf([2,3,4])
  })

  d.set(3)
  d.set(4)
})


test('Dont notify when set value doesnt change', () => {
  let d = new Data(2)

  d.get((e) => {
    fail()
  }, false)

  d.set(2)
})



