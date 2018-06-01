let HomeState = {
  create(){
    this.textStyle = {
      font : "20pt bold",
    };

    this.background = this.game.add.sprite(0,0,"background");
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.startGame, this);

    let tapText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "tap to start", this.textStyle);
    tapText.anchor.setTo(0.5);

  },
  startGame(){
    console.log("clicked");
    this.game.state.start("GameState");
  }
}
