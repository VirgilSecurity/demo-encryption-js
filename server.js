const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const { JwtGenerator } = require('virgil-sdk');
const { VirgilCrypto, VirgilAccessTokenSigner } = require('virgil-crypto');

app.use(bodyParser.json())

// Enable cors, you don't need this, if you using same domain
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const crypto = new VirgilCrypto();
const { appId, apiKeyId, apiPrivateKey } = require('./config');

const generator = new JwtGenerator({
    appId: appId,
    apiKeyId: apiKeyId,
    apiKey: crypto.importPrivateKey(apiPrivateKey),
    accessTokenSigner: new VirgilAccessTokenSigner(crypto)
});

app.post('/generate_jwt', (req, res) => {
    if (!req.body || !req.body.identity) return res.status(400).send('identity param is required');
    const virgilJwtToken = generator.generateToken(req.body.identity);
    res.send(virgilJwtToken.toString());
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
