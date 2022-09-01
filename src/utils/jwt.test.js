const target = require("./jwt");
const jwt = require("jsonwebtoken");

const { createApp } = require("../../app")
const request = require("supertest");

describe("토큰 발급(인증, 인가) 테스트",()=>{

    describe("토큰을 만들 수 있는지 테스트 합니다", ()=>{

        test("success: 토큰 생성",()=>{
            const exp = process.env.EXP
            expect(target.makeToken({username : "hello"}).split(".")[1])
            .toBe(jwt.sign({username : "hello"}, "secret",{expiresIn: exp, issuer: 'WeNV'}).split(".")[1])
        });

        test("failed: payLoad 가 다르다면 서로 다른 토큰을 만듭니다.", ()=>{
            const exp = process.env.EXP
            expect(target.makeToken({username : "hello"}).split(".")[1])
            .not.toBe(jwt.sign({username : "hello2"}, "secret",{expiresIn: exp, issuer: 'WeNV'}).split(".")[1])
        })

        test("failed: payLoad 가 없다면 error 를 던집니다.", ()=>{
            expect(()=>target.makeToken()).toThrow()
        });
    })

    describe("토큰 검증을 테스트 합니다.", ()=>{
        let app;
        let token;

        beforeEach(async()=>{
            app = createApp(); 
            token = target.makeToken({username : "hello"})
            app.post("/test",target.validation, (req,res)=>{
                res.status(201).json({message : "validToken"})
            })
        })


        test("success: 토큰 검증 성공", async ()=>{
            await request(app)
            .post("/test")
            .set({Authorization : token})
            .expect(201)
            .expect({message : "validToken"})
        })

        test("failed: 토큰 검증 실패", async ()=>{
            await request(app)
            .post("/test")
            .set({Authorization : "token"})
            .expect(400)
            .expect({message : "invalidToken"})
        })
    })
})