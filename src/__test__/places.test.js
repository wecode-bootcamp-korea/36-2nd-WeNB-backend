const request = require("supertest");
const jwt = require('jsonwebtoken');
const token = require("../utils/jwt");

const { createApp } = require('../../app');
const { appDataSource } = require('../models/datasource');

describe('GET/places', () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await appDataSource.initialize();
    });

    afterAll(async () => {
        await appDataSource.destroy();
    });

    test("SUCCESS: prints out 1 place information", async () => {
        await request(app)
                .get('/places')
                .query({ 
                    limit: 1, 
                    offset: 0
                })
                .expect(200)
                .expect(
                    [
                        {
                            "id": 115,
                            "name": "xilkl",
                            "price": "124058.00",
                            "latitude": "37.5000000",
                            "longitude": "127.0500000",
                            "available_from": "2021-12-31T15:00:00.000Z",
                            "available_until": "2022-12-31T02:59:59.000Z",
                            "image_urls": [
                                "https://wenb-s3.s3.ap-northeast-2.amazonaws.com/Accommodation_image/hotel6.jpg",
                                "https://wenb-s3.s3.ap-northeast-2.amazonaws.com/Accommodation_image/hotel6.jpg",
                                "https://wenb-s3.s3.ap-northeast-2.amazonaws.com/Accommodation_image/hotel11.jpg"
                            ],
                            "average_rate": 1
                        }
                    ]
                );
    });

    test("FAIL: If there were no more place to load, an empty array is returned", async () => {
        await request(app)
                .get('/places')
                .query({
                    limit: 30,
                    offset: 220
                })
                .expect(200)
                .expect([]);
    });
    
    test("SUCCESS: returns information about the called place, review, and ametnities it has", async () => {
        const id = 180;
        
        const response = await request(app)
                .get(`/places/${id}`)
                .expect(200);

        expect(response._body[0].id).toEqual(id);
        expect(response._body[0].reviews.length).toEqual(5);
        expect(response._body[0].amenities.length).toEqual(6);
    });

    test("FAIL: returns empty array if there is no place with requested id", async () => {
        const id = 100000;

        await request(app)
                .get(`/places/${id}`)
                .expect(200)
                .expect([]);
    });

});

describe("POST/places: ", () => {
    let app;
    let token1;
    let token2;

    beforeEach(async () => {
        app = createApp();
        await appDataSource.initialize();
        await appDataSource.query(
            `INSERT INTO users(
                kakao_id,
                username,
                user_type_id,
                email,
                phone
            ) VALUES (?,?,?)
            `,
            [1, "tester1", 1, null, null]
            );

        await appDataSource.query(
            `INSERT INTO users(
                kakao_id,
                username,
                user_type_id,
                email,
                phone
            ) VALUES (?,?,?)
            `,
            [2, "tester2", 2, "tester2isHost@gmail.com", "010-2222-2222"]
        );  

        token1 = target.makeToken({username : "tester1"});
        token2 = target.makeToken({username : "tester2"});
    });

    afterEach(async () => {
        await appDataSource.query(`TRUNCATE users`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE bookings`);
        await appDataSource.query(`TRUNCATE reviews`);
        await appDataSource.query(`TRUNCATE images`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE amenities`);
        await appDataSource.query(`TRUNCATE amenity_bunches`);
        await appDataSource.destroy();
    });


    test("SUCCESS: returns place_id of posted place", async () => {
        await request(app)
                .post("/places")
                .set({Authorization : token2})
                .send(
                    {
                        "user_id": 2, 
                        "name": "some_place", 
                        "price": 10000.00, 
                        "max_capacity": 4, 
                        "latitude": 123.1234567, 
                        "longitude": 1234.1234567, 
                        "available_from": "2022-01-01 00:00:00.00", 
                        "available_until": "2022-02-01 11:59:59.00", 
                        "max_days": 7
                    }
                )
                .expect({
                    "message": "place with 1 place_id = Created",
                    "place_id": 1
                });
    });

    test("FAIL: returns error message if called user were not host", async () => {
        await request(app)
                .post("/places")
                .set({Authorization : token1})
                .send(
                    {
                        "user_id": 1, 
                        "name": "some_place", 
                        "price": 10000.00, 
                        "max_capacity": 4, 
                        "latitude": 123.1234567, 
                        "longitude": 1234.1234567, 
                        "available_from": "2022-01-01 00:00:00.00", 
                        "available_until": "2022-02-01 11:59:59.00", 
                        "max_days": 7
                    }
                )
                .expect(404)
                .expect(
                    {
                        message: "YOU_ARE_NOT_HOST"
                    }
                );
    });

    test("FAIL: returns error messsage if latitude were out of range set", async() => {
        await request(app)
                .post("/places")
                .set({Authorization : token2})
                .send(
                    {
                        "user_id": 2, 
                        "name": "some_place", 
                        "price": 10000.00, 
                        "max_capacity": 4, 
                        "latitude": 123456.1234567, 
                        "longitude": 1234.1234567, 
                        "available_from": "2022-01-01 00:00:00.00", 
                        "available_until": "2022-02-01 11:59:59.00", 
                        "max_days": 7
                    }
                )
                .expect(500)
                .expect(
                    {
                        message: "Out of range value for column 'latitude' at row 1"
                    }
                );
    });

    test("FAIL: returns error messsage if longitude were out of range set", async() => {
        await request(app)
                .post("/places")
                .set({Authorization : token2})
                .send(
                    {
                        "user_id": 2, 
                        "name": "some_place", 
                        "price": 10000.00, 
                        "max_capacity": 4, 
                        "latitude": 123.1234567, 
                        "longitude": 1234567.1234567, 
                        "available_from": "2022-01-01 00:00:00.00", 
                        "available_until": "2022-02-01 11:59:59.00", 
                        "max_days": 7
                    }
                )
                .expect(500)
                .expect(
                    {
                        message: "Out of range value for column 'longitude' at row 1"
                    }
                );
    });
});

