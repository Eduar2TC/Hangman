let words = ['Hola', 'Loca', 'Papeles', 'Dogecoin'];
let globalArrayTuplesPositions = [];
let globalWordSelected = undefined;
let = container = document.querySelector('.container:nth-child(1)');
let htmlAddWords = `
        <div class="col">
            <div class="form">
                <input type="text" class="input">
            </div>
            <div class="row">
                <button onclick="actionAddWord()">Add</button>
                <button onclick="animationCancel()">Cancel</button>
            </div>
        </div>`;
let htmlMenu = `
        <div class="col">
            <button onclick="loadGame()">Start Game</button>
            <button onclick="animationAddWord()" >Add word</button>
        </div>`;
let htmlCanvas = `
        <div class="container-canvas">
            <canvas class="canvas">
            </canvas>
            <canvas class="word"></canvas>
            <canvas class="messages"></canvas>
                <div class="image-container">
                    <div class="meme-img"></div>
                </div>
                <div class="menu-on-canvas">
                    <button onclick="solveGame()">Solve</button>
                    <button onclick="animationCancel()" >Exit</button>
                </div>
        </div>
    `;


document.addEventListener("DOMContentLoaded", function () {
    let buttonPlay = document.querySelector('.col button:nth-child(1)');
    let buttonAddWords = document.querySelector('.col button:nth-child(2)');
    let buttonCancel = document.querySelector('.row button:nth-child(2)');
    let actionAdd = document.querySelector('.row button:nth-child(1)');
    let solve = document.querySelector('.menu-on-canvas button:nth-child(1)');

        buttonPlay.addEventListener('click', loadGame);
        buttonAddWords.addEventListener('click', animationAddWord);
        buttonCancel.addEventListener('click', animationCancel);
        actionAdd.addEventListener('click', actionAddWord);    
        solve.addEventListener('click', solveGame);    
});

