const https = require('https');
const fs = require('fs');
const express = require("express");
const qrcode = require("qrcode");
const app = express();
const port = 3000;


const options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt')
};

const server = https.createServer(options, app);

app.use((req, res, next) => {
    if (req.protocol === 'http') {
        res.redirect(`https://${req.headers.host}${req.url}`);
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.send("Welcome to qr code api");
})

app.get("/qrcode", (req, res) => {
    const text = req.query.text;
    if (!text) {
        res.status(400).send("Text parameter is required");
        return;
    }

    qrcode.toFile("/src/uploads/qrcode.png", text, { type: "png" }, function (err) {
        if (err) {
            res.status(500).send("Error generating QR code");
            return;
        }

        res.download("/src/uploads/qrcode.png", "qrcode.png", function (err) {
            if (err) {
                res.status(500).send("Error downloading QR code");
                return;
            }
        });
    });
});

server.listen(port, () => {
    console.log(`QR code API listening at http://localhost:${port}`);
});
