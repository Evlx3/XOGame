import View from "./view.js";
import Store from "./store.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "orange",
  },
];

function init() {
  const view = new View();
  const store = new Store("live-storge", players);

  function initView() {
    view.closeAll();
    view.setTurnIndicator(store.game.currentPlayer);
    view.setScoreboard(
      store.stats.playerWithState[0].wins,
      store.stats.playerWithState[1].wins,
      store.stats.ties
    );
    view.initializeMoves(store.game.moves);
  }

  // this is an event we listen to when another tab changes state.
  window.addEventListener("storage", () => {
    // console.log("the state changed from another tab");
    // to create all the moves and initialize the scoreboard.
    initView();
    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} Wins!`
          : "Tie!"
      );
      return;
    }
  });

  // for when the page loads we change the score board because if we don't call this method when we load the page the score Board will reset to zero.
  initView();

  view.bindGameResetEvent((event) => {
    store.resetState();
    initView();
  });

  view.bindNewRoundEvent((event) => {
    store.newRround();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    // if there is an existing move in the moves array, we don't add a new move.
    if (existingMove) {
      return;
    }

    // this will add an icon acording to the current player
    view.handelPlayerMoves(square, store.game.currentPlayer);

    // this step will add a new move the to array of moves
    store.playerMove(+square.id);

    // to check if there is a winenr in the game and open the modal.
    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} Wins!`
          : "Tie!"
      );
      return;
    }

    // this will handel the next turn indicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
