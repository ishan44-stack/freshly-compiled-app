export const TILE_SIZE = 32;

// 0: Grass, 1: Road, 2: Building (solid), 3: Warehouse, 4: Store A (Cyan), 5: Store B (Orange)
const CITY_GRID = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2],
  [2,0,4,4,1,2,2,0,0,2,2,1,0,0,2,2,0,0,2,2,1,5,5,0,2],
  [2,0,4,4,1,2,2,0,0,2,2,1,0,0,2,2,0,0,2,2,1,5,5,0,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,2],
  [2,1,2,2,1,0,2,2,2,0,0,1,0,0,2,2,2,0,0,0,1,2,2,1,2],
  [2,1,2,2,1,0,2,2,2,0,0,1,0,0,2,2,2,0,0,0,1,2,2,1,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,2],
  [2,1,2,2,1,0,2,2,0,0,0,1,0,0,0,2,2,0,0,0,1,2,2,1,2],
  [2,1,2,2,1,0,2,2,0,0,0,1,0,0,0,2,2,0,0,0,1,2,2,1,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,0,0,0,1,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,1,0,0,0,2],
  [2,0,2,2,1,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,1,2,2,0,2],
  [2,0,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

export class CityMap {
  constructor() {
    this.grid = CITY_GRID;
    this.rows = CITY_GRID.length;
    this.cols = CITY_GRID[0].length;
    this.width = this.cols * TILE_SIZE;
    this.height = this.rows * TILE_SIZE;

    this.zones = {
      warehouse: { x: 10 * TILE_SIZE, y: 13 * TILE_SIZE, w: 5 * TILE_SIZE, h: 2 * TILE_SIZE },
      storeA: { id: "storeA", name: "CYAN MART", color: "#4cc9f0", x: 2 * TILE_SIZE, y: 2 * TILE_SIZE, w: 2 * TILE_SIZE, h: 2 * TILE_SIZE },
      storeB: { id: "storeB", name: "SUNSET GROCER", color: "#ff9f1c", x: 21 * TILE_SIZE, y: 2 * TILE_SIZE, w: 2 * TILE_SIZE, h: 2 * TILE_SIZE },
    };
  }

  isSolidAt(col, row) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return true;
    return this.grid[row][col] === 2;
  }

  collidesWithBuilding(x, y, radius) {
    const minCol = Math.floor((x - radius) / TILE_SIZE);
    const maxCol = Math.floor((x + radius) / TILE_SIZE);
    const minRow = Math.floor((y - radius) / TILE_SIZE);
    const maxRow = Math.floor((y + radius) / TILE_SIZE);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (this.isSolidAt(c, r)) return true;
      }
    }
    return false;
  }

  isInsideZone(x, y, zone) {
    return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
  }

  draw(ctx, activeTargetId) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = this.grid[r][c];
        const px = c * TILE_SIZE;
        const py = r * TILE_SIZE;

        if (tile === 0) {
          // Pixel grass
          ctx.fillStyle = "#2d6a4f";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = "#40916c";
          ctx.fillRect(px + 4, py + 4, 4, 4);
          ctx.fillRect(px + 20, py + 18, 4, 4);
        } else if (tile === 1) {
          // Asphalt road
          ctx.fillStyle = "#2b2d42";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = "#4a4e69";
          ctx.fillRect(px + 14, py + 14, 4, 4);
        } else if (tile === 2) {
          // Rooftop building
          ctx.fillStyle = "#3a405a";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = "#5c6784";
          ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
          ctx.fillStyle = "#24293b";
          ctx.fillRect(px + 8, py + 8, 6, 6);
          ctx.fillRect(px + 18, py + 18, 6, 6);
        } else if (tile === 3) {
          // Warehouse floor
          ctx.fillStyle = "#3d348b";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = "#ffd166";
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        } else if (tile === 4 || tile === 5) {
          const color = tile === 4 ? "#4cc9f0" : "#ff9f1c";
          ctx.fillStyle = "#1d2d44";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = color;
          ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
        }
      }
    }

    // Zone labels & pulsing target highlight
    this.drawZoneLabel(ctx, this.zones.warehouse, "WAREHOUSE (W)", "#ffd166", false);
    this.drawZoneLabel(ctx, this.zones.storeA, "STORE A", "#ffffff", activeTargetId === "storeA");
    this.drawZoneLabel(ctx, this.zones.storeB, "STORE B", "#ffffff", activeTargetId === "storeB");
  }

  drawZoneLabel(ctx, zone, text, color, isTarget) {
    if (isTarget) {
      ctx.strokeStyle = "#06d6a0";
      ctx.lineWidth = 4;
      ctx.strokeRect(zone.x - 2, zone.y - 2, zone.w + 4, zone.h + 4);
    }
    ctx.fillStyle = "#0b0d14";
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillText(text, zone.x + zone.w / 2 + 1, zone.y + zone.h / 2 + 4);
    ctx.fillStyle = color;
    ctx.fillText(text, zone.x + zone.w / 2, zone.y + zone.h / 2 + 3);
  }
}
