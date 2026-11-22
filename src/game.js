import { CityMap } from "./map.js";
import { Drone } from "./drone.js";
import { Controls } from "./controls.js";
import { CargoManager } from "./cargo.js";

export class Game {
  constructor(canvas, uiCallbacks) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ui = uiCallbacks;

    this.map = new CityMap();
    this.drone = new Drone(400, 400);
    this.controls = new Controls();
    this.cargo = new CargoManager(this.map);

    this.state = "READY"; // READY | PLAYING | VICTORY | GAMEOVER
    this.score = 0;
    this.deliveries = 0;
    this.targetDeliveries = 5;
    this.timeLeft = 60;
    this.lastTimestamp = 0;

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  start() {
    this.score = 0;
    this.deliveries = 0;
    this.timeLeft = 60;
    this.drone.reset();
    this.cargo.spawnPackage();
    this.state = "PLAYING";

    this.ui.hideOverlay();
    this.ui.setBanner("FLY TO WAREHOUSE & PRESS SPACE TO PICK UP");
    this.ui.updateHUD(this.score, this.deliveries, this.targetDeliveries, this.timeLeft);
  }

  update(dt) {
    if (this.state !== "PLAYING") return;

    // Timer countdown
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) {
      this.state = "GAMEOVER";
      this.ui.showEndScreen(false, this.score, this.deliveries, this.targetDeliveries);
      return;
    }

    // Drone movement
    const input = this.controls.getMovementVector();
    this.drone.update(dt, input, this.map);

    // Pickup / Drop action
    if (this.controls.consumeAction()) {
      if (!this.drone.cargo) {
        const picked = this.cargo.tryPickup(this.drone);
        if (picked) {
          this.ui.setBanner(`DELIVER TO ${picked.targetName} & PRESS SPACE`);
        }
      } else {
        const result = this.cargo.tryDrop(this.drone);
        if (result.delivered) {
          this.deliveries += 1;
          this.score += result.points;
          if (this.deliveries >= this.targetDeliveries) {
            const timeBonus = Math.ceil(this.timeLeft) * 10;
            this.score += timeBonus;
            this.state = "VICTORY";
            this.ui.updateHUD(this.score, this.deliveries, this.targetDeliveries, this.timeLeft);
            this.ui.showEndScreen(true, this.score, this.deliveries, this.targetDeliveries, timeBonus);
            return;
          }
          this.ui.setBanner("DELIVERED! +100 PTS — RETURN TO WAREHOUSE");
        } else if (result.wrongStore) {
          this.ui.setBanner(`WRONG STORE! DELIVER TO ${this.drone.cargo.targetName}`);
        }
      }
    }

    this.ui.updateHUD(this.score, this.deliveries, this.targetDeliveries, this.timeLeft);
  }

  render() {
    const activeTargetId = this.drone.cargo ? this.drone.cargo.targetId : null;
    this.map.draw(this.ctx, activeTargetId);
    this.cargo.draw(this.ctx);
    this.drone.draw(this.ctx);
  }

  loop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000 || 0);
    this.lastTimestamp = timestamp;

    this.update(dt);
    this.render();
    requestAnimationFrame(this.loop);
  }
}
