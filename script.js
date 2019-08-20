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
var preRollDuration = 0;               //duration of one pre-roll in milliseconds
var finalRollDuration = 0;             //duration of the final roll in milliseconds

var rollHistory = [];                   //this is where previous rolls will be saved during execution
var rollHistoryIndex = 1;               //holds the index of the currently viewed element
var allowSound = true;
var slotMachineSound;
//var cashRegister;

$(document).ready(function(){          //when document is ready...

    loadSettings();
    $("#history-notification").hide();  //hide notification that previous rolls are being shown
    
    slotMachineSound = new Howl({
        src: ["https://dl.dropboxusercontent.com/s/cigwg9y4mcjh778/slotMachine.mp3"],
        html5: true,
        format: ["mp3", "aac"]});
    //cashRegister = new Howl({src: ["sound/cashRegister.mp3"]});
    

    $(document).keydown(function(){    //capture keydowns
        if(event.which == 74){ //j
            if(! $("#previous").hasClass("disabled")) startPrevious();
        }
    
        if(event.which == 75){ //k
            if(! $("#roll-it").hasClass("disabled")) startRoll();    //allow keyinput if button is enabled
        }
        
        if(event.which == 76){ //l
            if(! $("#next").hasClass("disabled")) startNext();
        }
        
        if(event.which == 77){ //m
            toggleSound();
        }
        
        if(event.which == 82){ //r
            reset();
        }
    });
    
    //handle dice roll
    $("#roll-it").click(function(){
        if(! $("#roll-it").hasClass("disabled")) startRoll();
    });
    
    //show previous roll
    $("#previous").click(function(){
        if(! $("#previous").hasClass("disabled")) startPrevious();
    });
    
    //show next roll
    $("#next").click(function(){
        if(! $("#next").hasClass("disabled")) startNext();
    });
    
    $("#rolling-speed").change(loadSettings);
    
    $("#mute-button").click(toggleSound);
    
    $("#show-imm").change(function(){
        $("#rolling-speed").prop("disabled");
        preRollDuration = 1;
        finalRollDuration = 1;
    });
    
    $("html.touch #keyboard-tutorial").remove();
   
});

function startRoll(){
    rollHistoryIndex = 1;       //skip last element
    if(rollHistory.length == 0){
        initializeTable("0");
    }
    disableButtons();
    slotMachineSound.play();    //even play if sound is muted (user could unmute again)
    rollIt(false);             //set click event handler, start preroll
}


function rollIt(donePreRolling){
    if(donePreRolling){
        var randInt = 0;        //closure
        
        var ID2 = setInterval(function(){   //...
            rolling_index += 1;
            var rolling_index_mod = rolling_index % 6;
            
            if(rolling_index == 1){
                randInt = Math.floor(Math.random() * 6) + 1; //pseudorandom ints between 1 and 6
                console.log("result: " + randInt);
            }
            
            if(rolling_index > randInt){
                rolling_index = 0;
                rollHistory.push(randInt%6);  //add new roll to history
                updateStatistics(randInt);
                enableButtons();             //buttons can be used again
                clearInterval(ID2);          //unregister interval loop
                slotMachineSound.stop();    //mute slotMachineSound
                return;
            }
            
            selectDice(rolling_index_mod);
            var rolling_index_decremented = rolling_index_mod - 1; 
            var deselectNum = ((rolling_index_decremented)+6)%6; //including modulos for -1
            deselectDice(deselectNum);
        }, finalRollDuration/6);
    }
    else preRoll();
}

//Roll "amountOfLoops"-times before actually choosing a dice
function preRoll(){
    
    clearDices();   //remove highlighting for all dices
    $("#history-notification").hide();  //hide notification that previous rolls are being shown
    
    
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
                if((rolling_index_mod) == 0){
                    selectDice(0);
                    deselectDice(5);
                }
                else{
                    selectDice(rolling_index_mod);
                    var rolling_index_decremented = rolling_index_mod-1;
                    var deselectNum = ((rolling_index_decremented)+6)%6;  //correctly implement mod for -1
                    deselectDice(deselectNum);
                }
            }, preRollDuration/6);
}

function startPrevious(){
    clearDices();
    enableNextButton();
    rollHistoryIndex += 1;
    updateNotification(rollHistoryIndex);
    console.log("Highlighting: " + (rollHistory[rollHistory.length-(rollHistoryIndex)]));
    highlightDice(rollHistory[rollHistory.length-(rollHistoryIndex)]);
    if((rollHistory.length-1) < (rollHistoryIndex)){    //disable button if there are no more elements
        disablePreviousButton();
    }
}

function startNext(){
    clearDices();
    enablePreviousButton();
    rollHistoryIndex -= 1;
    updateNotification(rollHistoryIndex);
    highlightDice(rollHistory[rollHistory.length-(rollHistoryIndex)]);
    if(rollHistoryIndex == 1){  //when arrived at last element
        disableNextButton();
    }
}

function selectDice(num){
    $("#dice" + num).css("color", "lime");
    // on mobile devices the dice symbols are often rendered as emojis so we
    // change the font size to make the selection visible
    $("#dice" + num).css("font-size", "7vw");
}

function highlightDice(num){
    $("#dice" + num).css("color", "yellow");
    $("#dice" + num).css("font-size", "7vw");
}

function deselectDice(num){
    $("#dice" + num).css("color", "black");
    // reset font size
    $("#dice" + num).css("font-size", "8vw");
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
        relative = (absolute/rollHistory.length).toFixed(4)*100; //convert to percentage
        $("#" + i + "-relative").text(parseFloat(relative) + "%");    //set text and remove trailing zeros
    }
}

function reset(){
    rollHistory.length = 0;     //clear rollHistory
    initializeTable("N. A.");
    clearDices();
}

function loadSettings(){
    var speedPercent = parseInt($("#rolling-speed").val());  //load select value
    preRollDuration = 600 * 100/speedPercent;       //100 % = 600ms
    finalRollDuration = preRollDuration * 1.7;      //final roll is slower than pre-roll
}

function toggleSound(){
    if(allowSound){
        $("#mute-button").attr("src", "images/not-playing.png");   //change src attribute
        slotMachineSound.volume(0);
    }
    else{
        $("#mute-button").attr("src", "images/playing.png");
        slotMachineSound.volume(1);    //unmutes because sound was previously muted
    }
        
    allowSound = !allowSound;     //toggle state
}

function updateNotification(num){
    $("#history-notification").text("Showing previous roll #" + (rollHistory.length-num+1));
    $("#history-notification").show();
}
    
    