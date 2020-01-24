import { Data, DataSubscription, DataCollection } from "../app/src/f-db"
import delay from "delay"


describe("Data", () => {
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
  
    let i = 0
  
    d.get((e) => {
      i++
      if (i === 1) {
        expect(e).toBe(2)
      }
      else if (i === 2) {
        expect(e).toBe(3)
      }
      else if (i === 3) {
        expect(e).toBe(4)
      }
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
})



describe("DataSubscription", () => {
  test('Data support', () => {
    new DataSubscription(new Data(2), (e) => {
      expect(e).toBe(2)
    })
  })

  test('DataCollection support', () => {
    new DataSubscription(new DataCollection(new Data(1), new Data("2")), (...a) => {
      expect(a).toEqual([1, "2"])
    })
  })


  test('Inital activation', () => {
    (() => {
      let data1 = new Data(2)
      let subscription1 = (e) => {
        expect(e).toBe(2)
      } 
      let d = new DataSubscription(data1, subscription1, true)
    })();
  
    (() => {
      let data1 = new Data(4)
      let subscription1 = (e) => {
        expect(e).toBe(4)
      } 
      let d = new DataSubscription(data1, subscription1)
    })();
  
    (() => {
      let data1 = new Data(4)
      let subscription1 = (e) => {
        fail()
      } 
      let d = new DataSubscription(data1, subscription1, false)
  
  
      data1.set(3)
      data1.set(1)
    })();
  })
  
  
  test("Initialize", () => {
    (() => {
      let i = 0
  
      let data1 = new Data(4)
      let subscription1 = (e) => {
        i++
        if (i === 1) {
          expect(e).toBe(4)
        }
        else if (i === 2) {
          expect(e).toBe(3)
        }
        
      } 
      let d = new DataSubscription(data1, subscription1)
  
  
      data1.set(3)
    })();


    (() => {
      let i = 0

      let data1 = new Data(4)
      let subscription1 = (e) => {
        i++
        if (i === 1) {
          expect(e).toBe(4)
        }
        else if (i === 2) {
          expect(e).toBe(3)
        }
        
      } 
      let d = new DataSubscription(data1, subscription1, true, true)


      data1.set(3)
    })();


    (() => {
      let data1 = new Data(4)
      let subscription1 = (e) => {
        fail()
        
      } 
      let d = new DataSubscription(data1, subscription1, true, false)

      data1.set(4)
    })();
  })

  test("Get active state", () => {
    let d = new Data(4)
    let subscription1 = (e) => {
      
    } 
    let s = new DataSubscription(d, subscription1, true, false)

    expect(s.active()).toBe(true)
    s.active(!s.active())
    expect(s.active()).toBe(false)
    s.activate()
    expect(s.active()).toBe(true)
    s.deacivate()
    s.deacivate()
    expect(s.active()).toBe(false)
    s.activate()
    s.active(true)
    expect(s.active()).toBe(true)
    s.activate()
    s.active(true)
    s.deacivate()
    expect(s.active()).toBe(false)
  })


  test("Active state change", () => {
    let d = new Data(4)
    let i = 0
    let subscription1 = (e) => {
      i++
      if (i === 1) expect(e).toBe(4)
      else if (i === 2) expect(e).toBe(4)
      else if (i === 3) expect(e).toBe(5)
      else if (i === 4) expect(e).toBe(6)
      else if (i === 5) expect(e).toBe(2)
      else if (i === 6) fail()
    } 
    let s = new DataSubscription(d, subscription1)

    s.active(false)
    d.set(123)
    s.active(false)
    d.set(4)
    s.active(true)
    s.activate()
    s.activate()
    d.set(5)
    s.deacivate()
    s.deacivate()
    s.active(false)
    d.set(6)
    s.active(!s.active())
    s.deacivate()
    d.set(0)
    d.set(2)
    s.activate()
    d.set(2)
  })

  test("Subscription and Data getter", () => {
    let d = new Data(4)
    let subscription1 = (e) => {
      expect(e).toBe(4)
    } 
    let s = new DataSubscription(d, subscription1)

    expect(s.subscription()).toBe(subscription1)
    expect(s.data()).toBe(d)
  })



  test("Subscription change", () => {
    let d = new Data(4)
    let subscription1 = (e) => {
      expect(e).toBe(4)
    } 
    let i = 0
    let subscription2 = (e) => {
      i++
      if (i === 1) expect(e).toBe(4)
      else if (i === 2) expect(e).toBe(6)
    }
    let subscription3 = (e) => {
      fail()
    }
    let s = new DataSubscription(d, subscription1)

    s.subscription(subscription2)
    d.set(6)
    s.subscription(subscription3, false)
  })


  test("Data change", () => {
    let d = new Data(4)
    let i = 0
    let subscription1 = (e) => {
      i++
      if (i === 1) expect(e).toBe(4)
      else if (i === 2) expect(e).toBe(6)
      else if (i === 3) expect(e).toBe(7)
      else if (i === 4) fail()
    }
    let s = new DataSubscription(d, subscription1)

    let d2 = new Data(4)
    s.data(d2)
    d.set(231321)
    d.set(23)
    d.set(23)
    d2.set(6)
    d2.set(6)
    d2.set(7)
    s.data(d2)
    d.set(231321)
    d.set(23)
    d.set(23)
  })
    
})


describe("DataCollection", () => {
  test("Data support", () => {
    let d1 = new Data(1)
    let d2 = new Data(2)

    let d = new DataCollection(d1, d2)
    d.get((...a) => {
      expect(a).toEqual([1, 2])
    })
  })

  test("DataCollection support", () => {
    let d1 = new Data(1)
    let d2 = new Data("2")
    let dd = new DataCollection(d1, d2)
    let d3 = new Data(3)
    let d4 = new Data("4")

    let ddd = new DataCollection(dd, d3, d4)
    ddd.get((...a) => {
      expect(a).toEqual([[1, "2"], 3, "4"])
    })
  })
})
