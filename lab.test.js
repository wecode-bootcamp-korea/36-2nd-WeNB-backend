const {add} = require("./lab");

describe("add: (a,b) a와 b 를 더해준다.", ()=>{

    test("add: (1) 은 1", ()=>{
        expect(1).toBe(1)
    })

    test("add: (3,4)는 7", ()=>{
        expect(add(3,4)).toBe(7)
    })

    test("add: (10,11)은 21", ()=>{
        expect(add(10,11)).not.toBe(100)
    })

})