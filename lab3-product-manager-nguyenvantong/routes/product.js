const express = require("express");
const router = express.Router();
const db = require("../aws/dynamodb");
const s3 = require("../aws/s3");
const upload = require("../middlewares/upload");
const { v4: uuidv4 } = require("uuid");
const {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

// READ - List all products
router.get("/", async (req, res) => {
    try {
        const result = await db.send(
            new ScanCommand({ TableName: "Products" })
        );

        res.render("list", { products: result.Items });
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi lấy danh sách sản phẩm");
    }
});

// GET route to display add product form
router.get("/add", (req, res) => {
    res.render("add");
});

// CREATE - Add new product with image upload
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        const item = {
            id: uuidv4(),
            name,
            price: Number(price),
            quantity: Number(quantity),
            url_image: req.file.location
        };

        await db.send(
            new PutCommand({
                TableName: "Products",
                Item: item
            })
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi thêm sản phẩm");
    }
});

// GET route to display edit product form
router.get("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await db.send(
            new GetCommand({
                TableName: "Products",
                Key: { id }
            })
        );

        if (!data.Item) {
            return res.status(404).send("Sản phẩm không tìm thấy");
        }

        res.render("edit", { product: data.Item });
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi lấy thông tin sản phẩm");
    }
});

// UPDATE - Update product by ID
router.post("/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const { id } = req.params;

        let updateExpr = "SET #n=:n, price=:p, quantity=:q";
        let values = {
            ":n": name,
            ":p": Number(price),
            ":q": Number(quantity)
        };

        if (req.file) {
            updateExpr += ", url_image=:img";
            values[":img"] = req.file.location;
        }

        await db.send(
            new UpdateCommand({
                TableName: "Products",
                Key: { id },
                UpdateExpression: updateExpr,
                ExpressionAttributeNames: { "#n": "name" },
                ExpressionAttributeValues: values
            })
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi cập nhật sản phẩm");
    }
});

// DELETE - Delete product and its image from S3
router.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve product data to get image URL
        const data = await db.send(
            new GetCommand({
                TableName: "Products",
                Key: { id }
            })
        );

        if (!data.Item) {
            return res.status(404).send("Sản phẩm không tìm thấy");
        }

        const imageUrl = data.Item.url_image;
        // Extract S3 key from the URL (format: https://bucket.s3.region.amazonaws.com/key)
        const key = imageUrl.split(".com/")[1];

        // Delete image from S3
        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET || "product-images-abc123",
                Key: key
            })
        );

        // Delete product from DynamoDB
        await db.send(
            new DeleteCommand({
                TableName: "Products",
                Key: { id }
            })
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi xóa sản phẩm");
    }
});


module.exports = router;
