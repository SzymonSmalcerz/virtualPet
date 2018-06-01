let PreState = {
  init : function (){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();

  },
  preload(){
    this.load.image("progressBar","assets/progresBar.png");
    this.load.spritesheet("monkey", "assets/monkey_spritesheet.png",180,180,5);
  },
  create(){
    this.game.stage.backgroundColor = "#fff";
    this.game.state.start("LoadState");
  }
}
