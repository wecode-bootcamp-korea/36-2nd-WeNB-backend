const request = require("supertest");

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

    test.skip("SUCCESS: prints out 1 place information", async () => {
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
                                "https://wenb-bucket.s3.us-west-2.amazonaws.com/hotel8.jpg"
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
    })
});