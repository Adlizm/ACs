const Law =  document.getElementById("law");
const Intarations = document.getElementById("repeats");
const Init = document.getElementById("init");
const Prints = document.getElementById("error");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const widthCube = 3;
var lengthArrayStates = 100; 
var initArray = []

document.body.appendChild(canvas);
Init.onclick = () =>{
    var lawNumber = Law.value/1;
    var nIntarations = Intarations.value/1; 
    runAC(lawNumber,nIntarations);
}

function convertNumbertoLawArray(number){
    var array = [];
    for(let index = 0; index < 8 ; index++){
        array[index] = number%2;
        number = Math.floor(number/2);
    }
    return array;
}

function runAC(lawNumber,nIntarations){
    canvas.height = widthCube*(nIntarations + 1);
    canvas.width = widthCube*lengthArrayStates;

    const lawArray = convertNumbertoLawArray(lawNumber); 
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#000";
    for(let i = 0; i<lengthArrayStates; i++){
        initArray[i] = Math.random() < 0.5 ? 1: 0;
        if(initArray[i] == 0){
            ctx.fillRect(i*widthCube,0,widthCube,widthCube);
        }
    }
    for(let i = 1; i <= nIntarations; i++){
        var newArrayStates = [];
        for(let j = 0; j < lengthArrayStates; j++){
            var indexLaw = 0;
            var valuePosition = 1;
            for(let k = j+1; k >= j-1; k--){
                let ind = (k+lengthArrayStates)%lengthArrayStates;
                indexLaw += initArray[ind]*valuePosition
                valuePosition *= 2;
            }
            newArrayStates[j] = lawArray[indexLaw];
            if(newArrayStates[j] == 0){
                ctx.fillRect(j*widthCube,i*widthCube,widthCube,widthCube);
            }
        }
        initArray = newArrayStates;
    }
}