/*
    Notes:
    Instead of 1 central function, I should split up into different tasks.
    Also wanting to fix variable names. How do I do that efficiently?
        -accumulator -> expression
        -dot -> decimalUsed
        -parenOpen -> unclosedParen?
        -untouched -> initialZero?

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



let accumulator = '0'; // Make it a string to hold both nums and symbols.
document.getElementById('display').innerHTML =  accumulator; 
// Immediately show 0 on the display (and at all times when the display is empty).

let untouched = true; // for parenthesis stuff - lets me type 0 at the start and
// then follow it with a paren to keep 0(a + b), etc. that's if I touch the
// 0. If untouched, which will be default, the paren will simply replace 0.

let parenOpen = [false]; // flag for parenthesis.

let dot = false; // flag for decimal point.



function f(event) {    
    // tracks current value of button pressed (or key pressed).
    let buttonValue = ''; 
    //an array storing booleans. if all true, input can be garbage free.
    //this can help me avoid invalid expressions, like two operators in a row, etc.
    let garbageFree = [accumulator[accumulator.length - 1] != ' ',
                        accumulator[accumulator.length - 1] != '.',
                        accumulator[accumulator.length - 1] != '(',
                        accumulator[accumulator.length - 1] != '^'];

    

    // normalize both inputs (click and keydown)
    if(event.type === 'click') { 
        buttonValue = event.target.value;
    }
    if(event.type === 'keydown') {
        if (event.key === 'Enter') {
            event.preventDefault();
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

    console.log(buttonValue);


    // switch statement taking care of logic for each button/key pressed.
    switch(buttonValue) {
        case '0':
            // if i manually type 0 at the start, it means i touched
            if(untouched) { 
                untouched = false;
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
            if(accumulator === '0') {
                accumulator = buttonValue;
            }
            //otherwise, add that number onto the expression.
            else {
                accumulator += buttonValue;
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
                accumulator =  accumulator.slice(0, -2) + buttonValue + ' ';
            }
            // only execute if there isn't garbage right before this input.
            else if(garbageFree.every(Boolean)) {
                //adding space buffer for visual improvement
                accumulator += ' ' + buttonValue + ' ';
                dot = false; // reset decimal point flag after an operator.
            }
            console.log(accumulator);
            break;
        case '.':
            // only let me decimal if there isn't garbo right b4
            if(garbageFree.every(Boolean)) {
                if(dot === false) { 
                    accumulator += buttonValue;
                }    
            dot = true; // flag to indicate that a decimal point has been added.
            }
            
            break;
        case '(':
            if(accumulator === '0' && untouched === true) {
                accumulator = buttonValue; //if is the initial 0, just replace it.
            }
            else {
                accumulator += buttonValue; //otherwise, add paren onto the displayed expr.
            }
            // paren flag magic
            if(!parenOpen[0]) { 
                //if the first val of paren is false, this means that no parens
                //have been opened yet. so change it to true to indicate first open
                parenOpen = [true];
            }
            else {
                //otherwise, this means that a paren is already open and hasn't
                //been closed yet. so, just add another open one to the list.
                parenOpen.push(true);
            } 
            /* 
            Google also adds the ending parenthesis (greyed out) automatically.
            Can do something like add both paren, but ending paren is at 
            i + 1, and we continue adding characters at position i until
            we input ending paren, closing the parens.
            */
            dot = false; // reset decimal point flag after an open paren.
            break;
        case ')':
            // same as operators, only execute if there isn't garb right b4
            if(garbageFree.every(Boolean)) {
                //if there is still an opening paren that hasn't been closed, go:
                if(parenOpen[0] === true) {
                    parenOpen.pop(); //pop the last true to close 1 opening paren.  
                    accumulator += buttonValue;
                    dot = false; // reset decimal point flag after a close paren.
                }
                // if we just popped the last true and the list is empty, reset
                // this means all opening parens have been closed.
                if(parenOpen.length === 0) {
                    parenOpen = [false];
                }
            }
            break;


        case '^':
            if(garbageFree.every(Boolean)) {
                accumulator += buttonValue;
            }
            break;


        case 'Backspace':
            //backspace with just 1 digit left should reset to 0, not empty string.
            if(accumulator.length === 1) {
                accumulator = '0';
                dot = false; // reset decimal point flag after clearing.
                parenOpen.length = 0;
                parenOpen = [false]; // reset parenthesis flag after clearing.
                untouched = true; // reset this flag too.
            }
            else if(accumulator[accumulator.length - 1] === ' ') {
                //document.getElementById('display').innerHTML = accumulator.slice(0, -3);
                accumulator = accumulator.slice(0, -3);
            }
            //Dot Logic
            else if(accumulator[accumulator.length - 1] === '.') {
                dot = false;
                accumulator = accumulator.slice(0, -1);
            }

            //Parenthesis logic
            else if(accumulator[accumulator.length - 1] === '(') {
                if(parenOpen.length === 1) {
                    parenOpen = [false];
                }
                else { 
                    parenOpen.pop();
                }
                console.log('parenOpen: ' + parenOpen);
                accumulator = accumulator.slice(0, -1);
            }
            else if(accumulator[accumulator.length - 1] === ')') {
                if(!parenOpen[0]) {
                    parenOpen = [true];
                }
                else {
                    parenOpen.push(true);
                }
                console.log('parenOpen: ' + parenOpen);
                accumulator = accumulator.slice(0, -1);
            }


            //otherwise, cut off the last character of the accumulator string.
            else {
                accumulator = accumulator.slice(0, -1);
            }
            break;
        case 'c':
        case 'C':
            accumulator = '0';
            dot = false; // reset decimal point flag after clearing.
            parenOpen.length = 0;
            parenOpen = [false]; // reset parenthesis flag after clearing.
            untouched = true; //reset this too
            break;
        case '=':
        case 'Enter':
            //run only if valid end to expression
            if(garbageFree.every(Boolean)) {
                console.log('equals: ' + accumulator);
                accumulator = accumulator[0];
                dot = false; // reset decimal point flag after evaluation.
                parenOpen.length = 0;
                parenOpen = [false]; // reset parenthesis flag after evaluation.
                untouched = true; //reset it too
            }
            break;
        default:
    }
    //CHANGED TO =ACCUMULATOR INSTEAD OF =DISPLAY TO TEST
    document.getElementById('display').innerHTML =  accumulator;
}