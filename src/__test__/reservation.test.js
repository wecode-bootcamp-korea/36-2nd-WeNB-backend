const request = require("supertest")

const { createApp } = require("../../app")
const { appDataSource } = require("../models/datasource")

describe("Accommodation reservation", () => {
    let app;

    beforeAll(async()=>{
        app = createApp();
        await appDataSource.initialize();
    })

    afterAll(async()=>{
        await appDataSource.destroy();
    })
    
    test("FAILED: controllerKeyError", async() =>{
        await request(app)
        .post("/place/reservation")
        .send({ })
        .expect(400)
        .expect({ message: "KEY_ERROR" });
    })

    test("FAILED: maxCapacity<", async() =>{
        await request(app)
        .post("/place/reservation")
        .send({ userId:"4", placeId:"17", guestNumber:"3", availableFrom:"2022-08-30", availableUntil:"2022-08-31"})
        .expect(400)
        .expect({ message: "EXCEEDING_THE_NUMBER_OF_PEOPLE" });
    })


    test("FAILED: maxDays<", async() =>{
        await request(app)
        .post("/place/reservation")
        .send({ userId:"4", placeId:"17", guestNumber:"2", availableFrom:"2022-08-22", availableUntil:"2022-08-31"})
        .expect(400)
        .expect({ message: "RESERVATION_DAYS_ARE_NOT_CORRECT" });
    })

    test("FAILED: maxDays=0", async() =>{
        await request(app)
        .post("/place/reservation")
        .send({ userId:"4", placeId:"17", guestNumber:"2", availableFrom:"2022-08-30", availableUntil:"2022-08-30"})
        .expect(400)
        .expect({ message: "RESERVATION_DAYS_ARE_NOT_CORRECT" });
    })
    
    test("FAILED: rentStart< >", async() =>{
        await request(app)
        .post("/place/reservation")
        .send({ userId:"4", placeId:"17", guestNumber:"2", availableFrom:"2022-08-25", availableUntil:"2022-08-27"})
        .expect(400)
        .expect({ message: "RESERVATION_SCHEDULE_DOES_NOT_MATCH" });
    })

    test("FAILED: < >restEnd", async() =>{
        await request(app)
        .post("/place/reservation")
        .send({ userId:"4", placeId:"17", guestNumber:"2", availableFrom:"2022-09-08", availableUntil:"2022-09-11"})
        .expect(400)
        .expect({ message: "RESERVATION_SCHEDULE_DOES_NOT_MATCH" });
    })

    test("SUCCESS: GOOD reservation", async() =>{
        await request(app)
        .post("/place/reservation")
        .send({ userId:"4", placeId:"17", guestNumber:"2", availableFrom:"2022-09-05", availableUntil:"2022-09-07"})
        .expect(201)
        .expect({ message: "SUCCESS_RESERVATION" });
    })
})