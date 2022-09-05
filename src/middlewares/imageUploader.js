const aws = require('aws-sdk')
const multer = require('multer')
const multers3 = require('multer-s3')
const path = require('path')

aws.config.update({
    region: process.env.region,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
});

const s3 = new aws.S3();

const fileFormat = ['.png', '.jpg', '.jpeg', '.bmp'];

const imageUploader = multer({
    storage: multers3({
        s3: s3,
        bucket: 'wenb-s3',
        acl: 'public-read',
        key: (req, file, cb) => {
            const directory = req.query.directory ?? ''
            const extension = path.extname(file.originalname)
            if(!fileFormat.includes(extension)){
                return cb(new Error('WRONG_EXTENSION'))
            }
            cb(null, `${directory}/${file.originalname}`
        )}
    }),
})

module.exports = {
    imageUploader
}