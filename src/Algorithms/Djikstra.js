import { neighbours } from "../Utility/neighbours";

function* djikstraGen(board, source, target){
  const nodes = {};
  const previous = {};
  const path = [];
  const [m, n] = [board.length, board[0].length];
  for (let i = 0; i < m; i++) {
    for (let j = 0 ; j < n ; j++){
      nodes[[i, j]] = {visited: false, distance :Infinity};
      previous[[i, j]] = null;
    }
  }
  nodes[source] = {visited : true, distance : 0};
  const queue = [source];
  while(queue.length > 0){
    const U = queue.shift();
    if(U[0] === target[0] && U[1] === target[1]) break;
    const neighboursList = neighbours(U, m, n);
    neighboursList.map( V => {
      if(board[V[0]][V[1]] === 0 || nodes[V].visited) return V;
      queue.push(V);
      nodes[V].visited = true;
      const tempDistance = nodes[U].distance + 1;
      if(tempDistance < nodes[V].distance){
        nodes[V].distance = tempDistance;
        previous[V] = U;
      }
      return V;
    });
    yield {type : "visited", value : nodes};
  }
  let index = target;

  while(true){
    index = previous[index];
    if(index === null) break;
    if (index === source) break;
    path.push(index);
  }
  if(path.length == 0) return null;
  for(let i = path.length - 1 ; i >= 0 ; i--){
      yield {type : "path", value : [path[i]]}
  }
}

function djikstra(board, source, target){
 const nodes = {};
  const previous = {};
  const path = [];
  const [m, n] = [board.length, board[0].length];
  // console.log("D=>",[board.length, board[0].length]);
  for (let i = 0; i < m; i++) {
    for (let j = 0 ; j < n ; j++){
      nodes[[i, j]] = {visited: false, distance :Infinity};
      previous[[i, j]] = null;
    }
  }
  nodes[source] = {visited : true, distance : 0};
  const queue = [source];
  while(queue.length > 0){
    const U = queue.shift();
    if(U[0] === target[0] && U[1] === target[1]) break;
    const neighboursList = neighbours(U, m, n);
    neighboursList.map( V => {
      if(board[V[0]][V[1]] === 0 || nodes[V].visited) return V;
      queue.push(V);
      nodes[V].visited = true;
      const tempDistance = nodes[U].distance + 1;
      if(tempDistance < nodes[V].distance){
        nodes[V].distance = tempDistance;
        previous[V] = U;
      }
      return V;
    });
  }
  let index = target;

  while(true){
    index = previous[index];
    if(index === null) break;
    if (index === source) break;
    path.push(index);
  }
  if(path.length == 0) return null;
  return {nodes : nodes, path : path};
}
export {djikstraGen, djikstra};