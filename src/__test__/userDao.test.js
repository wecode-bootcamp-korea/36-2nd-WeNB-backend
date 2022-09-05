require("dotenv").config();
const { appDataSource } = require("../models/datasource");
const userDao = require("../models/userDao");

const userDaoFakeResolve = (value)=>{
    return appDataSource.query = jest.fn().mockResolvedValue(value)
}
const userDaoFakeReject = (value)=>{
    return appDataSource.query = jest.fn().mockRejectedValue(value);
}
const userDaoFakeReturn = (value)=>{
    return appDataSource.query = jest.fn().mockReturnValueOnce(value);
}

describe("userDao unitTest: 1.signup 2.isNew", ()=>{
    
    test("signup 함수 확인: success", async()=>{

        userDaoFakeResolve({success : 1})
        await userDao.signup().then((res)=>{
            expect(res.success).toBe(1)
        })        
    })

    test("signup 함수 확인: fail", async()=>{

        userDaoFakeReject(()=>{throw new Error("ㅠㅠ")})
        await userDao.signup().catch((rej)=>{
            expect(rej).toThrow()
        })
    })

    test("isNew 함수 확인", async()=>{
        userDaoFakeReturn(0)
        const ok = await userDao.isNew(100);
        expect(ok).toBe(0)
    })

    test("isNew 함수 확인", async()=>{
        userDaoFakeReturn(1)
        const ok = await userDao.isNew(200);
        expect(ok).not.toBe(0)
    })

    test("getUserId", async()=>{
        userDaoFakeReturn(1)
        const ok = await userDao.getUserId(100);
        expect(ok).toBe(1)
    })

})