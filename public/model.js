class Device {
    configure(identity) {
        // this refers to Device instance
        this.identity = identity;

        window.virgilCrypto = new VirgilCrypto.VirgilCrypto();
        window.keyStorage = new Virgil.KeyStorage();
        window.cardCrypto = new VirgilCrypto.VirgilCardCrypto(virgilCrypto);
        window.cardVerifier = new Virgil.VirgilCardVerifier(cardCrypto);

        const getJwt = () => fetch('http://localhost:3000/generate_jwt', {
            headers: new Headers({ 'Content-Type' : 'application/json'}),
            method: 'POST',
            body: JSON.stringify({ identity })
        }).then((res) => res.text());

        const jwtProvider = new Virgil.CallbackJwtProvider(getJwt);

        this.cardManager = new Virgil.CardManager({
            cardCrypto: cardCrypto,
            cardVerifier: cardVerifier,
            accessTokenProvider: jwtProvider,
            retryOnUnauthorized: true
        });
    }

    async createCard () {
        const keyPair = virgilCrypto.generateKeys();

        // this made for demo purposes, in case you will want to complete demo again
        // you don't need to delete your private key, if you have one and you can use one card for a user
        if (keyStorage.exists(this.identity)) keyStorage.remove(this.identity);

        keyStorage.save(
            this.identity,
            virgilCrypto.exportPrivateKey(keyPair.privateKey)
        );

        const card = await this.cardManager.publishCard({
            privateKey: keyPair.privateKey,
            publicKey: keyPair.publicKey
        });

        return { card, keyPair };
    };

    async encrypt (message, senderIdentity) {
        const senderCards = await this.cardManager.searchCards(senderIdentity);

        if (senderCards.length > 0) {
            const bobPublicKeys = senderCards.map(card => card.publicKey);
            const encryptedData = virgilCrypto.encrypt(
                message,
                bobPublicKeys
            );

            return encryptedData.toString('base64');
        }

        throw new Error('Recipient cards not found');
    }

    async signThenEncrypt (message, recipientIdentity) {
        const recipientCards = await this.cardManager.searchCards(recipientIdentity);
        const senderPrivateKeyBytes = await keyStorage.load(this.identity);
        const senderPrivateKey = virgilCrypto.importPrivateKey(senderPrivateKeyBytes);

        if (recipientCards.length > 0) {
            const recipientPublicKeys = recipientCards.map(card => card.publicKey);
            const encryptedData = virgilCrypto.signThenEncrypt(
                message,
                senderPrivateKey,
                recipientPublicKeys
            );

            return encryptedData.toString('base64');
        }

        throw new Error('Recipient cards not found');
    }

    async decrypt (message) {
        const privateKeyData = await keyStorage.load(this.identity);
        const privateKey = virgilCrypto.importPrivateKey(privateKeyData);

        const decryptedData = virgilCrypto.decrypt(
            message,
            privateKey
        );

        return decryptedData.toString('utf8');
    }

    async decryptThenVerify (message, senderIdentity) {
        const senderCards = await this.cardManager.searchCards(senderIdentity);
        const privateKeyData = await keyStorage.load(this.identity);
        const privateKey = virgilCrypto.importPrivateKey(privateKeyData);

        if (senderCards.length > 0) {
            const senderPublicKeys = senderCards.map(card => card.publicKey);
            const decryptedData = virgilCrypto.decryptThenVerify(
                message,
                privateKey,
                senderPublicKeys
            );
            return decryptedData.toString('utf8');
        }

        throw new Error('Sender cards not found');
    }
}
