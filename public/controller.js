class Controller {
    constructor(aliceSdk, bobSdk) {
        this.aliceSdk = aliceSdk;
        this.bobSdk = bobSdk;

        this.intro = document.getElementById("intro");
        document.getElementById("get-started").onclick = () => this.stepReveal(
            "#step-1",
            "#get-started"
        );

        this.cardInfo = document.querySelector("#step-1-1 pre");
        this.loginForm = document.querySelector(".login-form");
        this.identityInput = document.getElementById("identity-input");
        this.createCardFunc = document.getElementById("create-card");

        this.createCardFunc.innerHTML = this.displayFunction(
            this.aliceSdk.createCard.toString()
        );

        this.createCardFunc.innerHTML +=
            "\n" + this.displayCommands(this.createAliceAndBobCards.toString());

        document.getElementById("create-card-button").onclick = () =>
            this.runCode(
                this.createAliceAndBobCards.bind(this),
                "#step-1-1",
                "#create-card-button"
            );

        window.onload = () => this.intro.classList.add("revealed");
    }

    async createAliceAndBobCards() {
        // this refers to our Controller instance
        const [aliceCardAndKeyPair, bobCardAndKeyPair] = await Promise.all([
            this.aliceSdk.createCard(),
            this.bobSdk.createCard()
        ]);

        const alicePrivateKey = virgilCrypto
            .exportPrivateKey(aliceCardAndKeyPair.keyPair.privateKey)
            .toString("base64");

        const bobPrivateKey = virgilCrypto
            .exportPrivateKey(bobCardAndKeyPair.keyPair.privateKey)
            .toString("base64");

        this.showOutput(
            "#step-1-1-output",
            `Alice card.id: ${aliceCardAndKeyPair.card.id}\n` +
            `Alice privateKey: ${alicePrivateKey}\n\n` +
            `Bob card.id: ${bobCardAndKeyPair.card.id}\n` +
            `Bob privateKey: ${bobPrivateKey}\n`
        );

        console.log(aliceCardAndKeyPair, bobCardAndKeyPair);
    }

    stepReveal(stepSelector, buttonSelector) {
        const step = document.querySelector(stepSelector);
        const button = document.querySelector(buttonSelector);
        console.log(button, buttonSelector)
        step.classList.add("revealed");
        button.classList.add("hidden");
        step.scrollIntoView({
            block: "start",
            behavior: "smooth",
        });
    }

    runCode(func, stepSelector, buttonSelector) {
        func();
        this.stepReveal(stepSelector, buttonSelector)
    }

    displayFunction(funcBody) {
        return this.generateCodeFromFunction(funcBody)
            .map((line, i) => (i > 0 ? line.replace(/^\s{4}/, "") : line))
            .map(this.transformToCode)
            .join("\n")
    }

    displayCommands(funcBody) {
        return this.generateCodeFromFunction(funcBody)
            .map((line, i) => (i > 0 ? line.replace(/^\s{8}/, "") : line))
            .filter((line, i, arr) => i !== 0 && i !== arr.length - 1)
            .map(this.transformToCode)
            .join('\n')
    }

    showOutput(outputSelector, text) {
        const html = text
            .split("\n")
            .map(this.transformToOutput)
            .join("\n");

        document.querySelector(outputSelector).innerHTML = html;
    }

    generateCodeFromFunction(funcBody) {
        return hljs
            .highlight("js", funcBody)
            .value
            .split("\n");
    }

    transformToCode(text) {
        return `<code class="code-line">${text}</code>`
    }

    transformToOutput(text) {
        return `<code>${text}</code>`;
    }
}

const controller = new Controller(new SDK('alice'), new SDK('bob'));
