let score = 501;
let dart = [0, 0, 0];
let dart_bool = [false, false, false];
let sum = 0;
var checkouts, values, special_Values, activation_words;
let ready = true;
let mulitplier_letters = [1,1,1];
let dartadd;
let said;
let current_throw = 0;
var transcript;

function preload(){
  values = loadJSON('json/values.json');
  multipliers = loadJSON('json/multipliers.json');
  special_values = loadJSON('json/special_Values.json');

  checkouts = loadJSON('json/checkouts.json');

  activation_words = loadJSON('json/activation_words.json');
}

function setup() {
  createCanvas(820,1180)

  if (annyang) {

    var commands = {};
    for(let j = 0; j <= Object.keys(activation_words).length; j++){
      commands[activation_words[j] + ' *results'] = 'wake';
    }
  
    annyang.addCommands(commands);   
    annyang.setLanguage('de-DE')
    annyang.start({ autoRestart: true, continuous: true });

  } 

}

function draw(){
  background(255,255,255);
  drawScore();
}

var wake = function(result) {
  said = result;
  array = said.split(" und ");
  array = array.slice(0, 3);
  option(array);
  console.log(array)
};


function drawScore(){
  textSize(200);
  textAlign(CENTER);
  if(ready)fill(0,255,0);
  else fill(255,0,0);
  text(score, width/2, height/4);

  fill(0,0,0);
  textSize(20);
  text('Sage "Dart, weiter" um die Eingabe zu bestätigen. \n Sage "Dart, noch mal" um die Eingabe rückgängig zu machen.', width/2, height/4 + 50);
  text('Sprich in folgendem Syntax: "Dart, Wurf 1 und Wurf 2 und Wurf 3".', width/2, 50);

  for(let i = 0;i<3;i++){
    textSize(100);
    textAlign(CENTER);
    if(mulitplier_letters[i] == 1)dartadd = '';
    if(mulitplier_letters[i] == 2)dartadd = 'D';
    if(mulitplier_letters[i] == 3)dartadd = 'T';
    text(dartadd + dart[i].toString(), width/2, height/2 -100 + i * 100);
  }

  drawCheckouts();

  textSize(20);
  fill(105,105,105);
  text(said, width/2, height * 1/11 ); 
  fill(0,0,0); 
}

function option(array){

  if(array.includes('weiter')){
    sum = 0;
    dart = [0,0,0];
    ready = true;
    mulitplier_letters = [1,1,1];
    current_throw = 0;
    dart_bool=[false,false,false];
  }
  else if(array.includes('rückgängig') || array.includes('noch mal') || array.includes('zurück')){
    undo();
  }
  else{
    if(ready){
      points(array);
    }
  }  
}

function points(query){
  
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
      }
    }

    //check values
    for(let j = 0; j < Object.keys(values).length;j++){
      if(query[i].includes(values[j][0])){
        dart[current_throw] = values[j][1];
        dart_bool[current_throw] = true;
      }
    }
    sum += dart[current_throw] * multiplier;
  }
  if(dart_bool[0] == true && dart_bool[1] == true && dart_bool[2] == true){
    ready=false;
    score -= sum;
    if(score <= 1)undo();
  }
}

function undo(){
  score += sum;
  sum = 0;
  dart = [0,0,0];
  ready = true;
  mulitplier_letters = [1,1,1];
  dart_bool=[false,false,false];
  current_throw = 0;
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