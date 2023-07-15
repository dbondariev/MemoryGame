class MatchGrid {
  constructor(args) {
    this.width = args.width || 4;
    this.height = args.height || 4;
    this.cols = args.cols || 4;
    this.rows = args.rows || 4;
    this.timeLimit = args.timeLimit || 60;
    this.theme = args.theme || {};
    this.timerId = null;
    this.flippedCards = [];
    this.score = 0;
    this.startTime = null;
    this.remainingTime = this.timeLimit;
    this.moves = 0;

    this.grid = document.getElementById("grid");
    this.timer = document.getElementById("timer");
    this.resetButton = document.getElementById("reset-button");
    this.scoreText = document.getElementById("score-text");
    this.restartButton = document.getElementById("restart-button");

    this.startButton = document.getElementById("start-button");
    this.startButton.addEventListener("click", () => this.startGame());

    this.resetButton.addEventListener("click", () => this.resetGame());

    this.restartButton.addEventListener("click", () => this.restartGame());

    this.grid.addEventListener("mouseout", () => this.pauseGame());
    this.grid.addEventListener("mouseover", () => this.resumeGame());

    this.createGrid();
  }

  createGrid() {
    this.grid.style.setProperty("--cols", this.cols);
    this.grid.style.setProperty("--rows", this.rows);

    const cardValues = this.generateCardValues();

    for (let i = 0; i < this.cols * this.rows; i++) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.number = cardValues[i];
      card.textContent = "?";
      card.addEventListener("click", () => this.flipCard(card));
      this.grid.appendChild(card);
    }
  }

  generateCardValues() {
    const totalCards = this.cols * this.rows;
    const uniqueValues = totalCards / 2;

    const values = [];
    for (let i = 1; i <= uniqueValues; i++) {
      values.push(i, i);
    }

    return this.shuffleArray(values);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  flipCard(card) {
    if (
      card.classList.contains("flipped") ||
      card.classList.contains("matched") ||
      this.flippedCards.length === 2
    )
      return;

    card.classList.add("flipping");
    setTimeout(() => {
      card.classList.remove("flipping");
      card.classList.add("flipped");
      card.textContent = card.dataset.number;
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        const [card1, card2] = this.flippedCards;
        const number1 = card1.dataset.number;
        const number2 = card2.dataset.number;

        if (number1 !== number2) {
          setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.textContent = "?";
            card2.textContent = "?";
            this.flippedCards = [];
            this.moves++;
            this.updatedScore();
          }, 1000);
        } else {
          card1.classList.add("matched");
          card2.classList.add("matched");
          this.flippedCards = [];
          this.score += 2;
          if (this.score === this.cols * this.rows) {
            this.endGame();
          }
        }
      }
    }, 200);
  }

  getCardNumber(card) {
    return card.dataset.number;
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 10);
  }

  updatedScore() {
    this.scoreText.textContent = `Moves: ${this.moves}`;
  }

  startGame() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    if (!this.timerId) {
      this.startTime = new Date().getTime();
      this.timerId = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
        this.remainingTime = this.timeLimit - elapsedTime;

        if (this.remainingTime >= 0) {
          this.timer.textContent = this.remainingTime;
        } else {
          this.endGame();
        }
      }, 1000);
    }
  }

  pauseGame() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  resumeGame() {
    if (!this.timerId) {
      this.startTime =
        new Date().getTime() - (this.timeLimit - this.remainingTime) * 1000;
      this.timerId = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
        this.remainingTime = this.timeLimit - elapsedTime;

        if (this.remainingTime >= 0) {
          this.timer.textContent = this.remainingTime;
        } else {
          this.endGame();
        }
      }, 1000);
    }
  }

  resetGame() {
    this.grid.innerHTML = "";
    this.createGrid();
    this.flippedCards = [];
    this.score = 0;
    this.startTime = null;
    this.timer.textContent = this.timeLimit;
    this.moves = 0;
    this.updatedScore();
    clearInterval(this.timerId);
  }

  restartGame() {
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    this.resetGame();
    this.startGame();
    this.moves = 0;
    this.updatedScore();
  }

  endGame() {
    clearInterval(this.timerId);
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
    this.scoreText.textContent = `Score: ${this.score}`;
  }
}

new MatchGrid({
  width: 400,
  height: 400,
  cols: 4,
  rows: 4,
  timeLimit: 60,
  theme: {},
});
