require("dotenv").config();

const userService = require("../services/userService");
const axios = require("axios");
const jwt = require("../utils/jwt");
const jwt2 = require("jsonwebtoken");
const { appDataSource } = require("../models/datasource");

jest.mock('axios');

describe("kakaotoken:", ()=>{
    
    test("success", async()=>{
        axios.mockResolvedValue({id : 1, name: "ok"});
        const result = await userService.kakaoToken()
        expect(result).toHaveProperty("id", 1);
        expect(result).toHaveProperty("name", "ok");
    })
    test("fail", async()=>{
        axios.mockRejectedValue(()=>{throw new Error("ㅠㅠ")})
        await userService.kakaoToken().catch((rej)=>{
            expect(rej).toThrow();
        })
        
    })
})

const sample = {
    id: 2412435778,
    connected_at: '2022-09-01T08:47:15Z',
    properties: { nickname: '라이언' },
    kakao_account: {
      profile_nickname_needs_agreement: false,
      profile: { nickname: '라이언' }
    },
    user_id: 1
  }


describe("getOurToken:", ()=>{
        
    test("success", async()=>{
        
        const mockRowData = jest.fn().mockReturnValueOnce({data: sample})
        appDataSource.query = jest.fn().mockReturnValueOnce([{x : "0"}]);
        axios.mockResolvedValue({data : sample});
        const temp = await userService.getOurToken(mockRowData())
        expect(temp).toBe(jwt.makeToken(sample));
        
    })
})

describe("logOutKaKao:", ()=>{

    test("success", async()=>{
        const mockFn = jest.fn();
        mockFn.mockReturnValueOnce({id : "ok"});
        mockFn.mockReturnValueOnce({id : "ok"});
        ourToken = jwt.makeToken({abc : "abc"});
        user = mockFn();
        expiredId = mockFn();
        secretKey = process.env.SECRET_KEY;
        axios.mockResolvedValue({data : { id : "ok"}})
        const result = await userService.logOutKaKao(ourToken)
        expect(result).toBe("ok")
    })

})
