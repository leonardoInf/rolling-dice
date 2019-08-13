/*
Rolling Dice online - Script
*********************************************
08/2019, by leonardoInf
Repository: https://github.com/leonardoInf/rolling-dice
*/

//Global variables for communication between anonymous functions
var index = 0;
var donePreRolling = false;
// ************************************* 
 
var amountOfLoops = 2;                 //toggle amount of pre-rolls
var loopDuration = 900;                //duration of one loop in milliseconds

$(document).ready(function(){          //when document is ready...
    $("#roll-it").click(function(){     
           rollIt(false);             //set click event handler
    });
});

function rollIt(donePreRolling){
    if(donePreRolling){
        var randInt = 0;
        
        var ID2 = setInterval(function(){
            index += 1;
            var index_mod = index % 6;
            
            if(index == 1){
                randInt = Math.floor(Math.random() * 6) + 1; //pseudorandom ints between 1 and 6
                console.log("randInt: " + (randInt%6));
            }
            
            if(index > randInt){
                clearInterval(ID2);
                index = 0;
                return;
            }
            
            selectDice(index_mod);
            var index_decremented = index_mod - 1; 
            var deselectNum = ((index_decremented)+6)%6; //see preRoll() for explanation
            deselectDice(deselectNum);
            console.log(index);
            
        }, loopDuration/6);
    }
    else preRoll();
}

//Roll "amountOfLoops"-times before actually choosing a dice
function preRoll(){
    clearDices();
    var ID =  setInterval(function(){  //every 500ms...
            index += 1;
            var index_mod = index%6;   //allow multiple loops
            
            if(index > 6*amountOfLoops){
                index=0;
                $("#dice0").css("color", "black");
                clearInterval(ID);
                rollIt(true);
                return;
            }
                console.log("Ändere dice" + index_mod);
                if((index_mod) == 0){
                    selectDice(0);
                    $("#dice0").css("color", "green");
                    $("#dice5").css("color", "black");
                }
                else{
                    selectDice(index_mod);
                    var index_decremented = index_mod-1;
                    var deselectNum = ((index_decremented)+6)%6;  //correctly implement mod for -1
                    deselectDice(deselectNum);
                }
            }, loopDuration/6);
}

function selectDice(num){
    $("#dice" + num).css("color", "green");
}

function deselectDice(num){
    $("#dice" + num).css("color", "black");
}

function clearDices(){
    for(var i = 0; i<6; i++){
        deselectDice(i);
    }
}
    
    