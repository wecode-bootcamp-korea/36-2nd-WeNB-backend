const uesrController = require("../controllers/userController");
const userService = require("../services/userService");
const httpMocks = require("node-mocks-http")
jest.mock("../services/userService")

describe("userController unit test", ()=>{
    
    test("kakaoCode: success",async()=>{
        const req = httpMocks.createRequest({
            method : "get",
            url: "http://127.0.0.1:3000/kakao/auth",
            query : {code : "12345"}
        })
        const res = httpMocks.createResponse();
        await uesrController.kakaoCode(req,res).then((res)=>{
            expect(res.statusCode).toBe(200)
        })
    })

    test("kakaoCode: fail",async()=>{
        const req = httpMocks.createRequest({
            method : "get",
            url: "http://127.0.0.1:3000/kakao/auth",
            query : {code : "12345"}
        })
        const res = httpMocks.createResponse();
        try{
            await uesrController.kakaoCode(req,res)
        }catch(err){
            expect(err.statusCode).toBe(400)
        }
    })

    test("logOut: success", async()=>{
        const req = httpMocks.createRequest({
            method : "post",
            url : "http://127.0.0.1:3000/kakao/logout",
            Headers : {Authorization : "ok"}
        })
        const res = httpMocks.createResponse();
        
        await uesrController.logOut(req,res).then((res)=>{
            expect(res.statusCode).toBe(200)
        })
    })

    test("logOut: fail",async()=>{
        const req = httpMocks.createRequest({
            method : "post",
            url: "http://127.0.0.1:3000/kakao/auth",
            Headers : {Authorization : "ok"}
        })
        const res = httpMocks.createResponse();
        try{
            await uesrController.logOut(req,res)
        }catch(err){
            expect(err.statusCode).toBe(400)
        }
    })
})