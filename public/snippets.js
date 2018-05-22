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
        "#step-1-1-output",
        `Alice card.id: ${aliceCardAndKeyPair.card.id}\n` +
        `Alice privateKey: ${alicePrivateKey}\n\n` +
        `Bob card.id: ${bobCardAndKeyPair.card.id}\n` +
        `Bob privateKey: ${bobPrivateKey}\n`
    );

    console.log(aliceCardAndKeyPair, bobCardAndKeyPair);
}
