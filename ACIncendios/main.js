const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const btnStart = document.getElementById("start");
const btnProx = document.getElementById("nextState");

const inputRateTB = document.getElementById("rToBorning");
const inputRateBTA = document.getElementById("rBornToAshe");
const ACStatistic = document.getElementById("statisticAC");
const CheckEight = document.getElementById("eigth");

const Width = 400;
const Height = 400;
const wh = 20;
const rows = Height/wh;
const cols = Width/wh;

const colours = ["#fff","#0f0", "#f90", "#444"];
var map = [];
var eightNeightborhood = false;
var statistcAutomata = false;
var rateBurningToAshes = 1;
var rateToBurning = 1;

canvas.width = Width;
canvas.height = Height;
document.body.append(canvas);
btnStart.textContent = "Start";
btnProx.textContent = "Next State";

btnStart.onclick = () =>{
    rateBurningToAshes = inputRateBTA.value / 100;
    rateToBurning = inputRateTB.value / 100;
    eightNeightborhood = CheckEight.checked;
    statistcAutomata = ACStatistic.checked;
    for(let i = 0; i < rows; i++){
        map[i] = [];
        for(let j = 0; j < cols; j++)
            if(Math.random() < 0.6)
                map[i][j] = 0;      //Não queimavel
            else if(Math.random () < 0.05)
                map[i][j] = 2;      //Queimando
            else
                map[i][j] = 1;      //Planta
    }
    startAC();
}
btnProx.onclick = () =>{
    startAC();
}

function startAC(){
    draw();
    update();
}

function draw(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            ctx.fillStyle = colours[map[i][j]];
            ctx.fillRect(j*wh,i*wh,wh,wh);
        }
    }
}

function countBurning(i,j){
    var count = 0;
    if(i - 1 >= 0 && map[i - 1][j] == 2)
        count++;
    if(j - 1 >= 0 && map[i][j - 1] == 2)
        count++;
    if(i + 1 < rows && map[i + 1][j] == 2)
        count++;
    if(j + 1 < cols && map[i][j + 1] == 2)
        count++;
    if(eightNeightborhood === true){
        if(i - 1 >= 0   && j - 1 >= 0   && map[i - 1][j - 1] == 2)
            count++;
        if(i + 1 < rows && j - 1 >= 0   && map[i + 1][j + 1] == 2)
            count++;
        if(i - 1 >= 0   && j + 1 < cols && map[i - 1][j + 1] == 2)
            count++;
        if(i + 1 < rows && j + 1 < cols && map[i + 1][j + 1] == 2)
            count++;
    }
    return count;
}

function getNewValue(value,i,j){
    switch(value){
        case 0:  
            return 0;
        case 2: 
            if(statistcAutomata)
                return Math.random() < rateBurningToAshes ? 3 : 2; 
            return 3;
        case 3:  
            return 3;
        case 1:
            let count = countBurning(i,j);
            if(count > 0){
                if(statistcAutomata)
                    return Math.random() < count*rateToBurning ? 2 : 1; 
                return 2;
            }
    }
    return 1;
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