function animationAddWord() {
    container.innerHTML = htmlAddWords;
    container.classList.add('animate');
    setTimeout(function () {
        container.classList.remove('animate');
    }, 500); // 500 is the same time as the CSS animation
}
function animationCancel(){
    container.innerHTML = htmlMenu;
    container.classList.add('animate1');
    setTimeout(function () {
        container.classList.remove('animate1');
    }, 500);
}
function actionAddWord(){
    let inputText = document.querySelector('.input');
    inputText = inputText.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    words.push(inputText);
    animationCancel();
}
function playGame(){
    let canvas = document.querySelector('.canvas');
    //var ctx = canvas.getContext('2d');
    const rc = rough.canvas(canvas);
    let canvasWord = document.querySelector('.word');
    let canvasMessage = document.querySelector('.messages');

    fix_dpi( canvas );
    fix_dpi( canvasWord );
    fix_dpi( canvasMessage );

    let word = words[wordSelected()].toUpperCase();
    let numberOfLetters = [...new Set(word)].length; //Collection of letters without repetition in the word
    let arrayTuplesPositions = drawLinesLetters(canvasWord, word);
    let health = 10;
    let message = undefined;
    let lettersCollected = [];

    globalWordSelected = word;
    globalArrayTuplesPositions = arrayTuplesPositions;

    //Key detection
    document.addEventListener("keydown", function (event) {
        let key = event.key.toUpperCase();
        if ((key >= 'A' && key <= 'Z') && !(key > -1 && key < 10) && !(event.which > 2 && event.which < 48 || event.which > 57 && event.which < 65 && event.which > 90 && event.which < 256 )
        && health > 0 && numberOfLetters > 0 ) {
            let letterPositionsOnWord = [];
            if (word.indexOf(key) > -1 && lettersCollected.indexOf(key) === -1 ) { //Esta en la palabra y no se ha ingresado
                letterPositionsOnWord = getIndexLetterFromWord(word, key); //Array of positions in word
                drawLetter(key, letterPositionsOnWord, arrayTuplesPositions, canvasWord); //( tecla, array de indices de posiciones de las coincidencias  )
                message = 'Correct!';
                drawMessage(key, message, health, canvasMessage);
                lettersCollected.push( key );
                numberOfLetters--;
                if (numberOfLetters == 0 ){
                    drawGameOverMessage('win', canvas, rc);
                }
            } else if (word.indexOf(key) > -1 && lettersCollected.indexOf(key) > -1 ) { //Esta en la palabra y ya se ha ingresado
                message = 'Already entered!';
                health--;
                drawMessage(key, message, health, canvasMessage);
                drawBody(health, canvas, rc);
            } 
            else if (word.indexOf(key) === -1) {
                message = 'Incorrect!';
                health--;
                drawMessage(key, message, health, canvasMessage);
                drawBody( health, canvas, rc);
            }
        }
    });
}
function getIndexLetterFromWord( word, letter ){
    let arrayPositions = [];
    for( let i = 0; i < word.length; i++  ){
        if( word[i] === letter ){
            arrayPositions.push( i );
        }
    }
    return arrayPositions;
}
function drawBody( health, canvas, rc ){
    switch(health){
        case 9:{
            drawBase( canvas, rc );
            break;
        }
        case 8:{
            drawTrunk( canvas, rc );
            break;
        }
        case 7:{
            drawTopBar(canvas, rc);
            break;
        }
        case 6:{
            drawRope(canvas, rc);
            break;
        }
        case 5:{
            drawHead(canvas, rc);
            break;
        }
        case 4: {
            drawBodyTrunk(canvas, rc);
            break;
        }
        case 3: {
            drawLeftArm(canvas, rc);
            break;
        }
        case 2: {
            drawRightArm(canvas, rc);
            break;
        }
        case 1: {
            drawLeftLeg(canvas, rc);
            break;
        }
        case 0: {
            drawRightLeg(canvas, rc);
            drawDeadEyes(canvas, rc);
            drawGameOverMessage('die', canvas, rc);
            break;
        }
    }
}
/*Draw functions */
function drawBase( canvas, rc ){
    let width = canvas.width;
    let height = canvas.height;
    let posInitX = width - 400;
    let posEndX = width - 100;
    let posIniY = height - 150;
    let posEndY = height - 150;

    rc.line(
        posInitX, posIniY, posEndX, posEndY, 
        {
            bowing: 6, 
            stroke: 'white', 
            strokeWidth: 5
        }
    );
}
function drawTrunk( canvas, rc ){
    let width = canvas.width;
    let height = canvas.height;
    let posInitX = width - 400;
    let posIniY = height - 150;
    let posEndX = width - 100;
    let posEndY = height - 550;

    let middleBasePositionX =  (posInitX + posEndX) / 2;
    rc.line(
        middleBasePositionX, posIniY, middleBasePositionX , posEndY,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 5
        }
    );
}
function drawTopBar( canvas, rc ){
    let width = canvas.width;
    let height = canvas.height;
    let posInitX = width - 400;
    let posIniY = height - 550;
    let posEndX = width - 100;
    let posEndY = height - 550; //End y

    let middleBasePositionX = (posInitX + posEndX) / 2;
    posEndX = middleBasePositionX - 500; //End x
    rc.line(
        middleBasePositionX, posIniY, posEndX, posEndY,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 5
        }
    );
}
function drawRope( canvas, rc ){
    let width = canvas.width;
    let height = canvas.height;

    let posIniX = ( (width - 400) + (width - 100) ) / 2  - 500; //End x
    let posIniY = height - 550;
    let posEndY = posIniY + 100;
    rc.line(
        posIniX, posIniY, posIniX, posEndY /*End y*/,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 5
        }
    );

}
/*Drawing man */
function drawHead( canvas, rc ){
    let width = canvas.width;
    let height = canvas.height;
    
    let posIniX = ((width - 400) + (width - 100)) / 2 - 500;
    let posIniY = height - 450;
    let diameter = 80;

    rc.circle(
        posIniX, posIniY + diameter/2, diameter,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 8
        }
    ); // centerX, centerY, diameter
}
function drawBodyTrunk( canvas, rc ){
    let width = canvas.width;
    let height = canvas.height;
    let posIniX = ((width - 400) + (width - 100)) / 2 - 500;
    let posIniY = height - 450 + 80; //-370
    let posEndY = posIniY + 100;
    rc.line(
        posIniX, posIniY, posIniX, posEndY,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 5
        }
    );
}
function drawLeftArm(canvas, rc) {
    let width = canvas.width;
    let height = canvas.height;
    let posIniX = ((width - 400) + (width - 100)) / 2 - 500;
    let posEndX = posIniX - 90;
    let posIniY = height - 450 + 80 + 50;
    let posEndY = posIniY - 20;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 5
        }
    );
}
function drawRightArm(canvas, rc) {
    let width = canvas.width;
    let height = canvas.height;
    let posIniX = ((width - 400) + (width - 100)) / 2 - 500;
    let posEndX = posIniX + 90;
    let posIniY = height - 450 + 80 + 50;
    let posEndY = posIniY - 20;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 5
        }
    );
}
function drawLeftLeg(canvas, rc){
    let width = canvas.width;
    let height = canvas.height;
    let posIniX = ((width - 400) + (width - 100)) / 2 - 500;
    let posEndX = posIniX + 90;
    let posIniY = height - 450 + 80 + 100;
    let posEndY =  posIniY + 40;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 5
        }
    );
}
function drawRightLeg(canvas, rc) {
    let width = canvas.width;
    let height = canvas.height;
    let posIniX = ((width - 400) + (width - 100)) / 2 - 500;
    let posEndX = posIniX - 90;
    let posIniY = height - 450 + 80 + 100;
    let posEndY = posIniY + 50;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 16,
            stroke: 'white',
            strokeWidth: 5
        }
    );
}
function drawDeadEyes( canvas, rc ){

    let width = canvas.width;
    let height = canvas.height;
    let posIniX = ((width - 400) + (width - 100)) / 2 - 495;
    let posEndX = posIniX + 20;
    let posIniY = height - 410;
    let posEndY = height - 425;

    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 2,
            stroke: 'white',
            strokeWidth: 5
        }
    );
    posIniY = height - 425;
    posEndY = height - 410;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 2,
            stroke: 'white',
            strokeWidth: 5
        }
    );
    /*Left eye */
    posIniX = posIniX - 10;
    posEndX = posIniX - 20;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 2,
            stroke: 'white',
            strokeWidth: 5
        }
    );
    posIniY = height - 425;
    posEndY = height - 410;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 2,
            stroke: 'white',
            strokeWidth: 2
        }
    );
    posIniY = height - 410;
    posEndY = height - 425;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 2,
            stroke: 'white',
            strokeWidth: 2
        }
    );

}
function loadGame(){
    container.innerHTML = htmlCanvas;
    container.classList.add('animate');
    setTimeout(function () {
        container.classList.remove('animate');
    }, 500);
    playGame();
}

