const aliceDevice = new Device('alice');
const bobDevice = new Device('bob');

async function createAliceAndBobCards() {
    const [ aliceCardAndKeyPair, bobCardAndKeyPair ] = await Promise.all([
        aliceDevice.createCard(),
        bobDevice.createCard()
    ]);

    const alicePrivateKey = virgilCrypto
        .exportPrivateKey(aliceCardAndKeyPair.keyPair.privateKey)
        .toString("base64");

    const bobPrivateKey = virgilCrypto
        .exportPrivateKey(bobCardAndKeyPair.keyPair.privateKey)
        .toString("base64");

    showOutput(
        "#step-1-output",
        `Alice card.id: ${aliceCardAndKeyPair.card.id}\n` +
        `Alice privateKey: ${alicePrivateKey}\n\n` +
        `Bob card.id: ${bobCardAndKeyPair.card.id}\n` +
        `Bob privateKey: ${bobPrivateKey}\n`
    );

    console.log(aliceCardAndKeyPair, bobCardAndKeyPair);
}

async function loadKey() {
    const privateKey = await aliceDevice.loadKey();

    showOutput(
        "#step-2-output",
        `Alice privateKey: ${privateKey.toString("base64")}`
    );
}

async function encrypt() {
    const encrypted = await aliceDevice.encrypt("hello", "bob");

    showOutput(
        "#step-3-1-output",
        `encrypted message: ${encrypted}`
    );
}

async function decrypt() {
    const encrypted = await aliceDevice.encrypt("hello", "bob");
    const decrypted = await bobDevice.decrypt(encrypted);

    showOutput(
        "#step-3-3-output",
        `decrypted message: ${decrypted}`
    );
}

async function signThenEncrypt() {
    const message = await aliceDevice.signThenEncrypt('hello bob, that\'s truly Alice', 'bob');

    showOutput(
        "#step-4-1-output",
        `encrypted message: ${message}`
    );
}

async function decryptThenVerify() {
    const encrypted = await aliceDevice.signThenEncrypt('hello bob, that\'s truly Alice', 'bob');
    const decrypted = await bobDevice.decryptThenVerify(encrypted, 'alice');

    showOutput(
        "#step-4-3-output",
        `decrypted message: ${decrypted.toString('utf-8')}`
    );
}
