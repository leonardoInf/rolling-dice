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

    $(document).keydown(function(){    //capture keydowns
        if(event.which == 74){ //j
            if(! $("#previous").hasClass("disabled")) startPrevious();
        }
    
        if(event.which == 75){ //k
            if(! $("#roll-it").hasClass("disabled")) startRoll();    //allow keyinput if button is enabled
        }
        
        if(event.which == 76){ //l
            if(! $("#next").hasClass("disabled")){ startNext();}
        }
        
        if(event.which == 82){ //r
            reset();
        }
    });
    
    //handle dice roll
    $("#roll-it").click(function(){
        startRoll();
    });
    
    //show previous roll
    $("#previous").click(function(){
        startPrevious();
    });
    
    $("#next").click(function(){
       startNext(); 
    });
   
});

function rollIt(donePreRolling){
    if(donePreRolling){
        var randInt = 0;        //closure
        
        var ID2 = setInterval(function(){   //...
            rolling_index += 1;
            var rolling_index_mod = rolling_index % 6;
            
            if(rolling_index == 1){
                randInt = Math.floor(Math.random() * 6) + 1; //pseudorandom ints between 1 and 6
                console.log("randInt: " + (randInt%6));
            }
            
            if(rolling_index > randInt){
                rolling_index = 0;
                rollHistory.push(randInt%6);  //add new roll to history
                updateStatistics(randInt);
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
    var ID =  setInterval(function(){  //every 500ms... (this is an example of a closure btw)
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
                    $("#dice0").css("color", "lime");
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

function startRoll(){
    rollHistoryIndex = 1;       //skip last element
    if(rollHistory.length == 0){
        initializeTable("0");
    }
    disableButtons();
    rollIt(false);             //set click event handler, start preroll
}

function startPrevious(){
    clearDices();
    enableNextButton();
    rollHistoryIndex += 1;
    highlightDice(rollHistory[rollHistory.length-(rollHistoryIndex)]);
    if((rollHistory.length-1) < rollHistoryIndex+1){    //disable button if there are no more elements
        disablePreviousButton();
    }
    console.log("Looking at: " + rollHistory[rollHistory.length-(rollHistoryIndex)]);
}

function startNext(){
    clearDices();
    enablePreviousButton();
    rollHistoryIndex -= 1;
    highlightDice(rollHistory[rollHistory.length-(rollHistoryIndex)]);
    if(rollHistoryIndex == 1){  //when arrived at last element
        disableNextButton();
    }
}

function selectDice(num){
    $("#dice" + num).css("color", "lime");
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
    $("#roll-it").removeClass("disabled");         //make it look active
    if(rollHistory.length > 1){
        enablePreviousButton();
    }
}

function disablePreviousButton(){
    $("#previous").css("pointer-events","none");
    $("#previous").addClass("disabled");
    console.log("deactivated previous");
}

function enablePreviousButton(){
    $("#previous").css("pointer-events","auto");
    $("#previous").removeClass("disabled");
    console.log("activated previous");
}

function disableNextButton(){
    $("#next").css("pointer-events","none");
    $("#next").addClass("disabled");
}

function enableNextButton(){
    $("#next").css("pointer-events","auto");
    $("#next").removeClass("disabled");
}

function initializeTable(initText){
    for(var i=1; i<=6; i++){
            $("#" + i + "-absolute").text(initText);
            $("#" + i + "-relative").text(initText);
    }
}

function updateStatistics(result){
    var updateText = (parseInt($("#" + result + "-absolute").text())+1).toString();
    $("#" + result + "-absolute").text(updateText);
    
    for(var i=1; i<=6; i++){
        var absolute = parseInt($("#" + i + "-absolute").text());
        var relative = 0;
        var digits = 4;
        relative = (absolute/rollHistory.length).toFixed(4);
        $("#" + i + "-relative").text(parseFloat(relative));    //remove trailing zeros
    }
}

function reset(){
    rollHistory.length = 0;     //clear rollHistory
    initializeTable("N. A.");
    clearDices();
}
    
    