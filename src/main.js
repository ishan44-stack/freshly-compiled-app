import { Game } from "./game.js";

const canvas = document.getElementById("game-canvas");
const scoreEl = document.getElementById("hud-score");
const deliveriesEl = document.getElementById("hud-deliveries");
const timerEl = document.getElementById("hud-timer");
const bannerEl = document.getElementById("status-banner");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlaySubtitle = document.getElementById("overlay-subtitle");
const overlayDetails = document.getElementById("overlay-details");
const overlayBtn = document.getElementById("overlay-btn");

const game = new Game(canvas, {
  updateHUD(score, deliveries, target, timeLeft) {
    scoreEl.textContent = score;
    deliveriesEl.textContent = `${deliveries} / ${target}`;
    timerEl.textContent = `${Math.ceil(timeLeft)}s`;
  },
  setBanner(text) {
    bannerEl.textContent = text;
  },
  hideOverlay() {
    overlay.classList.add("hidden");
  },
  showEndScreen(isVictory, score, deliveries, target, timeBonus = 0) {
    overlayTitle.textContent = isVictory ? "SHIFT COMPLETE!" : "TIME'S UP!";
    overlayTitle.style.color = isVictory ? "#06d6a0" : "#ef476f";
    overlaySubtitle.textContent = isVictory
      ? `TIME BONUS: +${timeBonus} PTS`
      : "BETTER LUCK NEXT SHIFT";
    overlayDetails.innerHTML = `
      <p>FINAL SCORE: <strong>${score}</strong></p>
      <p>DELIVERIES: <strong>${deliveries} / ${target}</strong></p>
    `;
    overlayBtn.textContent = "PLAY AGAIN";
    overlay.classList.remove("hidden");
  },
});

overlayBtn.addEventListener("click", () => game.start());
