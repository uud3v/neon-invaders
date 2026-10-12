export class GameState {
  enter(/* game, previousState, ...args */) {}
  update(/* game, dt */) {}
  draw(/* game, ctx, alpha */) {}
  handleCommand(/* game, command, keyCode */) {
    return false;
  }
  exit(/* game */) {}
}

