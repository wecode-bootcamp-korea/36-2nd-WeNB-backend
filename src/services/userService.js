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

const getKakaoToken = async (code)=>{
    const response = await axios({
        method: "post",
        url : "https://kauth.kakao.com/oauth/token",
				// timeout: {}
        headers : {"Content-type": "application/x-www-form-urlencoded"},
        data : qs.stringify({"grant_type": "authorization_code", 
					"client_id":REST_API_KEY, 
					"redirect_uri": redirect_uri, 
					"code": code,
					"client_secret": "TQOAw1ygO0BPQeoS1oAVEGzn7ZKKoPSU"
				})
    });

		if (!response.statusCode === 200) throw new Error()

		return response.data
}

const getKakaoUser = async (accessToken) => {
    const user = await axios({
        method: "get",
				// timeout: {}
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {"Authorization": `Bearer ${accessToken}`}
    })

		if (!response.statusCode === 200) throw new Error()

		return response.data
} 

const signInWithKakao = async (authCode) => {
	const aceessToken = await getKakaoToken(authCode)
	const kakaoUser   = await getKakaoUser(accessToken)

	const [user, isCreated] = await userDao.getOrCreateUser({
		kakaoId : KakaoUser.id,
		userName : KakaoUser.properties.nickname
	})
	
	// 로그인 할 때마 nickname을 업데이트 해주고 싶은 경우.
	if (!isCreated) await userDao.updateUser(kakaoUser.profileImage)

	const accessToken = jwt.makeToken({id: user.id, ..})

	return accessToken
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

const newToken = async(payLoad)=>{
    const token = jwt.makeToken(payLoad)
    return token
}

module.exports = {
    kakaoToken,getOurToken,logOutKaKao,newToken
}
