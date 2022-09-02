const axios = require("axios");
const jwt = require("../utils/jwt");
const jwt2 = require("jsonwebtoken");
const userDao = require("../models/userDao")

require("dotenv").config();
const qs = require("qs")
const REST_API_KEY = process.env.REST_API_KEY
const redirect_uri = process.env.redirect_uri
const ADMIN_KEY = process.env.REST_API_ADMIN_KEY
const secretKey = process.env.SECRET_KEY

const kakaoToken = async (code)=>{
    return await axios({
        method: "post",
        url : "https://kauth.kakao.com/oauth/token",
        headers : {"Content-type": "application/x-www-form-urlencoded"},
        data : qs.stringify({"grant_type": "authorization_code", 
                  "client_id":REST_API_KEY, 
                    "redirect_uri": redirect_uri, 
                    "code": code,
                    "client_secret": "TQOAw1ygO0BPQeoS1oAVEGzn7ZKKoPSU"
                        })
        });
}

const getOurToken = async (rawData)=>{
    let userId;
    const accessToken = rawData.data.access_token;
    const userInfo = await axios({
        method: "get",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {"Authorization": `Bearer ${accessToken}`}
    })
    const kakao_id = Number(userInfo.data.id);
    const username = userInfo.data.properties.nickname
    const isNew = await userDao.isNew(kakao_id)
    if(Object.values(isNew[0])[0] === '0'){
        await userDao.signup(kakao_id,username);
        userId = await userDao.getUserId(kakao_id);
    }else{
        userId = await userDao.getUserId(kakao_id);
    }
    userInfo.data.user_id = userId[0].id;
    const ourToken = jwt.makeToken(userInfo.data)
    return ourToken
}

const logOutKaKao = async (ourToken)=>{
        const user = jwt2.verify(ourToken, secretKey)
        const userId = user.id
        const expiredId = await axios({
            method : "post",
            url : "https://kapi.kakao.com/v1/user/logout",
            headers : {"Content-Type": "application/x-www-form-urlencoded",
                       "Authorization": `KakaoAK ${ADMIN_KEY}`},
            data : qs.stringify({
                "target_id_type": "user_id",
                "target_id": userId
            })
        })
        return (expiredId.data.id)
}

module.exports = {
    kakaoToken,getOurToken,logOutKaKao
}