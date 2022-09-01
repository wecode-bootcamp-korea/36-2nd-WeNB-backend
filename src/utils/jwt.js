const jwt = require("jsonwebtoken");
const { logger } = require("../logs/config/winston");
const errorHandler = require("./baseError");
require("dotenv").config();

/** payLoad : { name : ?, exp: ?, iss: ? } */
const makeToken = (payLoad)=>{
    try{
        const secretKey = process.env.SECRET_KEY;
        const exp = process.env.EXP
        const result = jwt.sign(payLoad,secretKey,{expiresIn: exp, issuer: 'WeNV'});
        logger.info(`makeToken: ${result !== undefined}`);
        return result;
    }catch(err){
        throw new errorHandler.BaseError('BAD_REQUEST', 400, err.message)
    }
}    
/** token exp : 15m */
const validation = (req, res, next)=>{
    try{
        const secretKey = process.env.SECRET_KEY;
        const result = jwt.verify(req.headers.authorization, secretKey);
        logger.info(`validation: ${result.username !== undefined}`)
        if(result){
            req.body.name = result.name;
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