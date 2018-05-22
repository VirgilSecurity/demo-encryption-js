const virgilCrypto = new VirgilCrypto.VirgilCrypto();
const keyStorage = new Virgil.KeyStorage();
const cardCrypto = new VirgilCrypto.VirgilCardCrypto(virgilCrypto);
const cardVerifier = new Virgil.VirgilCardVerifier(cardCrypto);

class SDK {
    constructor(identity) {
        this.identity = identity;

        const getFuncJwt = ({ operation }) => fetch('http://localhost:3000/generate_jwt', {
            headers: new Headers({ 'Content-Type' : 'application/json'}),
            method: 'POST',
            body: JSON.stringify({ identity })
        }).then((res) => res.text());

        const jwtProvider = new Virgil.CallbackJwtProvider(getFuncJwt);

        this.cardManager = new Virgil.CardManager({
            cardCrypto: cardCrypto,
            cardVerifier: cardVerifier,
            accessTokenProvider: jwtProvider,
            retryOnUnauthorized: true
        });
    }

    async createCard () {
        const keyPair = virgilCrypto.generateKeys();

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

    async searchCards (identity) {
        return await this.cardManager.searchCards(identity);
    }

    async encrypt (message, recipientIdentity) {
        const recipientCards = await this.searchCards(recipientIdentity);
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
        const privateKeyData = await this.keyStorage.load(this.identity);
        const privateKey = virgilCrypto.importPrivateKey(privateKeyData);

        const decryptedData = virgilCrypto.decrypt(
            message,
            privateKey
        );

        return decryptedData.toString('utf8');
    }

    stringKeyPairRepresentation({ privateKey, publicKey }) {
        return {
            privateKey: this.crypto.exportPrivateKey(privateKey).toString('base64'),
            publicKey: this.crypto.exportPublicKey(publicKey).toString('base64')
        }
    }
}
