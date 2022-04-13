let score = 501;
let dart = [0, 0, 0];
let sum = 0;
var checkouts, values, special_Values, activation_words;
let ready = true;
let mulitplier_letters = [1,1,1];
let dartadd;
let said;



window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
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

  recognition.continious = false;
  recognition.interimResults = false;
  recognition.lang = 'de-de';
  recognition.start();

}

function draw(){
  background(255,255,255);
  drawScore();
}

recognition.addEventListener('result', event => {
  transcript = event.results[0][0].transcript;
  // check if the voice input has ended
  console.log(transcript);
  if(event.results[0].isFinal) {
    for(let j = 0; j <= Object.keys(activation_words).length; j++){
      if(transcript.includes(activation_words[j])){
        said = transcript.replace(activation_words[j] + " ", "");
        array = said.split(" und ");
        option(array);
      }
    }
  }
});

recognition.addEventListener('end', event => {
  recognition.start();
});

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

  fill(0,0,255);
  text(checkouts[score.toString()], width/2, height * 3/4 - 80);  
  fill(0,0,0);

  textSize(20);
  text(said, width/2, height * 3/4 );  
}

function option(array){

  if(array.includes('weiter')){
    sum = 0;
    dart = [0,0,0];
    ready = true;
    mulitplier_letters = [1,1,1];
  }
  else if(array.includes('rückgängig') || array.includes('noch mal') || array.includes('zurück')){
    undo();
  }
  else{
    if(array.length == 3 && ready){
      points(array);
      ready = false;
    }
  }  
}

function points(query){
  
  console.log(query)
  for(let i = 0;i<3;i++){
    let multiplier = 1;

    //check special_values
    for(let j = 0; j < Object.keys(special_values).length; j++){
      if(query[i].includes(special_values[j][0])){
        dart[i] = special_values[j][1];
      }
    }

    //check multiplier
    for(let j = 0; j < Object.keys(multipliers).length;j++){
      if(query[i].includes(multipliers[j][0])){
        multiplier = multipliers[j][1];
        mulitplier_letters[i] = multiplier;
      }
    }

    //check values
    for(let j = 0; j < Object.keys(values).length;j++){
      if(query[i].includes(values[j][0])){
        dart[i] = values[j][1];
      }
    }
    
    console.log(multiplier, dart[i]);
    sum += dart[i] * multiplier;
  }
  score -= sum;
  if(score <= 1)undo();
}

function undo(){
  score += sum;
  sum = 0;
  dart = [0,0,0];
  ready = true;
  mulitplier_letters = [1,1,1];
}