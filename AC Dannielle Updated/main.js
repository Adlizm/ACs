// Aut�mato de Celulares implementado usando com base o artigo
// "Aut�matos celulares estoc�sticos bidimensionais aplicados a simula�ao de propaga��o de inc�ndios em florestas homog�neas"
// Henrique A. Lima e Danielli A. Lima - IFTM
// disponivel em: https://docplayer.com.br/139450384-Automatos-celulares-estocasticos-bidimensionais-aplicados-a-simulacao-de-propagacao-de-incendios-em-florestas.html

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const Width = 400;
const Height = 400;
const wh = 10;

const rows = Height/wh;
const cols = Width/wh;


const [ Plant, Ashe, Burning] = [ 0 ,1 , 2]
const fireIntensity = [ 0.25, 0.4, 0.7, 0.8, 1, 0.75, 0.5, 0.2 ] 
const MAX_PLANT_TIME = 20
const LR = 30
const LQ = fireIntensity.length

const colors = [ "#0f0", "#000" ] 
const colorsFire = [ "#dcfd01", "#fefe00", "#ff7f00", "#fb0000" ]

canvas.width = Width;
canvas.height = Height;

var matrixStates = undefined;

var windMatrix = [
    [0,0,0],
    [0,0,0],
    [0,0,0]]
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

const btnStart = document.getElementById("start");
btnStart.onclick = () => {
    reset()
    draw()
}

function addFire(event){
    const indexI = Math.floor(event.offsetY / wh)
    const indexJ = Math.floor(event.offsetX / wh)

    matrixStates[indexI][indexJ] = { state:Burning, time: 0 }
    draw()
}
canvas.onclick = addFire
    

function reset(){
    matrixStates = []
    for(let i = 0; i < rows; i++){
        matrixStates[i] = []
        for(let j = 0; j < cols; j++)
            matrixStates[i][j] = { state: Plant, time: 0}
    }
}

function calcProbabilityToBurn(row,col){
    var sum = 0;
    for(let i = -1; i <= 1; i++)
        for(let j = -1; j <= 1; j++){
            var indexI = (i + row)
            var indexJ = (j + col)
            if(indexI >= 0 && indexI < rows && indexJ >= 0 && indexJ < cols){
                var { state , time } = matrixStates[indexI][indexJ];
                if(state == Burning && time)
                    sum += windMatrix[i + 1][j + 1] * time
            }
        }

    return sum / LQ * matrixStates[row][col].time / LR ;
}

function lawAC(row,col){
    const { state, time } = matrixStates[row][col];

    switch(state){
        case Plant:
            var prob = calcProbabilityToBurn(row,col)
            return Math.random() < prob ? 
                { state: Burning, time: 0} : 
                { state: Plant, time: time > LR ? LR : time + 1 }  
        case Burning:
            return time == LQ - 1 ? { state: Ashe } : { state: Burning, time: time + 1 };
    }

    return { state: Ashe };
}

function update(){
    newMatrix = []
    for(let i = 0; i < rows; i++){
        newMatrix[i] = []
        for(let j = 0; j < cols; j++){
            newMatrix[i][j] = lawAC(i,j);
        }
    }
    delete matrixStates;
    matrixStates = newMatrix;
}

function draw(){
    ctx.clearRect(0,0,Width,Height)
    for(let i = 0; i < rows; i++)
        for(let j = 0; j < cols; j++){
            var { state, time } = matrixStates[i][j]
            if(state == Ashe){
                ctx.fillStyle = colors[state];
            }else if(state == Plant){
                ctx.fillStyle = "#00FF00";
            }else{
                const indexColor = Math.floor(time/2)
                ctx.fillStyle = colorsFire[indexColor]
            }
            ctx.fillRect(j*wh,i*wh,wh,wh);
        }
}

window.setInterval(() => {
    if(matrixStates){
        update()
        draw()
    }
}, 100)
