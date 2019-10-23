import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button 
            className={"square " + (props.isWinning ? "square--winning" : null)} 
            onClick={props.onClick}
        >
            {props.value}
        </button>
      );
    }
  
  class Board extends React.Component {    
    renderSquare(i) {
      return (
      <Square 
        isWinning={this.props.winningSquares.includes(i)}
        key={"square " + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
      );
    }
    renderSquares() {
      let row = [];
      let k =0;
      for(let i = 0; i < 3; i++) {
        const col = [];
        for(let j = 0; j < 3; j++) {
          col.push(this.renderSquare(3*i+j));
          k++;
        }
        row.push(<div key={k} className="board-row">{col}</div>);
      }
      return(<div>{row}</div>);
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquares()}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xTurn: true,
        stepNumber: 0,
      };
    }

    handleClick(i) {
      const locations = [
        [1,1],
        [1,2],
        [1,3],
        [2,1],
        [2,2],
        [2,3],
        [3,1],
        [3,2],
        [3,3]
      ];
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]){
          return;
      }
      squares[i] = this.state.xTurn ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          locations: locations[i],
        }]),
        stepNumber: history.length,
          xTurn: !this.state.xTurn,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xTurn: (step % 2) === 0,
      });
    }

    render() {

      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step,move) => {
        const desc = move ?
        'Go to move: ' + move + " location: " + history[move].locations:
        'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      }
      else if(!current.squares.includes(null)){
        status = "Draw";
      }
      else {
          status = 'Next player: ' + (this.state.xTurn ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            winningSquares ={winner ? winner.line : []}
            squares = {current.squares}
            onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
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
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { player: squares[a], line: [a, b, c] };
        }
        }
        return null;
    }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );