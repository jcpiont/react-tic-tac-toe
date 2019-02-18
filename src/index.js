import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortDescending: false
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, clickedSquare: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  handleSortClick() {
    this.setState({ sortDescending: !this.state.sortDescending });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const sq_loc = this.state.history[move].clickedSquare;
      const row = Math.floor(sq_loc / 3) + 1;
      const col = (sq_loc % 3) + 1;
      const desc = move
        ? `Go to move #${move} (${row}, ${col})`
        : "Go to game start";
      const activeButton =
        this.state.stepNumber === move ? "activeButton" : null;

      return (
        <li key={move}>
          <button className={activeButton} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (history.length === 10) {
      status = "Match was a tie!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winSquares={winner}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.sortDescending ? moves.reverse() : moves}</ol>
        </div>
        <button onClick={() => this.handleSortClick()}>Sort Moves</button>
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    const winners = this.props.winSquares ? this.props.winSquares : [];
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        win={winners.includes(i)}
      />
    );
  }

  createSquares() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(i * 3 + j));
      }
      rows.push(<div className="board-row">{squares}</div>);
    }
    return rows;
  }

  render() {
    return <div>{this.createSquares()}</div>;
  }
}

function Square(props) {
  const classes = `square ${props.win ? "winner" : ""}`;
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