function fix_dpi(canvas) {
    let dpi = window.devicePixelRatio;
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    //scale the canvas
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
}
function drawLetter( letter, arrayPositionsOnWord, arrayTuplesPositions, canvas ){
    const ctx = canvas.getContext('2d');
    const rc = rough.canvas(canvas);
    ctx.font = '4rem Caveat Brush';
    ctx.fillStyle = 'white';
    let tuplesPositions = [];
    for( let i = 0; i < arrayPositionsOnWord.length; i++ ){
        tuplesPositions.push(arrayTuplesPositions[arrayPositionsOnWord[i]] );
    }
    for( let i = 0; i < tuplesPositions.length; i++ ){
        ctx.fillText(letter, tuplesPositions[i].x, tuplesPositions[i].y  );
    }
    console.log(tuplesPositions[0].x );
}
function wordSelected(){
    const randomWordPosition = Math.floor(Math.random() * words.length);
    return randomWordPosition;
}
function drawLinesLetters( canvas, word ){
    const rc = rough.canvas( canvas );
    let posInitX = canvas.width / 10;
    let posEndX = posInitX + 50;
    let posInitY = (canvas.height / 2) + 13;
    let arrayPositions =[];
    for( let i = 0; i < word.length; i++ ){
        rc.line(
            posInitX , posInitY, posEndX, posInitY,
            {
                bowing: 2,
                stroke: 'white',
                strokeWidth: 5
            }
        );
        arrayPositions.push({x: posInitX + 10, y: posInitY - 10});
        posInitX += 70;
        posEndX += 70;
    }
    return arrayPositions;
}
function drawMessage( letter, message, health, canvas ){
    const rc = rough.canvas( canvas )
    const ctx = canvas.getContext('2d');
    let posIniX = canvas.width / 6;
    let posEndY = (canvas.height / 4);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // x, y, width, height
    //Message color
    if (message === 'Correct!') {
        ctx.font = '1.3rem Caveat Brush';
        ctx.fillStyle = '#B5EAEA';
    } else if (message === 'Already entered!' ){
        ctx.font = '1.2rem Caveat Brush';
        ctx.fillStyle = 'yellow';
    }
    else {
        ctx.font = '1.35rem Caveat Brush';
        ctx.fillStyle = 'red';
    }
    ctx.fillText(message, posIniX, posEndY - 5);
    
    ctx.font = '1.2rem Caveat Brush';
    ctx.fillStyle = 'white';
    ctx.fillText('Letter:', posIniX, posEndY + 20);
    
    ctx.font = '2rem Caveat Brush';
    ctx.fillStyle = 'white';
    ctx.fillText(letter, posIniX + 50, posEndY + 23);
    
    ctx.font = '2rem Caveat Brush';
    ctx.fillStyle = '#FF2442';
    ctx.fillText('♥ ', posIniX, posEndY + 45);

    ctx.font = '1.5rem Caveat Brush';
    ctx.fillStyle = 'white';
    ctx.fillText('    :', posIniX + 20, posEndY + 40);

    ctx.font = '1.5rem Caveat Brush';
    ctx.fillStyle = 'white';
    ctx.fillText(health, posIniX + 50, posEndY + 45);

}
function drawGameOverMessage( message, canvas, rc ){
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let posIniX = ((width - 400) + (width - 100)) / 2 - 400;
    let posIniY = height - 410;
    //For positions line
    let posEndX = posIniX + 200;
    //rc.rectangle( 10, 10, 200, 100); // x, y, width, height
    if( message === 'die' ){
        ctx.font = '3rem Gaegu';
        ctx.fillStyle = 'white';
        ctx.fillText('You died!', posIniX, posIniY);
    } else if (message === 'win' ){
        ctx.font = '3.5rem Gaegu';
        ctx.fillStyle = 'yellow';
        ctx.fillText('You Win!', posIniX, posIniY);
    }
    //Draw line
    posIniX = posIniX + 50;
    posEndX = posEndX  + 100;
    posIniY = height - 390;
    let posEndY = posIniY;
    rc.line(
        posIniX, posIniY, posEndX, posEndY,
        {
            bowing: 6,
            stroke: 'white',
            strokeWidth: 3
        }
    );
}
function solveGame(){
    let canvas = document.querySelector('.word');
    const ctx = canvas.getContext('2d');
    ctx.font = '4rem Caveat Brush';
    ctx.fillStyle = 'white';
    for(let i = 0; i < globalWordSelected.length; i++){
        ctx.fillText( globalWordSelected[i], globalArrayTuplesPositions[i].x, globalArrayTuplesPositions[i].y);
    }
}
/*window.addEventListener('resize', function () {
    let canvas = document.querySelector('.canvas');
    var ctx = canvas.getContext('2d');
    const rc = rough.canvas(canvas);
    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;
    drawBase(canvas, rc);
    drawTrunk(canvas, rc);
    drawTopBar(canvas, rc);
    drawRope(canvas, rc);
    drawHead(canvas, rc);
    drawBodyTrunk(canvas, rc);
    drawLeftArm(canvas, rc);
    drawRightArm(canvas, rc);
    drawLeftLeg(canvas, rc);
    drawRightLeg(canvas, rc);
});*/