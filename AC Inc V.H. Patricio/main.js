// Automato de Celular implementado usando com base o artigo
// "Incêndios florestais em Autˆomatos Celulares, simples e grandes queimada"
// Vitor Hugo Patricio Louzada e Wilson Castro Ferreira Jr. UNICAMP
// disponivel em: https://repositorio.ul.pt/bitstream/10451/1181/1/17296_ULFC080364_TM.pdf

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const btnStart = document.getElementById("start");
// Esse AC realizará o update a cada x quantidade de tempo

const Width = 400;
const Height = 400;
const wh = 8;
const rows = Height/wh;
const cols = Width/wh;

var map = [];
var eightNeightborhood = true;
var statistcAutomata = false;
var start = false;


canvas.width = Width;
canvas.height = Height;
document.body.append(canvas);

// Definição específica para este AC
const [Plant, Burning] = [0,1];
var nInitBurning = 1;
var LQ = 1;
var LR = 1;

const inputNBurn = document.getElementById("inputNBurn");
const inputLR = document.getElementById("inputLR");
const inputLQ = document.getElementById("inputLQ");
inputNBurn.onchange = () => {nInitBurning = inputNBurn.value / 1};
inputLR.onchange = () => {LR = inputLR.value / 1};
inputLQ.onchange = () => {LQ = inputLQ.value / 1};


btnStart.onclick = () =>{
    for(let i = 0; i < rows; i++){
        map[i] = [];
        for(let j = 0; j < cols; j++)
            map[i][j] = {type: Plant, time: LR};
    }
    for(let i = 0; i < nInitBurning; i++){
        let row = Math.floor(Math.random()*rows);
        let col = Math.floor(Math.random()*cols);
        map[row][col] = {type: Burning, time: 1};
    }
    start = true;
    updateAC();
}

window.setInterval(updateAC,200);

function updateAC(){
    if(start){
        draw();
        update();
    }
}

function draw(){
    ctx.clearRect(0,0,Width,Height);
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(map[i][j].type == Plant){
                let mid = map[i][j].time / LR;
                let quantGreen = Math.floor(255 - mid*155);
                ctx.fillStyle = `rgb(0,${quantGreen},0)`;

                ctx.beginPath();
                ctx.moveTo(j*wh,(i + 1)*wh);
                ctx.lineTo((j+0.5)*wh,i*wh);
                ctx.lineTo((j+1)*wh,(i+1)*wh);
                ctx.closePath();
                ctx.fill();
            }else{
                let mid = map[i][j].time / LQ;
                let quantGray = Math.floor(255 - mid*255);
                ctx.fillStyle = `rgb(${quantGray},${quantGray},${quantGray})`;
                ctx.fillRect(j*wh,i*wh,wh,wh);
            }
           
        }
    }
}

function meanBurningTime(i,j){
    var sum = 0;
    var count = 0;
    
    for (let row = i - 1; row <= i + 1; row++) {
        for (let col = j - 1; col <= j + 1; col++) {
            let indexI = (row + rows)%rows;
            let indexJ = (col + cols)%cols;
            if(map[indexI][indexJ].type == Burning){
                count++; 
                sum += map[indexI][indexJ].time;
            }
        }
    }
    return count == 0 ? 0 : sum / count;
}

function getNewValue(value,i,j){
    switch(value.type){
        case Plant:  
            let mean = meanBurningTime(i,j);
            let prob = value.time / LR * mean / LQ;
            if(Math.random() < prob)
                return {type: Burning, time: 1};

            let time = value.time >= LR ? LR : value.time + 1;
            return {type: Plant, time}; 
        case Burning: 
            if(value.time >= LQ)
                return {type: Plant, time: 1};
            return {type: Burning, time: value.time + 1};
    }
}

function update(){
    var newMap = [];
    for(let i = 0; i < rows; i++){
        newMap[i] = [];
        for(let j = 0; j < cols; j++){
            newMap[i][j] = getNewValue(map[i][j],i,j);
        }
    }
    map = newMap;
}