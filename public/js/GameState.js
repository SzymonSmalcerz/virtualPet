
let GameState = {

  init : function (){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();

  },
  preload : function(){

    this.load.image("background", "assets/background.png");

    this.load.spritesheet("monkey", "assets/monkey_spritesheet.png",180,180,5);

    this.load.image("banana", "assets/banana.png");
    this.load.image("candy", "assets/candy.png");
    this.load.image("refresh", "assets/refresh.png");
  },
  create : function(){

    this.background = this.game.add.sprite(0,0,"background");
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.leaveFood, this);

    this.textStyle = {
      font : "20pt bold",
    };
    this.game.add.text(20, 20, "health", this.textStyle);
    this.game.add.text(200, 20, "fun", this.textStyle);
    this.healthText = this.game.add.text(100, 20, "100", this.textStyle);
    this.funText = this.game.add.text(250, 20, "100", this.textStyle);

    this.monkey = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,"monkey",0);
    this.monkey.anchor.setTo(0.5);
    this.monkey.inputEnabled = true;
    this.monkey.input.pixelPerfectClick = true;
    this.monkey.input.enableDrag();
    this.monkey.stats = {
      health : 100,
      fun : 100
    }
    this.monkey.animations.add("eat",[0,1,2,1,3,1,2,1,3,1,0],10,false);

    this.items = {};

    this.items.candy = this.game.add.sprite(this.game.world.centerX,640 - 70,"candy");
    this.items.candy.anchor.setTo(0.5);
    this.items.candy.values = {
      health : -10,
      fun : 10
    };
    this.items.candy.inputEnabled = true;
    this.items.candy.input.pixelPerfectClick = true;
    this.items.candy.events.onInputDown.add(this.feedAnimal, this);

    this.items.refresh = this.game.add.sprite(this.game.world.centerX + 128,640 - 70,"refresh");
    this.items.refresh.anchor.setTo(0.5);
    this.items.refresh.values = {
      fun : 5
    };
    this.items.refresh.inputEnabled = true;
    this.items.refresh.input.pixelPerfectClick = true;
    this.items.refresh.events.onInputDown.add(this.turnAround, this);

    this.items.banana = this.game.add.sprite(this.game.world.centerX - 128,640 - 70,"banana");
    this.items.banana.anchor.setTo(0.5);
    this.items.banana.values = {
      health : 10
    };
    this.items.banana.inputEnabled = true;
    this.items.banana.input.pixelPerfectClick = true;
    this.items.banana.events.onInputDown.add(this.feedAnimal, this);

    this.chosenItem = null;

    this.gameLogic = {
      blockedUI : false, // when pet is turning around
      petChasingFood : false // when pet is chasing the food
    };

    this.setTexts();
    this.reducer = this.game.time.events.loop(Phaser.Timer.SECOND*10, this.reduceStats,this);
  },
  update : function(){
    if(this.monkey.stats.health <=0 || this.monkey.stats.fun <=0){
      // console.log(this.reducer);
      // this.reducer.loop = false;
      this.monkey.frame = 4;
      this.gameLogic.blockedUI = true;
      this.game.time.events.add(2000,this.handleDeath,this);
      // this.handleDeath();
    }
  },
  feedAnimal : function(food, event) {
    if(this.gameLogic.blockedUI) return;
    this.clearSelection();
    if(this.chosenItem === food){
      this.chosenItem = null;
      return;
    };
    this.chosenItem = food;
    food.alpha = 0.4;
  },
  turnAround : function(refresh, event){
    if(this.gameLogic.blockedUI) return;
    this.gameLogic.blockedUI = true;
    this.clearSelection();
    this.chosenItem = refresh;
    refresh.alpha = 0.4;

    let rotatingPetAnimation = this.game.add.tween(this.monkey);
    rotatingPetAnimation.to({angle : "+720"}, 700);
    rotatingPetAnimation.onComplete.add(() => {
      this.gameLogic.blockedUI = false;
      this.clearSelection();
      this.monkey.stats.fun += refresh.values.fun;
      this.setTexts();
    });

    rotatingPetAnimation.start();
  },
  clearSelection(){
    let item = this.chosenItem;
    if(!item) return;
    item.alpha = 1.0;
  },
  leaveFood(sprite,event){
    if(!this.gameLogic.blockedUI && this.chosenItem && this.chosenItem !== this.items.refresh){
      this.gameLogic.blockedUI = true;
      this.clearSelection();

      let foodX = event.position.x;
      let foodY = event.position.y
      let chosenFood = this.chosenItem;
      let item = this.game.add.sprite(foodX,foodY+30,chosenFood.key);
      item.anchor.setTo(0.5);

      let rotatingPetAnimation = this.game.add.tween(this.monkey);
      rotatingPetAnimation.to({x : foodX, y : foodY}, 700);
      rotatingPetAnimation.onComplete.add(() => {
        for(let stat in chosenFood.values){
          if(chosenFood.values.hasOwnProperty(stat)){
            this.monkey.stats[stat] += chosenFood.values[stat];
          }
        };
        this.chosenItem = null;
        item.destroy();
        this.gameLogic.blockedUI = false;
        this.monkey.play("eat");
        this.setTexts();
      });

      rotatingPetAnimation.start();
    }
  },
  setTexts(){
    this.healthText.setText(this.monkey.stats.health);
    this.funText.setText(this.monkey.stats.fun);
  },
  reduceStats(){
    if(this.monkey.stats.health > 0 && this.monkey.stats.fun > 0){
      this.monkey.stats.health -= 5;
      this.monkey.stats.fun -= 5;
      this.setTexts();
    }

  },
  handleDeath(){
    this.game.state.restart();
  }
};
