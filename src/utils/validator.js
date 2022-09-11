const {BaseError} = require("../utils/baseError");

const validateEmail = (email) => {
    const emValidation = new RegExp(
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
    );

    if (!emValidation.test(email)) {
        throw new BaseError("INPUT_ERROR", 400, "THE_EMAIL_IS_OUT_OF_FORMAT")
    }
};

const validatePhone = (phone) => {
    const pValidation = new RegExp(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
    );

    if(!pValidation.test(phone)) {
        throw new BaseError("INPUT_ERROR", 400, "THE_NUMBER_IS_OUT_OF_FORMAT")
    }
}

module.exports = {
    validateEmail,
    validatePhone
}
