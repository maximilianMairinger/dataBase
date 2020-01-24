import { Data, DataSubscription } from "../app/src/f-db"
import 'jest-extended';

test('Activate and Initialize', () => {
  // (() => {
  //   let data1 = new Data(2)
  //   let subscription1 = (e) => {
  //     expect(e).toBe(2)
  //   } 
  //   let d = new DataSubscription(data1, subscription1, true, true)
  // })();

  // (() => {
  //   let data1 = new Data(4)
  //   let subscription1 = (e) => {
  //     expect(e).toBe(4)
  //   } 
  //   let d = new DataSubscription(data1, subscription1)
  // })();

  // (() => {
  //   let data1 = new Data(4)
  //   let subscription1 = (e) => {
  //     fail()
  //   } 
  //   let d = new DataSubscription(data1, subscription1, false)


  //   data1.set(3)
  // })();

 // (() => {
    let data1 = new Data(4)
    let subscription1 = (e) => {
      expect(e).toBeOneOf([4,3])
    } 
    let d = new DataSubscription(data1, subscription1)


    data1.set(3)
    data1.set(5)
 // })();
  

})