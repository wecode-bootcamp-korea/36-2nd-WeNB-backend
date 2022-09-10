const hostDao = require("../models/hostDao");
const {BaseError} = require("../utils/baseError");
const {validateEmail, validatePhone} = require("../utils/validator");

const getPrivilegesOnTheHost = async (email, phone, user_id) => {
    validateEmail(email);
    validatePhone(phone);
    const emailDuplicateCheck = await hostDao.emailCheck(email);
    const phoneDuplicateCheck = await hostDao.phoneCheck(phone);
    
    if(Number(Object.values(emailDuplicateCheck[0])[0])) {
        throw new BaseError("EMAIL_DUPLICATE", 400)
    }
    if(Number(Object.values(phoneDuplicateCheck[0])[0])) {
        throw new BaseError("PHONE_DUPLICATE", 400)
    }
    const createHost = await hostDao.createHost(
        email,
        phone,
        user_id
    );
    return createHost
}

module.exports = {
    getPrivilegesOnTheHost
}
