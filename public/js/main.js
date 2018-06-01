let game = new Phaser.Game(360,640, Phaser.CANVAS);


game.state.add("GameState", GameState);
game.state.start("GameState");

window.addEventListener("resize", () => {
  game.scale.refresh();
});
