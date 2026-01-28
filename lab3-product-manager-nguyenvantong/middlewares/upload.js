require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../aws/s3");
const { v4: uuidv4 } = require("uuid");

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET || "product-images-abc123",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `products/${uuidv4()}-${file.originalname}`);
        }
    })
});

module.exports = upload;
