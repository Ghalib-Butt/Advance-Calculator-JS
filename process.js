let inputScreen = document.getElementById('input-screen');
let outputScreen = document.getElementById('output-screen');
let displayExpression = '';
let executeableExpression = '';
let expressionStash = [];
let result = 0;
const pi = 3.1415;
const e = 2.7182;
let buttons = document.querySelectorAll('button');

function setInputScreen(currentExpression = '', newInput = '') {
    displayExpression = currentExpression + newInput;
    if (displayExpression == '') {
        expressionStash = [];
    } else {
        if (newInput != '') {
            if (expressionStash.length && isNumeric(displayExpression[displayExpression.length-1]) && isNumeric(expressionStash[expressionStash.length-1][expressionStash[expressionStash.length-1].length-1])) {
                expressionStash[expressionStash.length-1] += newInput;
            } else {
                expressionStash.push(newInput);
            }
        }
    }
    inputScreen.value = displayExpression;
}

function setOutputScreen(replacement = null) {
    if (replacement == null) {
        executeableExpression = '';
        result = 0;
    } else {
        result = replacement;
    }
    outputScreen.innerHTML = result;
}

function clear() {
    setInputScreen();
    setOutputScreen();
}

function calculate() {
    for (let i = 0; i < expressionStash.length; i++) {
        if (expressionStash[i] == '^') {
            previousIndexValue = expressionStash[i-1];
            nextIndexValue = expressionStash[i+1];
            executeableExpression = executeableExpression.slice(0, -previousIndexValue.length);
            executeableExpression += `Math.pow(${previousIndexValue},${nextIndexValue})`;
            i++;
        } else if (['sqrt','sin','cos','tan'].includes(expressionStash[i])) {
            executeableExpression += `Math.${expressionStash[i]}(${expressionStash[i+1]})`;
            i++;
        } else {
            executeableExpression += expressionStash[i];
        }
    }
    output = createOutput();
    return output;
}

function createOutput() {
    try {
        output = eval(executeableExpression);
        if (typeof(output) == 'number' && output != Infinity) {
            output = output.toFixed(4);
        }
        if (output !== output) {
            output = "Result: Not a Number.";
        } else if (output === Infinity) {
            output = 'Can not divide by 0.';
        }
    } catch {
        output = 'Wrong Expression provided.';
    } finally {
        let statement = `${displayExpression}: ${output}`;
        localStorage.setItem("Expression =>", statement);
        executeableExpression = '';
    }
    return output;
}

function isNumeric(value) {
    if ((value >= '0' && value <= '9') || value == '.') {
        return true;
    } else {
        return false;
    }
}

function keyPressed($event) {
    $event.preventDefault();
    if ($event.code == 'Enter') {
        setOutputScreen(calculate());
    } else if ($event.code == 'Backspace') {
        removeLastInput();
    } else if (($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode >= 65 && $event.keyCode <= 90) || $event.keyCode == 187 || $event.keyCode == 190) {
        setInputScreen(displayExpression, $event.key);
    }
}

function removeLastInput() {
    displayExpression = displayExpression.slice(0, displayExpression.length-1);
    if (expressionStash[expressionStash.length-1].length == 1) {
        expressionStash.pop();
    } else {
        expressionStash[expressionStash.length-1] = expressionStash[expressionStash.length-1].slice(0,expressionStash[expressionStash.length-1].length-1);
    }
    setInputScreen(displayExpression);
}

for (let button of buttons) {
    button.addEventListener('click', (e) => {
        clickedButton = e.target.innerText;
        if (!['setup', 'event'].includes(e.target.className)) {
            setInputScreen(displayExpression, clickedButton);
        } else {
            if (clickedButton == 'ANS') {
                setOutputScreen(calculate());
            } else if (clickedButton == 'CLR') {
                clear();
            } else if (clickedButton == 'DEL') {
                removeLastInput();
            } else if (clickedButton == 'Reset All') {
                location.reload();
            } else if (clickedButton == 'View History') {

            }
        }
    })
}
