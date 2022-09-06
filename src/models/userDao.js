// const { database } = require("./datasource");
const { appDataSource } = require("../models/datasource")

const signup = async (kakao_id,username)=>{
    const result = await appDataSource.query(
    `
    INSERT INTO users (
        kakao_id,
        user_type_id,
        username
    ) VALUES (
        ?,?,?
    )
    `,[kakao_id, 1, username]
    )
    return result
}

const getOrCreateUser = async(kakaoId, nickName) => {
		let isCreated = false

		const result = await appDataSource.query(`
			SELECT EXISTS id
			FROM users
			WHERE users.kakao_id = "${kakaoId}" 
		`)

		if (!result.isExist) {
			await appDataSource.query(`
				INSERT INTO users (
						kakao_id,
						user_type_id,
						username
				) VALUES (
						?,?,?
				)
				`,[kakaoId, 1, userName]
			)

			isCreated = true
		}

		const result = await appDataSource.query(`
			SELECT *
			FROM users
			WHERE users.kakao_id = "${kakaoId}" 
		`)
	
		return [result.fetchOne(), isCreated]
}

const isNew = async (kakao_id)=>{
    const result = await appDataSource.query(
        `
        SELECT EXISTS(
            SELECT *
            FROM users
            WHERE users.kakao_id ="${kakao_id}"
        )
        `
    )
    return result;
}

const getUserId = async(kakao_id)=>{
    return await appDataSource.query(
    `
    SELECT id
    FROM users
    WHERE users.kakao_id = "${kakao_id}" 
    `
    )
}

module.exports = {
    signup,isNew,getUserId
}
