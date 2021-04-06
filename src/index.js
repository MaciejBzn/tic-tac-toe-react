import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

  if(props.highlight === false)
  {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  else{
    
    return (
      <button className="square-highlight" onClick={props.onClick}>
        {props.value}
      </button>
    );

  }
  
}



class Board extends React.Component {
  
  handleClick(i){
    const squares = this.state.squares.slice();
    var winnerObject = calculateWinner(squares);

    if(winnerObject.sign || squares[i]){
      
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  
  renderSquare(i) {
    if(this.props.winningSquares === null)
    {
      return (
        <Square
          value={this.props.squares[i]}
          onClick = {()=> this.props.onClick(i)}
          highlight = {false}
        />
      );
    }else{
      if(i === this.props.winningSquares[0] || i === this.props.winningSquares[1] || i === this.props.winningSquares[2])
      {
        return (
          <Square
            value={this.props.squares[i]}
            onClick = {()=> this.props.onClick(i)}
            highlight = {true}
          />
        );

      }else{
        return (
          <Square
            value={this.props.squares[i]}
            onClick = {()=> this.props.onClick(i)}
            highlight = {false}
          />
        );

      }

    }
    
  }

  renderRow(row) {
    const squares = [];
    const offset = row * this.props.squaresPerRow; // this makes sure first row is 0,1,2, second row is 3,4,5, etc.
    for (let s = 0; s < this.props.squaresPerRow; s++) {
      squares.push(
        this.renderSquare(offset + s)
      );
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    )
  }

  render() {
    const rows = [];
    for (let r = 0; r < this.props.totalRows; r++) {
      rows.push(
        this.renderRow(r)
      );
    }
    return(
    
    <div>
      <div className="status"></div>
      {rows}
    </div>
    );}

/*
  renderRow(rowLength, rowNubmer){
    var row = new Array(rowLength);

    for (var i=0; i < rowLength ; i++)
    {
      row.push(this.renderSquare[i + rowNubmer * rowLength]);
    }
    return (
      <div className='board-row'> {row} </div>
    );
    
    
  }
  

  renderBoard(rowLenght,rowNumber){
    
    var rows = new Array(rowNumber);

    for(let j = 0; j < rowNumber; j ++)
      {
        rows.push(this.renderRow(rowLenght,j));     
      }
      return rows;
  }

  render() {
    
    return (
      
      <div>
        <div className="status"></div>
        {this.renderBoard(3,3)}
      </div>
    );

   
  /*
    return (
      
      <div>
        <div className="status"></div>
        
        
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
  }*/
}

class Game extends React.Component {
constructor(props){
  super(props)
  this.state = {
    history: [{
      squares: Array(9).fill(null)
    }],
    stepNumber: 0,
    xIsNext: true,
    lastPosition: {
      Column: null,
      Row: null,
    },
    bold: false,
    descending: true,
    text: 'ascend'
  
  };
}
  handleButton() {
    var text = this.state.text;
    if (this.state.text === 'ascend') {
      text = 'descend';
    }
    else {
      text = 'ascend';
    }

    this.setState(
      {
        descending: !this.state.descending,
        text: text,

      }
    );

   
  }

handleClick(i) {
  const history = this.state.history.slice(0,this.state.stepNumber + 1);
  const current = history[history.length - 1];
  const squares = current.squares.slice();
  var winnerObject = calculateWinner(squares);
 
  if(winnerObject.sign || squares[i]) {
    return;
  }
  squares[i] = this.state.xIsNext ? 'X' : 'O';
  this.setState({
    history: history.concat([{
      squares: squares,
    }]),
    xIsNext: !this.state.xIsNext,
    stepNumber : history.length,
   
    
  });
 

}

jumpTo(step){
  this.setState({
    stepNumber: step,
    xIsNext: (step %2) === 0,
  });
}


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    var winnerObject = calculateWinner(current.squares);
    const winner = winnerObject.sign;
    const winningSquares = winnerObject.positions;
    //const winner = calculateWinner(current.squares);
   

   
    const moves = history.map((step, move) => {
      const position = getPostionHistory(history, move);
      var desc;
     
        if(this.state.stepNumber === move)
        {
          desc = move ?
          'Go to move #' + move + ' (' + position.Column + ',' + position.Row + ')' :
          'Go to game start';
          return (
          <li key={move}>
           <button onClick={() => this.jumpTo(move)}>
           <div className= 'game-step-altered'> {desc}</div>
           </button>
         </li>
         );
        }

        else{

           desc = move ?
          'Go to move #' + move + ' (' + position.Column + ',' + position.Row + ')' :
          'Go to game start';
          return (
            <li key={move}>
             <button onClick={() => this.jumpTo(move)}>
             <div className= 'game-steps'> {desc}</div>
             </button>
           </li>
           );
        }

      
    });

    if(this.state.descending === false)
    {
      moves.reverse();

    }
    


    let status;
    if (winnerObject.sign) {
      //if(winner){
      status = 'Winner: ' + winnerObject.sign;
    } else {
      if (moves.length === 10) {
        status = 'Draw ';
        console.log('DRAW');

      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        
      }
      console.log('status ' + status);

    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            totalRows = {3}
            squaresPerRow = {3}
            squares={current.squares}
            onClick= {(i)=> this.handleClick(i)}
            winningSquares = {winnerObject.positions}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
        <button className= 'ascend-button' onClick = {()=> this.handleButton()}>{this.state.text}</button>
        
      </div>
    );
  }
}

function calculateWinner(squares) {
  var winnerObject={
    sign: null,
    positions: null,
  };
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
      winnerObject.sign = squares[a];
      winnerObject.positions = [a,b,c];
      return winnerObject;
     // return squares[a];
    }
  }
//return null;
  return winnerObject;
}

function getPostion(i){

  var position = {
    Row: null,
    Column: null,
  };
  switch(i){
    case 0:
      position.Row = 1;
      position.Column = 1;
      break;
      case 1:
        position.Row = 1;
        position.Column = 2;
        break;
        case 2:
      position.Row = 1;
      position.Column = 3;
      break;
      case 3:
      position.Row = 2;
      position.Column = 1;
      break;
      case 4:
      position.Row = 2;
      position.Column= 2;
      break;
      case 5:
      position.Row = 2;
      position.Column = 3;
      break;
      case 6:
      position.Row = 3;
      position.Column = 1;
      break;
      case 7:
      position.Row = 3;
      position.Column = 2;
      break;
      case 8:
      position.Row = 3;
      position.Column = 3;
      break;
      default:
        position.Row = null;
        position.Column = null;
        break;
  }
  return position;
 
}

function getPostionHistory(history, step) {
  var position = {
    Row: null,
    Column: null,
  };
  for (let i = 0; i < 9; i++) {
    if (step >= 1) {
      if (history[step].squares[i] !== history[step - 1].squares[i]) {
        switch (i) {
          case 0:
            position.Row = 1;
            position.Column = 1;
            break;
          case 1:
            position.Row = 1;
            position.Column = 2;
            break;
          case 2:
            position.Row = 1;
            position.Column = 3;
            break;
          case 3:
            position.Row = 2;
            position.Column = 1;
            break;
          case 4:
            position.Row = 2;
            position.Column = 2;
            break;
          case 5:
            position.Row = 2;
            position.Column = 3;
            break;
          case 6:
            position.Row = 3;
            position.Column = 1;
            break;
          case 7:
            position.Row = 3;
            position.Column = 2;
            break;
          case 8:
            position.Row = 3;
            position.Column = 3;
            break;
          default:
            position.Row = null;
            position.Column = null;
            break;
        }
       
        return position;

      }
    }

  }
};
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
