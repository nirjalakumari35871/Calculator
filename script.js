const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

function calculate() {
    if (!expression || !/^[0-9+\-*/. ]+$/.test(expression)) {
        display.value = "Invalid input";
        expression = "";
        finished = true;
        return;
    }

    try {
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = String(Number(result.toPrecision(12)));
        display.value = expression;
    } catch {
        expression = "";
        display.value = "Error";
    }

    finished = true;
}

function handleInput(value, action) {
    if (action === "clear") {
        expression = "";
        display.value = "";
        finished = false;
        return;
    }

    if (action === "delete") {
        if (finished) {
            expression = "";
            display.value = "";
            finished = false;
        } else {
            expression = expression.slice(0, -1);
            display.value = expression;
        }
        return;
    }

    if (action === "calculate") {
        calculate();
        return;
    }

    if (!value) return;

    if (finished) {
        if (/[0-9.]/.test(value)) {
            expression = "";
        } else {
            expression = expression || display.value;
        }
        finished = false;
    }

    if (!/^[0-9.+\-*/]$/.test(value)) return;

    if (/[+\-*/]/.test(value) &&
        /[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }

    expression += value;
    display.value = expression;
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    handleInput(button.dataset.value, button.dataset.action);
});

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    if (/^[0-9.+\-*/]$/.test(event.key)) {
        handleInput(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Backspace") {
        handleInput("", "delete");
    } else if (event.key === "Escape") {
        handleInput("", "clear");
    }
});