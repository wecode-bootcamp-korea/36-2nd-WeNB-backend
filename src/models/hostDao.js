const { appDataSource } = require("./datasource");

const emailCheck = async(email) => {
        return await appDataSource.query(
            `
            SELECT EXISTS(
                SELECT
                    email
                FROM users
                WHERE email = '${email}'
            )
            `
        );
}

const phoneCheck = async(phone)=> {
        return await appDataSource.query(
            `
            SELECT EXISTS(
                SELECT
                    phone
                FROM users
                WHERE phone = '${phone}'
            )
            `
        );
}

const createHost = async (email, phone, userId,) => {
        return await appDataSource.query(
        `
        UPDATE users
        SET 
            user_type_id = 2,
            email = '${email}',
            phone = '${phone}'
        WHERE users.id = ${userId}
        `
        )
}
module.exports = {
    emailCheck,
    phoneCheck,
    createHost
}