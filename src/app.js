const express = require("express");
const qrcode = require("qrcode");
const app = express();
const port = 3000;
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/doc.html');
});

app.get("/qrcode", (req, res) => {
    const text = req.query.text;
    if (!text) {
        res.status(400).send("Text parameter is required");
        return;
    }

    qrcode.toFile(path.join(__dirname, 'uploads/qrcode.png'), text, { type: "png" }, function (err) {
        if (err) {
            res.status(500).send("Error generating QR code");
            return;
        }

        res.download(path.join(__dirname, 'uploads/qrcode.png'), "qrcode.png", function (err) {
            if (err) {
                res.status(500).send("Error downloading QR code");
                return;
            }
        });
    });
});

app.listen(port, () => {
    console.log(`QR code API listening at http://localhost:${port}`);
});