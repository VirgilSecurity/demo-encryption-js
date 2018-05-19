class Model {
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

        this.keyStorage.save(this.identity, this.crypto.exportPrivateKey(keyPair.privateKey));

        const card = await this.cardManager.publishCard({
            privateKey: keyPair.privateKey,
            publicKey: keyPair.publicKey
        });

        return card;
    };

    async searchCards (identity) {
        return await this.cardManager.searchCards(identity);
    }

    async encrypt (message, recipientIdentity) {
        const recipientCards = await this.searchCards(recipientIdentity);
        const senderPrivateKeyBytes = await this.keyStorage.load(this.identity);
        const senderPrivateKey = this.crypto.importPrivateKey(senderPrivateKeyBytes);

        if (recipientCards.length > 0) {
            const recipientPublicKeys = recipientCards.map(card => card.publicKey);
            const encryptedData = this.crypto.signThenEncrypt(
                message,
                senderPrivateKey,
                recipientPublicKeys
            );

            return encryptedData.toString('base64');
        }
    }

    async decrypt (message) {
        const privateKeyData = await this.keyStorage.load(this.identity);
        const privateKey = this.crypto.importPrivateKey(privateKeyData);

        const decryptedData = this.crypto.decrypt(
            message,
            privateKey
        );

        return decryptedData.toString('utf8');
    }
}