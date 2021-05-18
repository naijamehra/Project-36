//Create variables here
var dog, happyDog, database, foodS, foodStock; 
var frameCountNow = 0;
var feed, addFood, feedDog, addFoods;
var fedTime, lastFed, currentTime;
var foodObj;
var gameState = "hungry";
var gameStateRef;
var bedroomIMG, gradenIMG, washroomIMG, sleepIMG, runIMG, hungryDog, happyDog;
var input, button;

function preload()
{
  //load images here
  hungryDog = loadImage("images/doglmg.png");
  happyDog = loadImage("images/doglm1.png");
  bedroomIMG = loadImage("images/Bed Room.png");
  gradenIMG = loadImage("images/Garden.png");
  washroomIMG = loadImage("images/Wash Room.png");
  sleepIMG = loadImage("images/Lazy.png");
  runIMG = loadImage("images/running.png");
}

function setup() {
	createCanvas(500, 500);
  database = firebase.database();

  /*dog = addImage(Dog);
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);*/

  foodObj= new Food();

  dog = createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry", hungryDog);
  dog.addAnimation("happy", happyDog);
  dog.addAnimation("sleeping", sleepIMG);
  dog.addAnimation("run", runIMG);
  dog.scale=0.3;

  getGameState();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  input = createInput("Pet name");
  input.position(700,120);

  button = createButton("Confirm");
  button.position(800,145);
  button.mousePressed(createName);
}


function draw() {  
  background(46,139,87);

  /*if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(Dog1);
  }*/

  currentTime = hour();
  if(currentTime ===lastFed+1){
    gameState = "playing";
    updateGameState();
    foodObj.garden();
  }
  else if(currentTime === lastFed+2){
    gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime > lastFed+2 && currentTime <= lastFed+4){
    gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }
  else {
    gameState = "hungry";
    updateGameState();
    foodObj.display();
  }

  foodObj.getFoodStock();
  getGameState();

  fedTime=database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  })

  if(gameState!="hungry"){
    feed.show();
    addFood.show();
    dog.addAnimation("hungry", hungryDog);
  }
  else{
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  
  drawSprites();
  //add styles here
}

fill(225,225,254);
textSize(20);
if(lastFed>=12){
  text("Last Feed:" + lastFed%12 + " PM", 350,30);
}
else if(lastFed==0){
  text("Last Feed: 12 AM", 350,30);
}
else{
  text("Last Feed:", +lastFed+ " AM", 350,30)
}



display();{
  var x=80,y=100;
  imageMode(CENTER);
  image(this.image,720,220,70,70);

  if(this.foodStock!=0){
    for(var i=0;i<this.foodStock;i++){
      if(i%10==0){
        x=80;
        y=y+50;
      }
      image(this.image,x,y,50,50);
      x=x+30;
    }
  }
}

Text("foodStock:", 200, 200);

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if (x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  foodObj.deductFood();
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  dog.addImage(happyDog);
  gameStae="happy";
  updateGameState();  
}

function addFoods(){
  foodObj.addFood();
  foodObj.updateFoodStock();
}



/*database.ref('/').update({
      Food:foodObj.getFoodStock()
      feedTime:hour()
    })*/