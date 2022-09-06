const { database } = require("./datasource");

const signup = async (kakao_id,username)=>{
    const result =  await database.query(
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

		return result.getLastInsertedId()
}

const isNew = async (kakao_id)=>{
    const result = await database.query(
        `
        SELECT EXISTS(
            SELECT *
            FROM users
            WHERE users.kakao_id ="${kakao_id}"
        )
        `
    )

		return result.isExist()
}

const getUserId = async(kakao_id)=>{
    return await database.query(
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
