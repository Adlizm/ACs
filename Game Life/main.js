const Width = 600,Heigth = 600;
const wh = 10;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const rows = (Heigth/wh);
const cols = (Width/wh);

canvas.width = Width;
canvas.height = Heigth;

var start = false;

var gameLife = [];
for(let i = 0; i<rows; i++){
    gameLife[i] = []
    for(let j = 0; j<cols; j++){
        gameLife[i][j] = 0;
    }
}
canvas.addEventListener("click",(e) =>{
    x = Math.floor(e.offsetX/wh);
    y = Math.floor(e.offsetY/wh);
    gameLife[y][x] = 1;
    draw();
})

const buttonClear = document.createElement("button");
buttonClear.onclick = () => {
    clear();
    start = false;
    window.clearTimeout();
}
buttonClear.appendChild(document.createTextNode("Clear"));

const buttonStart = document.createElement("button");
buttonStart.onclick = () => {
    window.clearTimeout();
    start = true;
    run();
}
buttonStart.appendChild(document.createTextNode("Start"));


const buttonPause = document.createElement("button");
buttonPause.onclick = () => {
    start = false;
    window.clearTimeout();
}
buttonPause.appendChild(document.createTextNode("Pause"));

document.body.append(canvas,buttonClear,buttonStart,buttonPause);
function clear(){
    for(let i = 0; i<rows; i++){
        for(let j = 0; j<cols; j++){
            gameLife[i][j] = 0;
        }
    }
}
function run(){
    draw();
    if(start){
        update();
    }
    window.setTimeout(run,500);
}
function draw(){
    ctx.fillRect(0,0,Width,Heigth);
    for(let i = 0; i<rows; i++){
        for(let j = 0; j<cols; j++){
            ctx.fillStyle = "#aaa";
            ctx.fillRect(j*wh,i*wh,wh,wh);
            if(gameLife[i][j] === 1){
                ctx.fillStyle = "#000";
            }else{
                ctx.fillStyle = "#fff";
            }
            ctx.fillRect(j*wh + 1, i*wh + 1, wh, wh);
        }
    }
    ctx.strokeStyle = "#aaa";
    ctx.moveTo(cols*wh,0);
    ctx.lineTo(cols*wh,rows*wh);
    ctx.lineTo(0,rows*wh);
    ctx.stroke();
}
function update(){
    var newGameLife = [];
    for(let i = 0; i<rows; i++){
        newGameLife[i] = [];
        for(let j = 0; j<cols; j++){
            let Ones = numberOfOnes(gameLife,j,i);
            //Regras do Automáto de Celular
            if(gameLife[i][j] == 1){
                newGameLife[i][j] = Ones < 2 || Ones > 3 ? 0 : 1; 
                // Vivos ficam vivos somente com 2 ou 3 visinhos vivos
            }else{
                newGameLife[i][j] = Ones == 3 ? 1 : 0;
                // Mortos ficam vivos se possuirem 3 vizinhos vivos
            }
        }
    }
    gameLife = newGameLife;
}
function numberOfOnes(game,x,y){
    var count = 0;
    for(let i = y-1; i <= y+1; i++){
        for(let j = x-1; j <= x+1; j++){
            let indexI = (i+rows)%rows;
            let indexJ = (j+cols)%cols;
            count += game[indexI][indexJ];
        }
    }
    count -= game[y][x];
    return count;
}
run();