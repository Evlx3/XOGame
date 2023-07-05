const initialValue = {
  currentGameMoves: [],
  history: {
    currentRoundGame: [],
    allGames: [],
  },
};

export default class Store {
  // this to save the state on the a local variable.
  // #state = initialValue;

  constructor(key, players) {
    this.storgeKey = key;
    this.players = players;
  }

  get stats() {
    const state = this.#getState();

    // this return will be an object with just two properties.
    return {
      playerWithState: this.players.map((player) => {
        const wins = state.history.currentRoundGame.filter(
          (game) => game.status.winner?.id === player.id
        ).length;

        // this is the return of the arrow function
        return {
          ...player,
          wins,
        };
      }),

      ties: state.history.currentRoundGame.filter(
        (game) => game.status.winner === null
      ).length,
    };
  }

  get game() {
    const state = this.#getState();

    const currentPlayer = this.players[state.currentGameMoves.length % 2];

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    // the move.player.id (filter method) the id come from the currentPlayer varible because the Players is an array of two players and each player has an id property on him.

    for (let player of this.players) {
      const selectedSquareIds = state.currentGameMoves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (let pattern of winningPatterns) {
        if (pattern.every((v) => selectedSquareIds.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      moves: state.currentGameMoves,
      currentPlayer,
      status: {
        isComplete: winner !== null || state.currentGameMoves.length === 9,
        winner,
      },
    };
  }

  playerMove(squareId) {
    // a state clone so we don't mutate (change) the state directly.
    const stateClone = structuredClone(this.#getState());

    stateClone.currentGameMoves.push({
      squareId,
      player: this.game.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  resetState() {
    const stateClone = structuredClone(this.#getState());

    const { moves, status } = this.game;

    if (status.isComplete) {
      stateClone.history.currentRoundGame.push({ status, moves });
    }

    stateClone.currentGameMoves = [];

    this.#saveState(stateClone);
  }

  newRround() {
    this.resetState();

    const stateClone = structuredClone(this.#getState());
    stateClone.history.allGames.push(...stateClone.history.currentRoundGame);
    stateClone.history.currentRoundGame = [];

    this.#saveState(stateClone);
  }

  #getState() {
    const item = window.localStorage.getItem(this.storgeKey);
    // this JOSN parse method will change the item from string to an object.
    return item ? JSON.parse(item) : initialValue;
  }

  #saveState(stateOrFn) {
    const prevState = this.#getState();

    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid Parameter of state");
    }

    // to save the state to the loacl storge of the website.
    // the JSON stringify method will convert the state object to a JSON string.
    window.localStorage.setItem(this.storgeKey, JSON.stringify(newState));

    // if we wont to save the state on a local variable.
    // this.#state = newState;
  }
}
