window.onload = function(event) {
    document.getElementById("intro").classList.add("show");
    setTimeout(() => document.getElementById("intro").classList.add("revealed"), 1);

    document.querySelectorAll("button").forEach(buttonsScripts);
    document.querySelectorAll("pre").forEach(preScripts);
};

function buttonsScripts(buttonEl) {
    const funcs = [];

    if (buttonEl.hasAttribute('show')) {
        const selector = buttonEl.getAttribute('show');
        funcs.push(() => stepReveal(selector, buttonEl, buttonEl.hasAttribute('toBottom')));
    }
    if (buttonEl.hasAttribute('run')) {
        funcs.push(() => eval(buttonEl.getAttribute('run')));
    }
    buttonEl.onclick = () => funcs.forEach(func => func());
}

function preScripts(preEl) {
    if (preEl.hasAttribute('func')) {
        preEl.innerHTML = displayFunction(eval(preEl.getAttribute('func')));
    }
    if (preEl.hasAttribute('snippet')) {
        preEl.innerHTML = displaySnippet(eval(preEl.getAttribute('snippet')));
    }
}

function displayCode(selector) {
    const el = document.querySelector(selector);
    const html = Array.prototype.slice.call(arguments, 1).join("\n");
    el.innerHTML = html;
}

function stepReveal(stepSelector, button, isBottom) {
    const step = document.querySelector(stepSelector);

    step.classList.add("show");
    setTimeout(() => step.classList.add("revealed"), 1);
    button.classList.add("hidden");

    step.scrollIntoView({
        block: isBottom ? "end" : "start",
        behavior: "smooth"
    });
}

function displayFunction(func) {
    return generateCodeFromFunction(func.toString())
        .map((line, i) => (i > 0 ? line.replace(/^\s{4}/, "") : line))
        .map(transformToCode)
        .join("\n");
}

function displaySnippet(func) {
    return generateCodeFromFunction(func.toString())
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
