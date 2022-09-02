const {appDataSource} = require("./datasource");

const signup = async (kakao_id,username)=>{
    return await appDataSource.query(
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
}

const isNew = async (kakao_id)=>{
    return await appDataSource.query(
        `
        SELECT EXISTS(
            SELECT *
            FROM users
            WHERE users.kakao_id ="${kakao_id}"
        )
        `
    )
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