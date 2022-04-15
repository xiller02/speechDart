let score = 501;
let score_temp = 501;
let dart = [0, 0, 0];
let dart_bool = [false, false, false];
let sum = 0;
var checkouts, values, special_values, activation_words, undo_words, continue_words;
let ready = true;
let mulitplier_letters = [1,1,1];
let dartadd;
let said;
let current_throw = 0;

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
  createCanvas(820,1180)

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
    if(array.includes(continue_words[j]))resetValues();
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
  sum = 0;
  score = score_temp;
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
  textSize(200);
  textAlign(CENTER);
  if(ready)fill(0,255,0);
  else fill(255,0,0);
  text(score_temp, width/2, height/4);
  fill(0,0,0);
}

function drawThrows(){
  for(let i = 0;i<3;i++){
    textSize(100);
    textAlign(CENTER);
    if(mulitplier_letters[i] == 1)dartadd = '';
    if(mulitplier_letters[i] == 2)dartadd = 'D';
    if(mulitplier_letters[i] == 3)dartadd = 'T';
    if(dart_bool[i])fill(0,0,0);
    else fill(200,200,200);
    text(dartadd + dart[i].toString(), width/2, height/2 -100 + i * 100);
  }
}

function drawCheckouts(){
  array = checkouts[score.toString()];

  if(array != undefined){
    let checkout = "";
    for(value of array){
      checkout += value + " "; 
    }

    checkout = checkout.replace(",", "  ");
    fill(0,0,255);
    text(checkout, width/2, height * 3/4 - 80);  
    fill(0,0,0);
  }
  
}

function drawSpeech(){
  textSize(20);
  fill(150,150,150);
  text(said, width/2, height * 1/11 ); 
  fill(0,0,0); 
}

function drawInstructions(){
  textSize(20);
  text('Sage "Dart, weiter" um die Eingabe zu bestätigen. \n Sage "Dart, noch mal" um die Eingabe rückgängig zu machen.', width/2, height/4 + 50);
  text('Sprich in folgendem Syntax: "Dart, Wurf 1 und Wurf 2 und Wurf 3".', width/2, 50);
}