let score = [501, 501, 501, 501];
let score_temp;
let player = 0;
let player_count;
let dart = [0, 0, 0];
let dart_bool = [false, false, false];
let sum = 0;
let game_sum = [0, 0, 0, 0];
let throws = [0, 0, 0, 0];
var checkout, values, special_values, activation_words, undo_words, continue_words;
let ready = true;
let mulitplier_letters = [1,1,1];
let dartadd;
let said;
let current_throw = 0;

let doc_score, doc_speech, doc_player;
let doc_darts, doc_checkouts, doc_average;

function preload(){
  values = loadJSON('json/values.json');
  multipliers = loadJSON('json/multipliers.json');
  special_values = loadJSON('json/special_Values.json');
  checkouts = loadJSON('json/checkouts.json');
  activation_words = loadJSON('json/activation_words.json');
  undo_words = loadJSON('json/undo.json');
  continue_words = loadJSON('json/continue.json');
}

function setup() {
  doc_player = document.getElementById("player");
  doc_score = document.getElementById("score");
  doc_speech = document.getElementById("speech");
  doc_darts = [document.getElementById("dart0"), document.getElementById("dart1"), document.getElementById("dart2")];
  doc_checkouts = document.getElementById("checkouts");
  doc_average = document.getElementById("average");
  doc_sum = document.getElementById("sum");

  setgameVariables();

  if(annyang){

    var commands = {};
    for(let j = 0; j <= Object.keys(activation_words).length; j++){
      commands[activation_words[j] + ' *results'] = 'wakeWordSaid';
    }

    annyang.addCallback('result', function(userSaid, commandText, phrases) {
      console.log(userSaid)
      said = "kein Kommando erkannt";
    });
  
    annyang.addCommands(commands);   
    annyang.setLanguage('de-DE')
    annyang.start({ autoRestart: true, continuous: false });
  }
  else said = "speech recognition is not supported in your browser";

}

function draw(){
  background(255,255,255);

  drawScore();
  drawThrows();
  drawCheckouts();
  drawSpeech();
  drawGameDetails();
  
  //drawInstructions();
}

var wakeWordSaid = function(result) {
  said = result;
  array = said.split(" und ");
  array = array.slice(0, 3);
  moveSelection(array);
  console.log(array)
};

function moveSelection(array){

  for(let j = 0; j < Object.keys(continue_words).length; j++){
    if(array.includes(continue_words[j])){
      resetValues();
      player++;
      if(player >= player_count)player=0;
      score_temp = score[player];
    }
  }

  for(let j = 0; j < Object.keys(undo_words).length; j++){
    if(array.includes(undo_words[j]))undo();
  }
  
  if(ready)calcPoints(array);
  
}

function calcPoints(query){
  for(let i = 0;i<query.length;i++){
    let multiplier = 1;
    
    if(dart_bool[i] == true && query.length != 3)current_throw++;
    else current_throw = i;
   
    //check special_values
    for(let j = 0; j < Object.keys(special_values).length; j++){
      if(query[i].includes(special_values[j][0])){
        dart[current_throw] = special_values[j][1];
        dart_bool[current_throw] = true;
      }
    }

    //check multiplier
    for(let j = 0; j < Object.keys(multipliers).length;j++){
      if(query[i].includes(multipliers[j][0])){
        multiplier = multipliers[j][1];
        mulitplier_letters[current_throw] = multiplier;
        query[i] = query[i].slice(multipliers[j][0].length + 1);
      }
    }

    //check values
    for(let j = 0; j < Object.keys(values).length;j++){
      if(query[i].includes(values[j][0]) && values[j][0].length == query[i].length){
        dart[current_throw] = values[j][1];
        dart_bool[current_throw] = true;
      }
    }

    if(dart_bool[current_throw]){
      sum += dart[current_throw] * multiplier; 
      score_temp -= dart[current_throw] * multiplier; 
    }
    if(!dart_bool[current_throw])current_throw--;
    console.log(dart, dart_bool, score, sum)
  }
  if((score - sum) < 0){
    undo();
    ready = false;
  }
  if(dart_bool[0] == true && dart_bool[1] == true && dart_bool[2] == true)ready=false;
}

function resetValues(){
  for(bool of dart_bool)if(bool)throws[player]++;
  game_sum[player] += sum;
  sum = 0;
  score[player] = score_temp;
  dart = [0,0,0];
  ready = true;
  mulitplier_letters = [1,1,1];
  dart_bool=[false,false,false];
  current_throw = 0;
}

function undo(){
  score_temp += sum;
  resetValues();
}

function drawScore(){
  if(ready)doc_score.style.color = "lightgreen";
  else doc_score.style.color = "red";
  doc_score.innerHTML = score_temp;
}

function drawThrows(){
  for(let i = 0;i<3;i++){
    if(mulitplier_letters[i] == 1)dartadd = '';
    if(mulitplier_letters[i] == 2)dartadd = 'D';
    if(mulitplier_letters[i] == 3)dartadd = 'T';

    if(dart_bool[i])doc_darts[i].style.color = "black";
    else doc_darts[i].style.color = "lightgray";

    doc_darts[i].innerHTML = dartadd + dart[i].toString();
  }
}

function drawCheckouts(){
  array = checkouts[score.toString()];

  if(array != undefined){
    checkout = "";
    for(value of array){
      checkout += value + " "; 
    }
    checkout = checkout.replace(",", "  ");    
  }
  else checkout = "no checkout";
  doc_checkouts.innerHTML = checkout;
  
}

function drawSpeech(){
  if(said!=undefined)doc_speech.innerHTML = said;
  if(player_count > 1)doc_player.innerHTML = player + 1;
}

function drawInstructions(){
  textSize(20);
  text('Sage "Dart, weiter" um die Eingabe zu bestätigen. \n Sage "Dart, noch mal" um die Eingabe rückgängig zu machen.', width/2, height/4 + 50);
  text('Sprich in folgendem Syntax: "Dart, Wurf 1 und Wurf 2 und Wurf 3".', width/2, 50);
}

function drawGameDetails(){
  if(throws[player]!=0)doc_average.innerHTML = parseFloat((game_sum[player] / throws[player]).toFixed(2));
  doc_sum.innerHTML = sum;
}

function setgameVariables(){
  url = new URL(window.location.href);
  player_count = url.searchParams.get("player");
  let start_score = url.searchParams.get("score");
  for(let i=0;i<player_count;i++){
      score[i] = parseInt(start_score);
    }
  score_temp = score[0];
}
