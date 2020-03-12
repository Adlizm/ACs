// Autômato de Celulares implementado usando com base o artigo
// "Autômatos celulares estocásticos bidimensionais aplicados a simulaçao de propagação de incêndios em florestas homogêneas"
// Henrique A. Lima e Danielli A. Lima - IFTM
// disponivel em: https://docplayer.com.br/139450384-Automatos-celulares-estocasticos-bidimensionais-aplicados-a-simulacao-de-propagacao-de-incendios-em-florestas.html

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const Width = 600;
const Height = 600;
const wh = 5;

const rows = Height/wh;
const cols = Width/wh;


const [ Plant, Ashe, Burning] = [ 0 ,1 , 2]
const neighbors = 8
const fireIntensity = [ 0.25, 0.4, 0.7, 0.8, 1, 0.75, 0.5, 0.2 ] 

const colors = [ "#0f0", "#000" ] 
const colorsFire = [ "#dcfd01", "#fefe00", "#ff7f00", "#fb0000" ]

canvas.width = Width;
canvas.height = Height;

var matrixStates = undefined;

var matrixWind = [[0.075,0.05,0.05 ],
                  [0.14 ,0   ,0.05 ],
                  [0.42 ,0.14,0.075]]

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
            matrixStates[i][j] = { state: Plant }
    }
}

function calcProbabilityToBurn(row,col){
    var sum = 0;
    for(let i = -1; i <= 1; i++)
        for(let j = -1; j <= 1; j++){
            var indexI = (i + row + rows) % rows
            var indexJ = (j + col + cols) % cols
            
            var { state , time } = matrixStates[indexI][indexJ];
            if(state == Burning && time)
                //sum += fireIntensity[time]/neighbors
                sum += matrixWind[i + 1][j + 1]
                //sum += fireIntensity[time] * matrixWind[i + 1][j + 1]
        }
    return sum;
}

function lawAC(row,col){
    const { state, time } = matrixStates[row][col];

    switch(state){
        case Plant:
            var prob = calcProbabilityToBurn(row,col)
            return Math.random() < prob ? { state: Burning, time: 0} : { state: Plant }  
        case Burning:
            return time == 7 ? { state: Ashe } : { state: Burning, time: time + 1 };
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
    for(let i = 0; i < rows; i++)
        for(let j = 0; j < cols; j++){
            var { state, time } = matrixStates[i][j]
            if(state != Burning){
                ctx.fillStyle = colors[state];
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
