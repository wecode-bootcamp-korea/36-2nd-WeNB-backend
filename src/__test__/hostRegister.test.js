const request = require("supertest")

const { createApp } = require("../../app")
const { appDataSource } = require("../models/datasource")

describe("HOST REGISTER", () => {
    let app;

    beforeAll(async()=>{
        app = createApp();
        await appDataSource.initialize();
    })

    afterAll(async()=>{
        await appDataSource.destroy();
    })

    test("SUCCESS: createHost", async () => {
        await request(app)
        .patch("/host/register")
        .send({email: "kakao@koko.com", phone: "010-3345-6875", userId:3})
        .expect(201)
        .expect({ message: "HOST_REGISTRATION_COMPLETE" })
    })

    test("FAILED: invalid email", async () => {
        await request(app)
        .patch("/host/register")
        .send({email: "http.ttp", phone:"010-1234-5678", userId:3})
        .expect(400)
        .expect({ message: "THE_EMAIL_IS_OUT_OF_FORMAT" });
    });

    test("FAILED: invalid phone", async () => {
        await request(app)
        .patch("/host/register")
        .send({email: "https@http.ttp", phone:"010-1234-56789", userId:3})
        .expect(400)
        .expect({ message: "THE_NUMBER_IS_OUT_OF_FORMAT" });
    });

    test("FAILED: email duplicate", async () => {
        await request(app)
        .patch("/host/register")
        .send({email: "kakao@koko.com", phone: "010-3345-6875", userId:3})
        .expect(400)
        .expect({ message: "EMAIL_DUPLICATE" })
    })

    test("FAILED: phone duplicate", async () => {
        await request(app)
        .patch("/host/register")
        .send({email: "okoklah@koko.com", phone: "010-3345-6875", userId:3})
        .expect(400)
        .expect({ message: "PHONE_DUPLICATE" })
    })
});
