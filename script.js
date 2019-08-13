/*
Rolling Dice online - Script
*********************************************
08/2019, by leonardoInf
Repository: https://github.com/leonardoInf/rolling-dice
*/

//Global variables for communication between anonymous functions
var rolling_index = 0;                  
var donePreRolling = false;
// ************************************* 
 
var amountOfLoops = 2;                 //toggle amount of pre-rolls
var preRollDuration = 700;             //duration of one pre-roll in milliseconds
var finalRollDuration = 1200;          //..

var rollHistory = [];                   //this is where previous rolls will be saved during execution
var rollHistoryIndex = 1;               //holds the index of the currently viewed element

$(document).ready(function(){          //when document is ready...
    
    //handle dice roll
    $("#roll-it").click(function(){
        rollHistoryIndex = 1;           //skip last element
        disableButtons();
        console.log(rollHistory);
        rollIt(false);             //set click event handler, start preroll
    });
    
    //show previous roll
    $("#previous").click(function(){
        clearDices();
        enableNextButton();
        rollHistoryIndex += 1;
        highlightDice(rollHistory[rollHistory.length-(rollHistoryIndex)]);
        if((rollHistory.length-1) < rollHistoryIndex+1){    //disable button if there are no more elements
            disablePreviousButton();
        }
        console.log("Looking at: " + rollHistory[rollHistory.length-(rollHistoryIndex)]);
    });
   
});

function rollIt(donePreRolling){
    if(donePreRolling){
        var randInt = 0;
        
        var ID2 = setInterval(function(){
            rolling_index += 1;
            var rolling_index_mod = rolling_index % 6;
            
            if(rolling_index == 1){
                randInt = Math.floor(Math.random() * 6) + 1; //pseudorandom ints between 1 and 6
                console.log("randInt: " + (randInt%6));
            }
            
            if(rolling_index > randInt){
                rolling_index = 0;
                rollHistory.push(randInt%6);  //add new roll to history
                enableButtons();             //buttons can be used again
                clearInterval(ID2);          //unregister interval loop
                return;
            }
            
            selectDice(rolling_index_mod);
            var rolling_index_decremented = rolling_index_mod - 1; 
            var deselectNum = ((rolling_index_decremented)+6)%6; //including modulos for -1
            deselectDice(deselectNum);
            console.log(rolling_index);
            
        }, finalRollDuration/6);
    }
    else preRoll();
}

//Roll "amountOfLoops"-times before actually choosing a dice
function preRoll(){
    clearDices();
    var ID =  setInterval(function(){  //every 500ms...
            rolling_index += 1;
            var rolling_index_mod = rolling_index%6;   //allow multiple loops
            
            if(rolling_index > 6*amountOfLoops){
                rolling_index=0;
                $("#dice0").css("color", "black");
                clearInterval(ID); //unregister interval loop
                rollIt(true);
                return;
            }
                console.log("changing dice" + rolling_index_mod);
                if((rolling_index_mod) == 0){
                    selectDice(0);
                    $("#dice0").css("color", "green");
                    $("#dice5").css("color", "black");
                }
                else{
                    selectDice(rolling_index_mod);
                    var rolling_index_decremented = rolling_index_mod-1;
                    var deselectNum = ((rolling_index_decremented)+6)%6;  //correctly implement mod for -1
                    deselectDice(deselectNum);
                }
            }, preRollDuration/6);
}

function selectDice(num){
    $("#dice" + num).css("color", "green");
}

function highlightDice(num){
    $("#dice" + num).css("color", "yellow");
}

function deselectDice(num){
    $("#dice" + num).css("color", "black");
}

function clearDices(){
    for(var i = 0; i<6; i++){
        deselectDice(i);
    }
}

function disableButtons(){
    $("#roll-it").css("pointer-events","none");    //make "roll-it"-button temporarly not a target of mouse events (i.e. unclickable)
    $("#roll-it").addClass("disabled");     //make it look inactive
    $("#previous").css("pointer-events","none");
    $("#previous").addClass("disabled");
}

function enableButtons(){
    $("#roll-it").css("pointer-events","auto");    //make it clickable
    $("#roll-it").removeClass("disabled");            //make it look active
    if(rollHistory.length > 1){
    $("#previous").css("pointer-events","auto");
    $("#previous").removeClass("disabled");
    }
}

function disablePreviousButton(){
    $("#previous").css("pointer-events","none");
    $("#previous").addClass("disabled");
}

function enablePreviousButton(){
    $("#previous").css("pointer-events","auto");
    $("#previous").removeClass("disabled");
}

function disableNextButton(){
    $("#next").css("pointer-events","none");
    $("#next").addClass("disabled");
}

function enableNextButton(){
    $("#next").css("pointer-events","auto");
    $("#next").removeClass("disabled");
}
    
    