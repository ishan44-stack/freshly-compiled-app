export class Controls {
  constructor() {
    this.keys = new Set();
    this.actionPressed = false;

    window.addEventListener("keydown", (e) => {
      const code = e.code;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(code)) {
        e.preventDefault();
      }
      if (code === "Space" && !this.keys.has("Space")) {
        this.actionPressed = true;
      }
      this.keys.add(code);
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.code);
    });
  }

  getMovementVector() {
    let x = 0;
    let y = 0;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) y -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) y += 1;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) x -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) x += 1;

    // Normalize diagonal movement so diagonal flight isn't faster
    if (x !== 0 && y !== 0) {
      const inv = 1 / Math.SQRT2;
      x *= inv;
      y *= inv;
    }
    return { x, y };
  }

  consumeAction() {
    if (this.actionPressed) {
      this.actionPressed = false;
      return true;
    }
    return false;
  }
}