describe("POST/amenity_bunches: ", () => {
    let app;
    let token1;

    beforeAll(async () => {
        app = createApp();
        await appDataSource.initialize();
        await appDataSource.query(
            `INSERT INTO users(
                kakao_id,
                username,
                user_type_id,
                email,
                phone
            ) VALUES (?,?,?,?,?)
            `,
            [1, "tester1", 1, "tester2isHost@gmail.com", "010-2222-2222"]
            );

        await appDataSource.query(
            `INSERT INTO places(
                user_id,
                name,
                price,
                max_capacity,
                latitude,
                logitude,
                available_from,
                available_until,
                max_days
            ) VALUES (?)
            `,
            [1, "testPlace", 100000.00, 4, 123.1234567, 1234.12345678, "2022-01-01 11:00:00.00", "2022-07-01 17:00:00.00"]
        );

        token1 = target.makeToken({username : "tester1"});
    });

    afterAll(async () => {
        await appDataSource.query(`TRUNCATE users`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE bookings`);
        await appDataSource.query(`TRUNCATE reviews`);
        await appDataSource.query(`TRUNCATE images`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE amenities`);
        await appDataSource.query(`TRUNCATE amenity_bunches`);
        await appDataSource.destroy();
    });

    test("SUCCESS: If the request were successful, a success message is returned", async () => {
        await request(app)
                .post('/places/amenity_bunches')
                .set({Authorization: token1})
                .send(
                    {
                        "place_id": 1,
                        "amenity_ids": [1,2,3,4,5]
                    }
                )
                .expect(201)
                .expect(
                    {
                        message: "ammenitiesRegistered"
                    }
                );
    });

    test("FAIL: if place_id were wrong, returns fail message", async () => {
        await request(app)
                .post('/places/amenity_bunches')
                .set({Authorization: token1})
                .send(
                    {
                        "place_id": 100000000,
                        "amenity_ids": [1,2,3,4,5]
                    }
                )
                .expect(404)
                .expect(
                    {
                        message: "WRONG_PLACE_CALLED"
                    }
                );
    });

    test("FAIL: if requested amenity_ids has amenity id that does not exist, returns fail message", async () => {
        await request(app)
                .post('/places/amenity_bunches')
                .set({Authorization: token1})
                .send(
                    {
                        "place_id": 1,
                        "amenity_ids": [8, 20]
                    }
                )
                .expect(404)
                .expect(
                    {
                        message: "AMENITY_DOES_NOT_EXIST"
                    }
                );        
    });
});

describe("DELETE/places/:place_id", () => {
    let app;
    let token1;

    beforeAll(async () => {
        app = createApp();
        await appDataSource.initialize();
        await appDataSource.query(
            `INSERT INTO users(
                kakao_id,
                username,
                user_type_id,
                email,
                phone
            ) VALUES (?,?,?,?,?)
            `,
            [1, "tester1", 1, "tester2isHost@gmail.com", "010-2222-2222"]
            );

        await appDataSource.query(
            `INSERT INTO places(
                user_id,
                name,
                price,
                max_capacity,
                latitude,
                logitude,
                available_from,
                available_until,
                max_days
            ) VALUES (?)
            `,
            [1, "testPlace", 100000.00, 4, 123.1234567, 1234.12345678, "2022-01-01 11:00:00.00", "2022-07-01 17:00:00.00"]
        );

        token1 = target.makeToken({username : "tester1"});
    });

    afterAll(async () => {
        await appDataSource.query(`TRUNCATE users`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE bookings`);
        await appDataSource.query(`TRUNCATE reviews`);
        await appDataSource.query(`TRUNCATE images`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE amenities`);
        await appDataSource.query(`TRUNCATE amenity_bunches`);
        await appDataSource.destroy();
    });

    test("SUCCESS: delete place with place_id", async () => {
        await request(app)
                .delete("/places")
                .set({Authorization: token1})
                .send({
                    place_id: 180
                })
                .expect(200)
                .expect(
                    {
                        message: "place with ID 221 is deleted"
                    }
                );
    });

    test("FAIL: called place_id does not exist", async () => {
        await request(app)
                .delete("/places")
                .set({Authorization: token1})
                .send({
                    place_id: 1000000000
                })
                .expect(404)
                .expect(
                    {
                        message: "PLACE_DOES_NOT_EXIST"
                    }
                );
    });
});

