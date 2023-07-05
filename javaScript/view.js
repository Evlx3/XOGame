export default class View {
  $ = {};
  $$ = {};

  constructor() {
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalMessage = this.#qs('[data-id="modal-message"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.p1Score = this.#qs('[data-id="p1-score"]');
    this.$.p2Score = this.#qs('[data-id="p2-score"]');
    this.$.tiesScore = this.#qs('[data-id="ties-score"]');

    this.$$.squares = this.#qsAll('[data-id="squares"]');

    // || UI only event listener

    // dropdown menu items
    this.$.menuBtn.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");

    const icon = this.#qs("i", this.$.menuBtn);
    icon.classList.toggle("fa-angle-down");
    icon.classList.toggle("fa-angle-up");
  }

  // player 1 || 2
  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-regular", player.iconClass, player.colorClass);

    label.classList.add(player.colorClass);
    label.textContent = `${player.name}, you're up`;

    this.$.turn.replaceChildren(icon, label);
  }

  handelPlayerMoves(squareEl, player) {
    const icon = document.createElement("i");

    icon.classList.add("fa-regular", player.iconClass, player.colorClass);

    squareEl.replaceChildren(icon);
  }

  initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMoves = moves.find((move) => move.squareId === +square.id);
      if (existingMoves) {
        this.handelPlayerMoves(square, existingMoves.player);
      }
    });
  }

  openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalMessage.textContent = message;
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menuBtn.classList.remove("border");

    const icon = this.#qs("i", this.$.menuBtn);
    icon.classList.toggle("fa-angle-up");
    icon.classList.toggle("fa-angle-down");
  }

  closeAll() {
    this.#closeModal();
    this.#clearMoves();
    this.#closeMenu();
  }

  // || Scoreboard
  setScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Score.textContent = `${p1Wins} Wins`;
    this.$.p2Score.textContent = `${p2Wins} Wins`;
    this.$.tiesScore.textContent = `${ties}`;
  }

  // || Handles UI events

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  // || Dom Helper Methods

  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("could not find element");

    return el;
  }

  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("could not find element");

    return elList;
  }
}
