/*
    Notes:
    Instead of 1 central function, I should split up into different tasks.
    Also wanting to fix variable names. How do I do that efficiently?

    For next time..
    I want to add negative functionality
    I want to finally start figuring out the API and backend.
*/

//clicks only listen when they're inside the calculator-buttons div.
document.querySelector('.calculator-buttons').addEventListener('click', f);
document.addEventListener('keydown', f);

//as opposed to just listening for clicks on the whole entire page.
//document.addEventListener('click', f);

/*
    document.querySelector('.calculator-buttons').addEventListener('keydown', f);

    interesting - will only allow keydowns after a click on calculator-buttons div.
    this seems to be what google does, since they have calculator and other
    things on the same page. cool!
*/

let expression = '0'; // Make it a string to hold both nums and symbols.
// Immediately show 0 on the display (and at all times when the display is empty).
document.getElementById('display').innerHTML =  expression; 

let initialZero = true; // for parenthesis stuff - lets me type 0 at the start and
// then follow it with a paren to keep 0(a + b), etc. that's if I touch the
// 0. If untouched, which will be default, the paren will simply replace 0.
let decimalUsed = false; // flag for decimal point.
let unclosedParen = [false]; // flag for parenthesis.



async function f(event) {    
    // tracks current value of button pressed (or key pressed).
    let buttonValue = ''; 
    //an array storing booleans. if all true, input can be garbage free.
    //this can help me avoid invalid expressions, like two operators in a row, etc.
    let garbageFree = [expression[expression.length - 1] != ' ',
                        expression[expression.length - 1] != '.',
                        expression[expression.length - 1] != '(',
                        expression[expression.length - 1] != '^'];

    

    // normalize both inputs (click and keydown)
    if(event.type === 'click') { 
        buttonValue = event.target.value;
    }
    if(event.type === 'keydown') {
        if (event.key === 'Enter') {
            event.preventDefault(); //weird bug with enter, i stop it w this
        }
        buttonValue = event.key;
    }

    // normalize these inputs
    if(buttonValue === '*') {
        buttonValue = '×';
    }
    if(buttonValue === '/') {
        buttonValue = '÷';
    }



    // switch statement taking care of logic for each button/key pressed.
    switch(buttonValue) {
        case '0':
            // if i manually type 0 at the start, it means i touched
            if(initialZero) { 
                initialZero = false;
            }
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            // if display is just 0, always replace with the new number.
            if(expression === '0') {
                expression = buttonValue;
            }
            //otherwise, add that number onto the expression.
            else {
                expression += buttonValue;
            }
            break;
        case '+':
        case '-':
            //clever way to handle negatives
        case '×':
        case '÷':
            // trying to be fancy like google and replace operators w/ each other
            if(!garbageFree[0]) {
                // accumulator = itself - 2 characters, then add val and a space.
                expression =  expression.slice(0, -2) + buttonValue + ' ';
            }
            // only execute if there isn't garbage right before this input.
            else if(garbageFree.every(Boolean)) {
                //adding space buffer for visual improvement
                expression += ' ' + buttonValue + ' ';
                decimalUsed = false; // reset decimal point flag after an operator.
            }
            break;
        case '.':
            // only let me decimal if there isn't garbo right b4
            if(garbageFree.every(Boolean)) {
                if(decimalUsed === false) { 
                    expression += buttonValue;
                }    
            decimalUsed = true; // flag to indicate that a decimal point has been added.
            }
            
            break;
        case '(':
            if(expression === '0' && initialZero === true) {
                expression = buttonValue; //if is the initial 0, just replace it.
            }
            else {
                expression += buttonValue; //otherwise, add paren onto the displayed expr.
            }
            // paren flag magic
            if(!unclosedParen[0]) { 
                //if the first val of paren is false, this means that no parens
                //have been opened yet. so change it to true to indicate first open
                unclosedParen = [true];
            }
            else {
                //otherwise, this means that a paren is already open and hasn't
                //been closed yet. so, just add another open one to the list.
                unclosedParen.push(true);
            } 
            /* 
            Google also adds the ending parenthesis (greyed out) automatically.
            Can do something like add both paren, but ending paren is at 
            i + 1, and we continue adding characters at position i until
            we input ending paren, closing the parens.
            */
            decimalUsed = false; // reset decimal point flag after an open paren.
            break;
        case ')':
            // same as operators, only execute if there isn't garb right b4
            if(garbageFree.every(Boolean)) {
                //if there is still an opening paren that hasn't been closed, go:
                if(unclosedParen[0] === true) {
                    unclosedParen.pop(); //pop the last true to close 1 opening paren.  
                    expression += buttonValue;
                    decimalUsed = false; // reset decimal point flag after a close paren.
                }
                // if we just popped the last true and the list is empty, reset
                // this means all opening parens have been closed.
                if(unclosedParen.length === 0) {
                    unclosedParen = [false];
                }
            }
            break;


            
        case '^':
            if(garbageFree.every(Boolean)) {
                expression += buttonValue;
            }
            break;


        case 'Backspace':
            //backspace with just 1 digit left should reset to 0, not empty string.
            if(expression.length === 1) {
                expression = '0';
                decimalUsed = false; // reset decimal point flag after clearing.
                unclosedParen.length = 0;
                unclosedParen = [false]; // reset parenthesis flag after clearing.
                initialZero = true; // reset this flag too.
            }
            else if(expression[expression.length - 1] === ' ') {
                //document.getElementById('display').innerHTML = accumulator.slice(0, -3);
                expression = expression.slice(0, -3);
            }
            //Dot Logic
            else if(expression[expression.length - 1] === '.') {
                decimalUsed = false;
                expression = expression.slice(0, -1);
            }

            //Parenthesis logic
            else if(expression[expression.length - 1] === '(') {
                if(unclosedParen.length === 1) {
                    unclosedParen = [false];
                }
                else { 
                    unclosedParen.pop();
                }
                expression = expression.slice(0, -1);
            }
            else if(expression[expression.length - 1] === ')') {
                if(!unclosedParen[0]) {
                    unclosedParen = [true];
                }
                else {
                    unclosedParen.push(true);
                }
                expression = expression.slice(0, -1);
            }


            //otherwise, cut off the last character of the accumulator string.
            else {
                expression = expression.slice(0, -1);
            }
            break;
        case 'c':
        case 'C':
            expression = '0';
            decimalUsed = false; // reset decimal point flag after clearing.
            unclosedParen.length = 0;
            unclosedParen = [false]; // reset parenthesis flag after clearing.
            initialZero = true; //reset this too
            break;
        case '=':
        case 'Enter':
            //run only if valid end to expression
            if(garbageFree.every(Boolean)) {
                //normalize everything into ascii
                if (expression.includes('×') || expression.includes('÷')) {
                    //ONLY REPLACES THE FIRST MULT OR DIV. FIX LATER
                    expression = expression.replace('×', '*').replace('÷', '/');
                }
                /* Great way to normalize the expression here.
                let payload = expression
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/\s+/g, '');
                */
                expression = await evaluate(expression);
                decimalUsed = false; // reset decimal point flag after evaluation.
                unclosedParen.length = 0;
                unclosedParen = [false]; // reset parenthesis flag after evaluation.
                // idk if this is needed -> initialZero = true; //reset it too
            }
            break;
        default:
    }
    document.getElementById('display').innerHTML =  expression;
}


async function evaluate(expression) {
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