describe("Tests related to reviews", () => {
    let app;
    let token1;
    let token2;
    let token3;

    beforeAll(async () => {
        app = createApp();
        await appDataSource.initialize();
        await appDataSource.query(
            `INSERT INTO users(
                kakao_id,
                username,
                user_type_id,
                email,
                phone
            ) VALUES (?,?,?,?,?)
            `,
            [1, "tester1", 2, "tester1isHost@gmail.com", "010-2222-2222"]
        );

        await appDataSource.query(
            `INSERT INTO users(
                kakao_id,
                username,
                user_type_id,
                email,
                phone
            ) VALUES (?,?,?,?,?)
            `,
            [2, "tester2", 1, "tester2isHost@gmail.com", "010-4444-4444"]
        );

        await appDataSource.query(
            `INSERT INTO users(
                kakao_id,
                username,
                user_type_id,
                email,
                phone
            ) VALUES (?,?,?,?,?)
            `,
            [3, "tester3", 1, "tester3isHost@gmail.com", "010-6666-6666"]
        );
            
        await appDataSource.query(
            `INSERT INTO places(
                user_id,
                name,
                price,
                max_capacity,
                latitude,
                logitude,
                available_from,
                available_until,
                max_days
            ) VALUES (?)
            `,
            [1, "testPlace", 100000.00, 4, 123.1234567, 1234.12345678, "2022-01-01 11:00:00.00", "2022-07-01 17:00:00.00"]
        );

        await appDataSource.query(
            `INSERT INTO bookings(
                user_id,
                place_id,
                rent_from,
                rent_to,
                guest_number,
                total_price
            ) VALUES (?)
            `,
            [1, 1, "2022-02-01 11:00:00.00", "2022-02-04 17:00:00.00", 2, 300000.00]
        );

        await appDataSource.query(
            `INSERT INTO bookings(
                user_id,
                place_id,
                rent_from,
                rent_to,
                guest_number,
                total_price
            ) VALUES (?)
            `,
            [2, 1, "2022-02-05 11:00:00.00", "2022-02-08 17:00:00.00", 2, 300000.00]
        );

        await appDataSource.query(
            `INSERT INTO reviews(
                booking_id,
                place_id,
                rate,
                comment
            ) VALUES (?)
            `,
            [1, 1, 2.5, "this place is good."]
        )

        token1 = target.makeToken({username : "tester1"});
        token2 = target.makeToken({username : "tester2"});
        token3 = target.makeToken({username : "tester3"})
    });

    afterAll(async () => {
        await appDataSource.query(`TRUNCATE users`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE bookings`);
        await appDataSource.query(`TRUNCATE reviews`);
        await appDataSource.query(`TRUNCATE images`);
        await appDataSource.query(`TRUNCATE places`);
        await appDataSource.query(`TRUNCATE amenities`);
        await appDataSource.query(`TRUNCATE amenity_bunches`);
        await appDataSource.destroy();
    });

    test("SUCCESS: returns existing review", async () => {
        await request(app)
                .get("/places/reviews/1")
                .expect(200)
                .expect(
                    [
                        {
                            "rate": "2.5",
                            "comment": "this place is good."
                        }
                    ]
                );
    });

    test("FAIL: requests for reviews that dose not exist", async () => {
        await request(app)
                .get("/places/reviews/99999")
                .expect(200)
                .expect(
                    []
                );
    });

    test("SUCCESS: posts review", async () => {
        await request(app)
                .post("/places")
                .set({Authorization: token2})
                .send({
                    place_id: 1,
                    rate: 4.0,
                    comment: "this place is VERY VERY GOOD, you know?"  
                })
                .expect(
                    {
                        message: "reviewCreated"
                    }
                );
    });

    test("FAIL: place is wrong", async () => {
        await request(app)
                .post("/places")
                .set({Authorization: token2})
                .send({
                    place_id: 1,
                    rate: 1.2,
                    comment: "this place is VERY VERY GOOD, you know?"
                })
                .expect(500)
                .expect(
                    {
                        message: "Cannot add or update a child row: a foreign key constraint fails (`wenb`.`reviews`, CONSTRAINT `fk_reviews_place_id` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE)"
                    }
                );         
    });


})