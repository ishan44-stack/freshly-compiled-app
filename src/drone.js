export class Drone {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.radius = 11;
    this.speed = 210; // pixels per second
    this.reset();
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.vy = 0;
    this.propAngle = 0;
    this.cargo = null;
  }

  update(dt, input, map) {
    const accel = 14;
    const targetVx = input.x * this.speed;
    const targetVy = input.y * this.speed;

    // Smooth acceleration & deceleration
    this.vx += (targetVx - this.vx) * Math.min(1, accel * dt);
    this.vy += (targetVy - this.vy) * Math.min(1, accel * dt);

    // Move X and resolve building collisions
    const nextX = this.x + this.vx * dt;
    if (!map.collidesWithBuilding(nextX, this.y, this.radius)) {
      this.x = nextX;
    } else {
      this.vx = 0;
    }

    // Move Y and resolve building collisions
    const nextY = this.y + this.vy * dt;
    if (!map.collidesWithBuilding(this.x, nextY, this.radius)) {
      this.y = nextY;
    } else {
      this.vy = 0;
    }

    // Spin propellers continuously
    this.propAngle += dt * 28;
  }

  draw(ctx) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);

    // Drop shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(x - 10, y + 6, 20, 8);

    // Attached cargo (rendered under drone arms)
    if (this.cargo) {
      ctx.fillStyle = this.cargo.color;
      ctx.fillRect(x - 7, y + 4, 14, 10);
      ctx.strokeStyle = "#0b0d14";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 7, y + 4, 14, 10);
    }

    // Drone arms (X frame)
    ctx.fillStyle = "#8d99ae";
    ctx.fillRect(x - 11, y - 2, 22, 4);
    ctx.fillRect(x - 2, y - 11, 4, 22);

    // Drone chassis
    ctx.fillStyle = "#ef476f";
    ctx.fillRect(x - 6, y - 6, 12, 12);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 2, y - 2, 4, 4);

    // Animated pixel propellers at 4 corners
    const offsets = [
      [-10, -10],
      [10, -10],
      [-10, 10],
      [10, 10],
    ];
    const horizontal = Math.floor(this.propAngle) % 2 === 0;
    ctx.fillStyle = "#ffd166";
    for (const [ox, oy] of offsets) {
      if (horizontal) {
        ctx.fillRect(x + ox - 5, y + oy - 1, 10, 2);
      } else {
        ctx.fillRect(x + ox - 1, y + oy - 5, 2, 10);
      }
    }
  }
}
