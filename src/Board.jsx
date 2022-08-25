import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
// import FlagCircleIcon from '@mui/icons-material/FlagCircle';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RightArrow from './Assets/RightArrow.svg';
import Target from './Assets/Target.svg';
import Animator from "./Animator";
import djikstra from "./Algorithms/Djikstra";

const creation = keyframes`
  from {
    transform : scale(0.3);
    border-radius : 50%;
  }

  to {
    transform : scale(1.0);
    border-radius : 0%;
  }
`;
const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding : 0;
  }
`;
const Grid = styled.div`
  display: grid;
  // grid-gap: 0.2rem;
  grid-template-columns: repeat(${ props => props.n }, 1fr);
`;
const GridCell = styled.div`
  aspect-ratio : 1;
  border-style : solid;
  border-width : 0 0 1px 1px
`;

const IconCell = styled(GridCell)`
  border-color : gray;
  background-size: cover;
  background-image:url(${props => props.image});
`;

const VisitedCell = styled(GridCell)`
  border-color : white;
  animation: ${creation} 2s forwards;
  background-color : hsl(200, 70%, 60%);
`;

const Cell = styled(GridCell)`
  background-color: ${props => props.color};
  border-color : gray;
`;

const Wall = styled(GridCell)`
  border-color : white;
  animation: ${creation} 0.5s forwards;
  background-color : gray;
`;

export default function Board() {
  
  
  const initBoard = (M, N, source, target) => {
    const board = Array.from({length: M},()=> Array.from({length: N}, () => 0));
    board[source[0]][source[1]] = 1;
    board[target[0]][target[1]] = 2;
    return board;
  }
  const [M, N] = [20, 40];
  const source = [10, 10];
  const target = [10, 20];
  const [cells, setcells] = React.useState(initBoard(M, N, source, target));
  const frames = React.useRef(null);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  const updateFrame = (board) => {setcells(board); forceUpdate();}

  const updateIndices = (indices, valueList, array) => {
    const board = [...array];
    if(valueList.length === 1)
      indices.map( index => board[index[0]][index[1]] = valueList[0]);
    else if(valueList.length === indices.length)
      indices.map( (index, i) => board[index[0]][index[1]] = valueList[i]);
    else{
      console.error("Error in updateIndices function. The length of valuelist is incompatible.");
    }
    return board;
  }
  
  const animator = React.useRef(new Animator(60, (animatorRef) => {
    const nextFrame = frames.current.next();
    let board;
    if(nextFrame.done){
      board = updateIndices(nextFrame.value, [4], cells);
      animatorRef.stop() 
    }
    else{
      board = [...cells];
      board.map((row, i) => row.map((item, j) => 
      {
        if(nextFrame.value[[i, j]].visited && board[i][j] === 0) board[i][j] = 5;
        return item;
      }));
    }
    updateFrame(board);
  }));

  const CellFactory = (id, row, column) => {
    switch(id){
      case 0 : return <Cell key = {[row, column]} color='white' onClick = {() => setcells(updateIndices([[row, column]], [3], cells))}/>; /*Normal Cell*/
      case 1 : return <IconCell key = {[row, column]} image = {RightArrow}/>
      case 2 : return <IconCell key = {[row, column]} image = {Target}/>
      case 3 : return <Wall key = {[row, column]} onClick = {() => setcells(updateIndices([[row, column]], [0], cells))}/>; /* Wall */
      case 4 : return <Cell key = {[row, column]} color='green'/>; /* Path */
      case 5 : return <VisitedCell key = {[row, column]}/>; /* Visisted cell */
      default : return null;
    }
  }
  return (
    <React.Fragment>
      <GlobalStyle/>
      <div>
        <Grid n={N}>
          {
            cells && cells.map((item, row) => item.map((subItem, column) => 
              <div>
                {
                  CellFactory(subItem, row, column)
                }
              </div>
            ))
          }
        </Grid>
        <button onClick={() => {frames.current = djikstra(cells, source, target); animator.current.start();}}>Click please</button>
        {/* <button onClick={() => animator.current.stop()}>Stop please</button>     */}
      </div>
    </React.Fragment>
  );
}