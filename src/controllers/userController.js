const userService = require("../services/userService");
const { BaseError } = require("../utils/baseError");

const kakaoCode = async (req, res)=>{
    if(req.query.code){
        const {code} = req.query;
        const rawData = await userService.kakaoToken(code)
        const ourToken = await userService.getOurToken(rawData)
        return res.status(200).send({message : "success", token : ourToken})
    }else{
        throw new BaseError("validation",400,"no_kakaocode")
    }   
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