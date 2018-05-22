window.onload = function(event) {
    document.getElementById("intro").classList.add("revealed");
    setTimeout(() => window.scrollTo(0, 0), 100);

    document.getElementById("get-started").onclick = () =>
        this.stepReveal("#step-1", "#get-started");

    displayCode(
        "#create-card",
        displayFunction(Device.prototype.createCard),
        displaySnippet(createAliceAndBobCards)
    );

    document.getElementById("create-card-button").onclick = () =>
        this.runCode(
            createAliceAndBobCards,
            "#step-1-1",
            "#create-card-button"
        );
};

function displayCode(selector) {
    const el = document.querySelector(selector);
    const html = Array.prototype.slice.call(arguments, 1).join("\n");
    el.innerHTML = html;
}

function stepReveal(stepSelector, buttonSelector) {
    const step = document.querySelector(stepSelector);
    const button = document.querySelector(buttonSelector);

    step.classList.add("revealed");
    button.classList.add("hidden");

    step.scrollIntoView({
        block: "start",
        behavior: "smooth"
    });
}

function runCode(func, stepSelector, buttonSelector) {
    func();
    stepReveal(stepSelector, buttonSelector);
}

function displayFunction(func) {
    return generateCodeFromFunction(func.toString())
        .map((line, i) => (i > 0 ? line.replace(/^\s{4}/, "") : line))
        .map(transformToCode)
        .join("\n");
}

function displaySnippet(func) {
    return generateCodeFromFunction(func.toString())
        .map((line, i) => (i > 0 ? line.replace(/^\s{4}/, "") : line))
        .filter((line, i, arr) => i !== 0 && i !== arr.length - 1)
        .map(transformToCode)
        .join("\n");
}

function showOutput(outputSelector, text) {
    const html = text
        .split("\n")
        .map(text => `<code>${text}</code>`)
        .join("\n");

    document.querySelector(outputSelector).innerHTML = html;
}

function generateCodeFromFunction(funcBody) {
    return hljs.highlight("js", funcBody).value.split("\n");
}

function transformToCode(text) {
    return `<code class="code-line">${text}</code>`;
}
