let LoadState = {

  preload : function(){
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY,"monkey");
    this.logo.anchor.setTo(0.5);

    this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, "progressBar");
    this.progressBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.progressBar);

    this.load.image("background", "assets/background.png");
    this.load.image("banana", "assets/banana.png");
    this.load.image("candy", "assets/candy.png");
    this.load.image("refresh", "assets/refresh.png");
  },
  create(){
    this.game.state.start("HomeState");
  }
}
