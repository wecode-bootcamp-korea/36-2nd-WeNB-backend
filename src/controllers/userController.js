const userService = require("../services/userService");
const { BaseError } = require("../utils/baseError");

const kakaoCode = async (req, res)=>{
		const { authCode } = req.query.code 

		if (!authCode) throw new BaseError("validation",400,"no_kakaocode")

		const accessToken = userService.SignInWithKakao(authCode)

		return res.status(200).send({token : accessToken})
}

const logOut = async (req,res)=>{
    const ourToken = req.headers.authorization;
    const expiredId = await userService.logOutKaKao(ourToken);
    return res.status(200).send({message: "success", userId: expiredId}) 
}

const re = async (req, res)=>{
    const payLoad = req.body
    const newToken = await userService.newToken(payLoad)
    return res.status(200).send({message: "success", token : newToken})
}

module.exports = {
    kakaoCode, logOut, re
}
