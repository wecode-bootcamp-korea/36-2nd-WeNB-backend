const request = require("supertest");
const { createApp } = require("../app");
const { AppDataSource } = require("../models/dataSource");

describe("userController unit test", () => {

		let app;

		beforeAll(async() => {

			app = createApp()
			const db = await AppDataSource.initialize()

			db.query(`INSERT INTO users (id, kakaoId, ..) VALUES (id,))`)

		})
		
		afterAll(async () => {
			await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
			await AppDataSource.query(`TRUNCATE users`);
			await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 1`);
			await AppDataSource.destroy();
		});

	 test("SUCCESS: kakao signin", async () => {
		 // mocking 2번 필요. 
			axios.get = jest.fn().mockReturnValue({
				data: {
					id: 1010101022,
					connected_at: "2022-08-30T14:41:02Z",
					properties: {
						nickname: "0000",
					},
					kakao_account: {
						profile_nickname_needs_agreement: false,
						profile: {
							nickname: "0000",
						},
						has_email: true,
						email_needs_agreement: false,
						is_email_valid: true,
						is_email_verified: true,
						email: "hong@gmail.com",
					},
				},
			});

    await request(app)
      .post("/auth/signIn")
      .set({
        Authorization: "Bearer accessToken",
      })
      .expect(200);
  }); 
