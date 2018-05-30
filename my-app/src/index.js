import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}



class Board extends React.Component {


  renderSquare(i){
    return (

    <Square value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
     />
   );
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{ // A history of each move
        squares: Array(9).fill(null), // An array of squares, filled or not
      }],
      stepNumber: 0,  //To know the move number
      xIsNext: true,
      currentI: Array(0).fill(null), // So we know what the last square filled was
      color: Array(10).fill('button-regular'),
    }
  };
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1); //copies everything, up to that point in time

      const current = history[history.length - 1]; //copies the last element
      const historyCurrentI = this.state.currentI.slice(0, this.state.stepNumber); //copy everything up to that point in time

      const squares = current.squares.slice();

      if(calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{ //adds that last element to the end of the array
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        currentI: historyCurrentI.concat(i),
      });
    }

  jumpTo(step) {
    var color = Array(10).fill('button-regular'); //reset color each time back to gray
    color[step] = 'button-highlight'; //highlight selected button
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      color: color, //rerender the button selected in yellow
    });
  }

  render() {
const history = this.state.history;
const current = history[this.state.stepNumber];
const winner = calculateWinner(current.squares);


const currentI = this.state.currentI; //update current squared filled on the last move made
const color = this.state.color;
const moves = history.map((step, move) => {
const col = currentI[move -1] % 3 + 1; //calculate column
const row = (currentI[move - 1] > 2) ? //calculate row
  ((currentI[move - 1] <=5) ?
    2 : 3) :
1;

  const desc = move ?
  'Go to move #' + move + ' (' + col + ',' + row + ')' :
  'Go to game start';

return (

  <li key={move}>
    <button className= {color[move]} onClick={() => this.jumpTo(move)}>
{desc}</button>
  </li>
);
});


let status;
if(winner){
  status = 'Winner: ' + winner;
} else {
  status = 'Next player: ' + (this.state.xIsNext ?
  'X' : 'O');
}


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return squares[a];
    }
  }
  return null;
}
