// Automato de Celular implementado usando com base o artigo
// "Inc�ndios florestais em Aut�omatos Celulares, simples e grandes queimada"
// Vitor Hugo Patricio Louzada e Wilson Castro Ferreira Jr. UNICAMP
// disponivel em: https://repositorio.ul.pt/bitstream/10451/1181/1/17296_ULFC080364_TM.pdf

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const btnStart = document.getElementById("start");

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

// Definicoes especificas para este AC
const [Plant, Burning] = [0,1];
var nInitBurning = 1;
var LQ = 1;
var LR = 1;

var windMatrix = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]

function calculateWindMatrix(xWind,yWind) {
    len = Math.sqrt(xWind*xWind + yWind*yWind)
    xWind /= len
    yWind /= len

    for(let x = -1; x <= 1; x++){
        for(let y = 1; y >= -1; y--){
            len = Math.sqrt(x*x + y*y)
            if(len != 0){
                xVec = x / len
                yVec = y / len
                windMatrix[1 - y][x + 1] = (xVec*xWind + yVec*yWind + 1) / 2 // [-1, 1] -> [0, 1]     
            }else{
                windMatrix[1 - y][x + 1] = 0
            }
        }
    }
}
calculateWindMatrix(1,0)


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
        
        map[40][40] = {type: Burning, time: 1};
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
                let quantRed = Math.floor(255 - mid*255);
                let quantGreen = Math.floor(quantRed / 2)
                ctx.fillStyle = `rgb(${quantRed},${quantGreen},0)`;
                ctx.fillRect(j*wh,i*wh,wh,wh);
            }
           
        }
    }
}

function calculateProbability(i,j){
    var sum = 0;
    var xWind = 0, yWind = 0
    
    for (let row = i - 1; row <= i + 1; row++) {
        for (let col = j - 1; col <= j + 1; col++) {
            if (row >= 0 && row < rows && col >= 0 && col < cols){
                let value = map[row][col]
                if(value.type == Burning){
                    sum += value.time * windMatrix[yWind][xWind];
                }
            } 
            xWind++
        }
        xWind = 0
        yWind++
    }

    return  sum / LQ * map[i][j].time / LR;
}

function getNewValue(value,i,j){
    switch(value.type){
        case Plant:  
            let prob = calculateProbability(i,j);
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