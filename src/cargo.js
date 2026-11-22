export class CargoManager {
  constructor(map) {
    this.map = map;
    this.availablePackage = null;
    this.spawnPackage();
  }

  spawnPackage() {
    const targets = [this.map.zones.storeA, this.map.zones.storeB];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const wh = this.map.zones.warehouse;

    this.availablePackage = {
      x: wh.x + 28 + Math.random() * (wh.w - 56),
      y: wh.y + 18 + Math.random() * (wh.h - 36),
      targetId: target.id,
      targetName: target.name,
      color: target.color,
      points: 100,
    };
  }

  tryPickup(drone) {
    if (drone.cargo || !this.availablePackage) return null;
    const dx = drone.x - this.availablePackage.x;
    const dy = drone.y - this.availablePackage.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= 30) {
      drone.cargo = this.availablePackage;
      this.availablePackage = null;
      return drone.cargo;
    }
    return null;
  }

  tryDrop(drone) {
    if (!drone.cargo) return { delivered: false, wrongStore: false };

    const targetZone = this.map.zones[drone.cargo.targetId];
    if (this.map.isInsideZone(drone.x, drone.y, targetZone)) {
      const points = drone.cargo.points;
      drone.cargo = null;
      this.spawnPackage();
      return { delivered: true, points, wrongStore: false };
    }

    // Check if player tried dropping at the wrong store
    const otherId = drone.cargo.targetId === "storeA" ? "storeB" : "storeA";
    if (this.map.isInsideZone(drone.x, drone.y, this.map.zones[otherId])) {
      return { delivered: false, wrongStore: true };
    }

    return { delivered: false, wrongStore: false };
  }

  draw(ctx) {
    if (!this.availablePackage) return;
    const p = this.availablePackage;
    const x = Math.round(p.x);
    const y = Math.round(p.y);

    // Crate body
    ctx.fillStyle = p.color;
    ctx.fillRect(x - 9, y - 9, 18, 18);
    ctx.strokeStyle = "#0b0d14";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 9, y - 9, 18, 18);

    // Tape stripe
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 2, y - 9, 4, 18);
  }
}
