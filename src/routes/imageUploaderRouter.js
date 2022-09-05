const express = require("express");
const router = express.Router();

const {imageUploader} = require("../middlewares/imageUploader")

router.post('/test', imageUploader.array('images'), (req, res) => {
    try{
        // console.log(req)
        let payload = {url: req.file.location}
        res.status(200).json({payload})
    } catch (err){
        res.status(500).json({message: "server error"})
    }
})

module.exports = {
    router
}