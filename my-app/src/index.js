import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*Comments for Square: if winningLines is not null, then this square is one of the three squares that won the game,
then the button highlight class is passed, and the button is highlighted, else it is not
*/
function Square(props) {
  return (props.winningLines ?
    <button className="square button-highlight" onClick={props.onClick}>
      {props.value}
    </button> :
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ReverseOL(props) { // reverses numbering of the ol for the move buttons
  return(props.descending ?
    <ol> {props.moves}</ol> :
    <ol reversed> {props.moves}</ol>);

}


class Board extends React.Component {
/*Comments for renderSquare:
If there is a winner, winningLines has a value
if that square is equal to the position of the winning square,
then winningLines gets passed with a value to the corresponding square.
else winningLines[index] does not equal that square, and winningLine value passed is null.
Else else, In the case that there is not a winner and winnigLine array is null, winningLines passed is null
winningLine is passed to square in the form of a prop*/
  renderSquare(i){
    return(this.props.winningLines ?
    (this.props.winningLines[1] === i || this.props.winningLines[2] === i || this.props.winningLines[3] === i
    ?
      <Square value={this.props.squares[i]}
      winningLines = {this.props.winningLines}
      onClick={() => this.props.onClick(i)}
      /> :
        <Square value={this.props.squares[i]}
        winningLines = {null}
        onClick={() => this.props.onClick(i)}
        />)  :
      <Square value={this.props.squares[i]}
      winningLines = {null}
      onClick={() => this.props.onClick(i)}
      />)
  }
renderingSquares(){
  const squareRendering = [], //For storing an array of renderSquare() function
  list= []; // For storing an array of React div elements, with squareRendering as a component child for each element in the array
  var index = 0;

  for(let x = 0; x < 3; x++){
    for(let y = 0; y < 3; y++){
      squareRendering.push(this.renderSquare(index));
      index++;
    }
      list.push(React.createElement('div',{className: 'boardRow'},squareRendering.slice(index-3,index+1))); // slicing specifies the # of squares = 3 for each row
  }


  return(list); //returns the array of React elements
}


  render() {

    return (
      <div>

        {this.renderingSquares()}
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
      descending: true,
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

handleClickMoves(){
  let descending = this.state.descending;

  this.setState({
    descending: !descending,
  });
}


  render() {
const history = this.state.history;
const current = history[this.state.stepNumber];
const winner = calculateWinner(current.squares);
const descending = this.state.descending;

const currentI = this.state.currentI; //update current squared filled on the last move made
const color = this.state.color;
let moves = history.map((step, move) => {
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
moves = descending ? moves : moves.reverse(); //If descending is false, it must be ascending. Then moves is reversed to ascending.
let status;
if(winner){
  status = 'Winner: ' + winner[0];

} else {
  status = 'Next player: ' + (this.state.xIsNext ?
  'X' : 'O');
}


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            winningLines = {winner}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br/>
          <button onClick={() => this.handleClickMoves()}>
            Reverse </button>
          <ReverseOL    //pass to functional component, to see if ol numbering needs to be reversed
            moves = {moves}
            descending = {descending}
          />
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
      const winningLines = [squares[a],a,b,c];
      return winningLines;
    }
  }
  return null;
}
