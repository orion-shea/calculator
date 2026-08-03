//
// Javascript
//

document.querySelector('.calculator-buttons').addEventListener('click', main);
document.addEventListener('keydown', main);
document.getElementById('display').innerHTML =  '0'; 

/* REFACTOR LATER WITH THIS
const expression = {
    current: '0',
    balance = 0,
    initialZero: true,
    decimalUsed: false
};
*/

// GLOBAL VARIABLES - REPLACE WITH DICTIONARY ABOVE
let expression = '0';
let initialZero = true; // keep track of used/unused 0 at start.
let decimalUsed = false; // flag for decimal point.
let balance = 0; // Counter to track balanced parentheses.

function normalize(event, buttonValue) {
    if (event.type === 'click') {
        buttonValue = event.target.value;
    }
    if (event.type === 'keydown') {
        if (event.key === 'Enter') {
            event.preventDefault(); //weird bug with enter, i stop it w this
        }
        buttonValue = event.key;
    }
    if (buttonValue === '*') {
        buttonValue = '×';
    }
    if (buttonValue === '/') {
        buttonValue = '÷';
    }
    return buttonValue;
}

function permitInsertion(expression) {
    let lastInput = expression[expression.length - 1]
    if(lastInput === ' ') return false;
    else if(lastInput === '.' ) return false;
    else if(lastInput === '(') return false;
    else if(lastInput === '^') return false;
    else if(lastInput === '-') return false;
    return true;
}

function permitEvaluation(expression, balance) {
    //If expression has an operator, 
    if
    (
    permitInsertion(expression) && 
    (expression.includes('+') || 
    expression.includes('-') || 
    expression.includes('×') || 
    expression.includes('÷') ||
    expression.includes('^') ||
    expression.includes('(')
    ) &&
    balance === 0
    ) {
        return true;
    }
    return false;
}

function handleNumber(expression, buttonValue) {
    // if display is just 0, always replace with the new number.
    if(expression === '0') {
        return buttonValue;
    }
    else if(expression[expression.length - 1] === '0' && 
        (expression[expression.length - 2] === ' ' || expression[expression.length - 2] === '-')) {
        return expression.slice(0, -1) + buttonValue;
    }
    return expression + buttonValue;
}

function handleOperator(expression, buttonValue) {
    // trying to be fancy like google and replace operators w/ each other
    if(expression[expression.length - 1] === ' ') {
        if(buttonValue === '-' && 
            (expression[expression.length - 2] == '×' || 
            expression[expression.length - 2] == '÷' ||
            expression[expression.length - 2] == '^')
        ) {
            expression += buttonValue;
        }
        else {
            expression =  expression.slice(0, -2) + buttonValue + ' ';
        }
    }
    // only execute if there isn't garbage right before this input.
    else if(permitInsertion(expression)) {
        //adding space buffer for visual improvement
        expression += ' ' + buttonValue + ' ';
        decimalUsed = false; // reset decimal point flag after an operator.
    }
    return expression;
}

function handleParenthesis(expression, buttonValue) {
    let lastInput = expression[expression.length - 1];
    if (buttonValue === '(' && lastInput != '.') {
        if (initialZero === true) {
            expression = buttonValue; //if display is the initial 0, just replace it.
            initialZero = false;
        }
        else expression += buttonValue; //otherwise, add the parenthesis onto the displayed expression
        balance++; //increment our balance counter by 1 to track an open paren.
        decimalUsed = false; // reset decimal point flag after an open paren.
    }
    else {
        if (permitInsertion(expression)) {//only execute if there isn't garb right b4
            //if there is still an opening paren that hasn't been closed, go:
            if (balance > 0) {
                expression += buttonValue;
                balance--; //decrement counter to indicate closed/balanced parentheses.
                decimalUsed = false; // reset decimal point flag after a close paren.
            }
        }
    }
    return expression;
}

function handleBackspace(expression, buttonValue) {
    let lastInput = expression[expression.length - 1];

    //backspace with just 1 digit left should reset to 0, not empty string.
    if (expression.length === 1) {
        initialZero = true;
        decimalUsed = false;
        balance = 0;
        return '0';
    }
    else if (lastInput === ' ') {
        //document.getElementById('display').innerHTML = accumulator.slice(0, -3);
        return expression.slice(0, -3);
    }
    else if (lastInput === '.') { decimalUsed = false; }
    else if (lastInput === '(') { balance--; }
    else if (lastInput === ')') { balance++; }
    return expression.slice(0, -1);
}

function getRandomRgb() {
    /*
        Cool bit shifts.
        let num = Math.round(0xffffff * Math.random());
        let r = num >> 16;
        let g = num >> 8 & 255;
        let b = num & 255;
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    */
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`; // Using a template literal 
}

async function api(expression) {
    try {
        const response = await fetch(`/calculate?expression=${encodeURIComponent(expression)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.text(); // or .json() if server returns JSON
        console.log(result);
        return result;
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error; // optional: let the caller handle it
    }
}

async function main(event) {
    let buttonValue = '';
    buttonValue = normalize(event, buttonValue); // tracks current value of normalized button
    if(expression === 'inf' ||expression === 'nan') { buttonValue = 'C'; }
    switch(buttonValue) { // logic for each button.
        case '0':
        case '1': case '2': case '3':
        case '4': case '5': case '6':
        case '7': case '8': case '9':
            initialZero = false;
            expression = handleNumber(expression, buttonValue);
            break;
        case '.':
            if(decimalUsed === false && permitInsertion(expression)) {
                decimalUsed = true;
                expression += buttonValue;
            }
            break;
        case '+': case '×': case '÷': case '^':
            expression = handleOperator(expression, buttonValue);
            break;
        case '-':
            if(expression === '0') {
                expression = buttonValue;
                initialZero = false;
            }
            else if(expression[expression.length - 1] === '(') {
                expression += buttonValue;
            }
            else {
                expression = handleOperator(expression, buttonValue);
            }
            break;
        case '(': case ')':
            expression = handleParenthesis(expression, buttonValue);
            break;
        case 'Backspace':
            expression = handleBackspace(expression, buttonValue);
            break;
        case 'C': case 'c':
            expression = '0';
            initialZero = true;
            decimalUsed = false;
            balance = 0;
            break;
        case '?':
            document.body.style.backgroundColor =  getRandomRgb();
            document.getElementById('display').style.backgroundColor = getRandomRgb();
            break;
        case '=': case 'Enter':
            //run only if valid expression
            if (permitEvaluation(expression, balance)) {
                let payload = expression
                .replaceAll('×', '*')
                .replaceAll('÷', '/')
                .replaceAll('-(', '(-1)*(')
                .replaceAll('(-', '(-1*')
                .replaceAll(')(', ')*(')
                .replace(/(\d)\(/g, '$1*(') //RegEx for n(... ---> n*(... (for all numbers 0-9).
                .replace(/\)(\d)/g, ')*$1') //RegEx for ...)n ---> ...)*n (for all numbers 0-9).
                // normalize everything for c++ input
                payload = payload.replaceAll(' ', '')
                expression = await api(payload);
                if(expression.includes('.')) decimalUsed = true; // reset decimal point flag after evaluation.
                else decimalUsed = false;
                if(expression === '0') initialZero = true;
            }
            break;
        default:
    }
    document.getElementById('display').innerHTML =  expression;
}