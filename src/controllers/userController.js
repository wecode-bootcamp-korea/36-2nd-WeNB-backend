const userService = require("../services/userService");
const { BaseError } = require("../utils/baseError");

const kakaoCode = async (req, res)=>{
    if(req.query.code){
        const {code} = req.query;
        const rawData = await userService.kakaoToken(code)
        const ourToken = await userService.getOurToken(rawData)
        res.status(200).send({message : "success", token : ourToken})
    }else{
        throw new BaseError("validation",400,"no_kakaocode")
    }   
}

const logOut = async (req,res)=>{
    const ourToken = req.headers.authorization;
    const expiredId = await userService.logOutKaKao(ourToken);
    res.status(200).send({message: "success", userId: expiredId}) 
}

module.exports = {
    kakaoCode, logOut
}