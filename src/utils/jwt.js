const jwt = require("jsonwebtoken");
const { logger } = require("../logs/config/winston");
const { BaseError } = require("./baseError");
require("dotenv").config();

/** payLoad : { name : ?, exp: ?, iss: ? } */
const makeToken = (payLoad)=>{
        const secretKey = process.env.SECRET_KEY;
        const exp = process.env.EXP
        const result = jwt.sign(payLoad,secretKey,{expiresIn: exp, issuer: 'WeNB'});
        if(!result){
            throw new BaseError("validationError",500 ,"token problem")
        }
        return result;
}    
/** token exp : 15m */
const validation = (req, res, next)=>{
    try{
        const secretKey = process.env.SECRET_KEY;
        const result = jwt.verify(req.headers.authorization, secretKey);
        const {kakao_id, username} = result;
        logger.info(`validation: ${result.username !== undefined}`)
        if(result){
            req.body = {kakao_id, username}
            next();
        }
        
    }catch(err){
        if(err.name === "TokenExpiredError"){
            logger.info(`token ${err.name}`)
            res.status(401).json({message : "TokenExpiredError"})
        }else{
            logger.error(`token`)
            res.status(400).json({message : "invalidToken"})
        }
    }   
}

module.exports={
    makeToken, validation
}