const hostService = require("../services/hostService");
const {BaseError} = require("../utils/baseError")

const getPrivilegesOnTheHost = async (req, res) => {
    const {email, phone, userId} = req.body;
    if (!email || !phone || !userId ) throw new BaseError("KEY_ERROR", 400, "KEY_ERROR");

    await hostService.getPrivilegesOnTheHost(email, phone, userId);

    res.status(201).json({message: "HOST_REGISTRATION_COMPLETE"});
};

module.exports = {
    getPrivilegesOnTheHost
}