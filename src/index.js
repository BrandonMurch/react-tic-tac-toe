// modified from https://reactjs.org/tutorial/tutorial.html
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function SortToggle(props) {
    return (
        <button
        key = {props.key}
        className="sortToggle"
        onClick={ props.onClick }>
            Toggle Sort
        </button>
    );
}

function Square(props) {
  return (
    <button className={"square " + props.isWinner}
      onClick={ props.onClick }>
      {props.value}
    </button>
  );

}

class Board extends React.Component {
    renderSquare(i) {
        var isWinner = (this.props.winners
            && this.props.winners.includes(i)) ? "winner" : "";
        return ( <Square
            value={this.props.squares[i]}
            onClick = {() => this.props.onClick(i)}
            key = {i}
            isWinner={isWinner}
            />
        );
    }

  render() {
      var html = [];
      for (let i = 0; i < 9; i += 3) {
          var squares = [];
          for (let j = i; j < i+3; j++) {
              squares.push(this.renderSquare(j));
          }
          html.push(<div className="board-row" key={i}>{squares}</div>);
      };
    return <div>{html}</div>;
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                history: [{
                    squares: Array(9).fill(null),
                    location: "",
                }],
                ascending: true,
                xIsNext: true,
                stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const col = Math.floor(i/3) + 1;
        const row = i % 3 + 1;
        this.setState({
            history: history.concat([{
                squares:squares,
                location: col + ", " + row,
            }]),
            ascending: this.state.ascending,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderToggle() {
        return ( <SortToggle
             onClick = {() => {
                 return this.setState({ascending: !this.state.ascending});
             }}
            />
        );
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    isDraw() {
        return this.state.stepNumber === 9 ? true : false;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winners = calculateWinner(current.squares);
        const draw = this.isDraw();

        const preSortMoves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move + " (" + step.location + ")" :
            'Go to game start';
            const bold = move === this.state.stepNumber ?
                <b>{desc}</b> : desc;
            return (
                <li key={move}>
                    <button onClick= {() => this.jumpTo(move)}>
                        {bold}
                    </button>
                </li>
            );
        });

        const moves = this.state.ascending ? preSortMoves : preSortMoves.reverse();

        let status;
        if (winners) {
            status = 'Winner: ' + current.squares[winners[0]];
        } else if (draw) {
            status = "It's a draw!"
        }else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                winners={winners}
                onClick = {(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <div>{this.renderToggle()}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        );
    }
}

// ========================================

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
