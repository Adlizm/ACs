const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const Width = 500;
const Height = 500;
const wh = 20;

const rows = Height/wh;
const cols = Width/wh;

const inputPUrb = document.getElementById("pUrb");
const inputPCres = document.getElementById("pCres");
const inputPIns = document.getElementById("pIns");
const inputEraseTime = document.getElementById("eraseTime");

var pUrb = 0.01;
var pCres = 0.01;
var pIns = 0.01;
var eraseTime = 2;

inputPUrb.onchange = () => {pUrb = inputPUrb.value / 100;}
inputPCres.onchange = () => {pCres = inputPCres.value / 100;}
inputPIns.onchange = () => {Ins = inputPIns.value / 100;}
inputEraseTime.onchange = () => {eraseTime = inputEraseTime.value / 1;}


const states = {
    Wather: 0,
    Road: 1,
    House: 2,
    Fire: 3,
    Plant: 4,
    Ground: 5
};

const colors = ["#55f","#444","#ffa","#f30","#2f2","#550"]

canvas.width = Width;
canvas.height = Height;

var matrixStates = undefined;

const btnStart = document.getElementById("start");
btnStart.onclick = () => {
    matrixStates = [
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]]
    /*
    for(let i = 0; i < rows; i++){
        matrixStates[i] = []
        for(let j = 0; j < cols; j++){
            matrixStates[i][j] = states.Ground;
            if(Math.random() < 0.3)
                matrixStates[i][j] = states.Plant; 
            if(Math.random() < 0.2)
                matrixStates[i][j] = states.House;
            
        }
    }
    */
    draw();
}

const btnNext = document.getElementById("next");
btnNext.onclick = update;

var mouseButton;

canvas.onmousemove = (event) => {
    if(mouseButton == undefined)
        return;
    var x = Math.floor(event.offsetX/wh);
    var y = Math.floor(event.offsetY/wh);
    
    if(mouseButton == 1){
        matrixStates[y][x] = states.Wather;
        draw();
    }else if(mouseButton == 0){
        matrixStates[y][x] = states.Road;
        draw();
    }
}
document.onmousedown = (event) => {
    mouseButton = event.button;
}
document.onmouseup = () => {
    mouseButton = undefined
}

function neighborsFires(row,col){
    var sum = 0;
    for(let i = row - 1; i <= row + 1; i++)
        if(i >= 0 && i < rows)
            for(let j = col - 1; j <= col + 1; j++)
                if(j >= 0 && j < cols){
                    var {state} = matrixStates[i][j];
                    if(state && state == states.Fire)
                        sum++;
                }
    return sum;
}

function lawAC(row,col){
    var {state,tempo} = matrixStates[row][col];
    if(state == undefined)
        state = matrixStates[row][col];

    switch(state){
        case states.Wather:
            return states.Wather;
        
        case states.Road:
            return states.Road;
        
        case states.Fire:
            if(tempo >= eraseTime)
                return states.Ground;
            return {state: states.Fire, tempo: tempo + 1};
        
        case states.Ground:
            if(Math.random() < pUrb)
                return states.House;
            else if(Math.random() < pCres)
                return states.Plant;
            return states.Ground;
       
        case states.Plant: 
            var contFire = neighborsFires(row,col);
            if(contFire >= 1)
                return {state: states.Fire, tempo: 0};       
            else if(Math.random() < pUrb)
                return states.House;
            else if(Math.random() < pIns)
                return {state: states.Fire, tempo: 0};
            return states.Plant;

        case states.House:
            var contFire = neighborsFires(row,col);
            if(contFire >= 1)
                return {state: states.Fire, tempo: 0}
            else if(Math.random() < pUrb)
                return states.House;
            else if(Math.random() < pIns)
                return {state: states.Fire, tempo: 0};
            return states.House;
    }
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
            var {state} = matrixStates[i][j]
            if(state)
                ctx.fillStyle = colors[ state ];
            else
                ctx.fillStyle = colors[ matrixStates[i][j] ]
            ctx.fillRect(j*wh,i*wh,wh,wh);
        }
    
    window.requestAnimationFrame(draw);
}