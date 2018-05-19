class ModelStub {
    constructor() {
        this.crypto = new VirgilCrypto.VirgilCrypto()
        this.keyStorage = new Virgil.KeyStorage();
        this.cardCrypto = new VirgilCrypto.VirgilCardCrypto(this.crypto);
        this.cardVerifier = new Virgil.VirgilCardVerifier(this.cardCrypto);
    }

    configure(identity) {
        this.identity = identity;
        const getFuncJwt = (jwtUrl) => ({ operation }) => fetch(jwtUrl, {
            headers: new Headers({ 'Content-Type' : 'application/json'}),
            method: 'POST',
            body: JSON.stringify({ identity })
        }).then((res) => res.text());
        
            
        const jwtProvider = new Virgil.CallbackJwtProvider(
            getFuncJwt('http://localhost:3000/generate_jwt', identity)
        );

        this.cardManager = new Virgil.CardManager({
            cardCrypto: this.cardCrypto,
            cardVerifier: this.cardVerifier,
            accessTokenProvider: jwtProvider,
            retryOnUnauthorized: true
        });
    }

    async createCard () {
        const keyPair = this.crypto.generateKeys();

        // this.keyStorage.save(this.identity, this.crypto.exportPrivateKey(keyPair.privateKey));

        // const card = await this.cardManager.publishCard({
        //     privateKey: keyPair.privateKey,
        //     publicKey: keyPair.publicKey
        // });
        console.log('card', card)
        return Promise.resolve({ id: 'asdsd', content_snapshot: ''});
    };

    async searchCards (identity) {
        // return await this.cardManager.searchCards(identity);
        return Promise.resolve([{ content_snapshot: '' }]);
    }

    async encrypt (message, recipientIdentity) {
        // const recipientCards = await this.searchCards(recipientIdentity);
        // const senderPrivateKeyBytes = await this.keyStorage.load(this.identity);
        // const senderPrivateKey = this.crypto.importPrivateKey(senderPrivateKeyBytes);

        // if (recipientCards.length > 0) {
        //     const recipientPublicKeys = recipientCards.map(card => card.publicKey);
        //     const encryptedData = this.crypto.signThenEncrypt(
        //         message,
        //         senderPrivateKey,
        //         recipientPublicKeys
        //     );

        //     return encryptedData.toString('base64');
        // }
        return Promise.resolve('ENCRYPTED');
    }

    async decrypt (message, senderIdentity) {
        // const privateKeyData = await this.keyStorage.load(this.identity);
        // const privateKey = this.crypto.importPrivateKey(privateKeyData);

        // const senderCards = await this.cardManager.searchCards(senderIdentity);
        // if (senderCards.length > 0) {
        //     const senderPublicKeys = senderCards.map(card => card.publicKey);
        //     const decryptedData = this.crypto.decryptThenVerify(
        //         message,
        //         privateKey,
        //         senderPublicKeys
        //     );

        //     return decryptedData.toString('utf8');
        // }
        return Promise.resolve('DECRYPTED');
    }
}

// const program = async function() {
//     const model = new Model();
//     model.configureCardManager('test@gmail.com');
    
//     const encrypted = await model.encrypt('privet, loh', 'test1@gmail.com');
//     console.log('encrypted', encrypted);
//     model.configureCardManager('test1@gmail.com');
//     const decrypted = await model.decrypt(encrypted, 'test@gmail.com')
//     console.log('descripted', decrypted);
// }