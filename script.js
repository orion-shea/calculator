const expression = {
    current: '0',
    operatorCount: 0,
    balance: 0,
    initialZero: true,
    decimalUsed: false,
};

document.querySelector('.calculator-buttons').addEventListener('click', main);
document.addEventListener('keydown', main);
document.getElementById('display').innerHTML =  '0'; 

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
    let lastInput = expression.current[expression.current.length - 1]
    if(lastInput === ' ') return false;
    else if(lastInput === '.' ) return false;
    else if(lastInput === '(') return false;
    else if(lastInput === '-') return false;
    return true;
}

function permitEvaluation(expression) {
    if(expression.operatorCount === 0) return false;
    if(expression.balance != 0) return false;
    return true;
}

function handleNumber(expression, buttonValue) {
    // if display is just 0, always replace with the new number.
    if(expression.current === '0') {
        expression.current = buttonValue;
    }
    else if(expression.current[expression.current.length - 1] === '0' && 
        (expression.current[expression.current.length - 2] === ' ' || expression.current[expression.current.length - 2] === '-')) {
        expression.current = expression.current.slice(0, -1) + buttonValue;
    }
    else {
        expression.current += buttonValue;
    }
}

function handleOperator(expression, buttonValue) {
    // trying to be fancy like google and replace operators w/ each other
    if(expression.current[expression.current.length - 1] === ' ') {
        if(buttonValue === '-' && 
            (expression.current[expression.current.length - 2] == '×' || 
            expression.current[expression.current.length - 2] == '÷')
        ) {
            expression.current += buttonValue;
            expression.operatorCount++;
        }
        else {
            expression.current =  expression.current.slice(0, -2) + buttonValue + ' ';
            expression.operatorCount++;
        }
    }
    // only execute if there isn't garbage right before this input.
    else if(permitInsertion(expression)) {
        //adding space buffer for visual improvement
        expression.current += ' ' + buttonValue + ' ';
        expression.operatorCount++;
        expression.decimalUsed = false; // reset decimal point flag after an operator.
    }
}

function handleParenthesis(expression, buttonValue) {
    let lastInput = expression.current[expression.current.length - 1];
    if (buttonValue === '(' && lastInput != '.') {
        if (expression.initialZero === true) {
            expression.current = buttonValue; //if display is the initial 0, just replace it.
            expression.initialZero = false;
        }
        else expression.current += buttonValue; //otherwise, add the parenthesis onto the displayed expression
        expression.balance++; //increment our balance counter by 1 to track an open paren.
        expression.decimalUsed = false; // reset decimal point flag after an open paren.
    }
    else {
        if (permitInsertion(expression)) {//only execute if there isn't garb right b4
            //if there is still an opening paren that hasn't been closed, go:
            if (expression.balance > 0) {
                expression.current += buttonValue;
                expression.balance--; //decrement counter to indicate closed/balanced parentheses.
                expression.decimalUsed = false; // reset decimal point flag after a close paren.
            }
        }
    }
}

function handleBackspace(expression, buttonValue) {
    let lastInput = expression.current[expression.current.length - 1];

    //backspace with just 1 digit left should reset to 0, not empty string.
    if (expression.current.length === 1) {
        expression.initialZero = true;
        expression.decimalUsed = false;
        expression.balance = 0;
        expression.current = '0';
        return;
    }
    else if (lastInput === ' ') {
        //document.getElementById('display').innerHTML = accumulator.slice(0, -3);
        expression.current = expression.current.slice(0, -3);
        expression.operatorCount--;
        return;
    }
    else if (lastInput === '.') { expression.decimalUsed = false; }
    else if (lastInput === '(') { expression.balance--; }
    else if (lastInput === ')') { expression.balance++; }
    expression.current = expression.current.slice(0, -1);
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
    if(expression.current === 'inf' ||expression.current === 'nan') { buttonValue = 'C'; }
    switch(buttonValue) { // logic for each button.
        case '0':
        case '1': case '2': case '3':
        case '4': case '5': case '6':
        case '7': case '8': case '9':
            expression.initialZero = false;
            handleNumber(expression, buttonValue);
            break;
        case '.':
            if(expression.decimalUsed === false && permitInsertion(expression)) {
                expression.decimalUsed = true;
                expression.current += buttonValue;
            }
            break;
        case '+': case '×': case '÷':
            handleOperator(expression, buttonValue);
            break;
        case '-':
            if(expression.current === '0') {
                expression.current = buttonValue;
                expression.initialZero = false;
            }
            else if(expression.current[expression.current.length - 1] === '(') {
                expression.current += buttonValue;
            }
            else {
                handleOperator(expression, buttonValue);
            }
            break;
        case '(': case ')':
            handleParenthesis(expression, buttonValue);
            break;
        case 'Backspace':
            handleBackspace(expression, buttonValue);
            break;
        case 'C': case 'c':
            expression.current = '0';
            expression.initialZero = true;
            expression.decimalUsed = false;
            expression.balance = 0;
            expression.operatorCount = 0;
            break;
        case '=': case 'Enter':
            //run only if valid expression
            // Count implicit multiplications (these all represent hidden operators)
            if(expression.current.includes(')(')) expression.operatorCount++;   // (2)(3)
            if(/\d\(/.test(expression.current)) expression.operatorCount++;    // 2(3)
            if(/\)\d/.test(expression.current)) expression.operatorCount++;    // (2)3
            if (permitEvaluation(expression)) {
                let payload = expression.current
                .replaceAll('×', '*')
                .replaceAll('÷', '/')
                .replaceAll('-(', '(-1)*(')
                .replaceAll('(-', '(-1*')
                .replaceAll(')(', ')*(')
                .replace(/(\d)\(/g, '$1*(') //RegEx for n(... ---> n*(... (for all numbers 0-9).
                .replace(/\)(\d)/g, ')*$1') //RegEx for ...)n ---> ...)*n (for all numbers 0-9).
                // normalize everything for c++ input
                
                payload = payload.replaceAll(' ', '');
                expression.current = await api(payload);
                expression.operatorCount = 0;  // Reset for next calculation
                expression.balance = 0;         // Reset for next calculation
                if(expression.current.includes('.')) expression.decimalUsed = true; // reset decimal point flag after evaluation.
                else expression.decimalUsed = false;
                if(expression.current === '0') expression.initialZero = true;
            }
            break;
        default:
    }
    document.getElementById('display').innerHTML =  expression.current;
}