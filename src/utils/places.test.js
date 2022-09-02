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
                            "id": 1,
                            "name": "alpha house",
                            "price": "1234567890.12",
                            "latitude": "123.1234567",
                            "longitude": "1234.1234567",
                            "available_from": "2011-09-12T02:23:34.000Z",
                            "available_until": "2011-12-12T03:00:00.000Z",
                            "image_urls": [
                                "https://drive.google.com/uc?id=12JWyEmA7GfIjkXwQi0GMkczPc0hdFuL7"
                            ],
                            "average_rate": 2.1
                        }
                    ]
                );
    });
});