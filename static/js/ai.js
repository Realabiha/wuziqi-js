// let totalWin = [];
// let total = 0;
// for(let i = 0; i < 16; i++){
//     totalWin[i] = [];
//     for(let j = 0; j < 16; j++){
//         totalWin[i][j] = [];
//     }
// }

// const wins = function(gridrow, gridcolumn){
//     rowWin(gridrow, gridcolumn), 
//     columnWin(gridrow, gridcolumn), 
//     topBottomWin(gridrow, gridcolumn), 
//     bottomTopWin(gridrow, gridcolumn)
// }


// let playerWin = [], 
//     aiWin = [],
//     u = 0,
//     v = 0;

// let playerScore = [],
//     aiScore = [],
//     max = 0


// for(let i = 0; i < total; i++){
//     playerWin[i] = 0;
//     aiWin[i] = 0;
// }

// wins(16, 16);
// console.log(totalWin);

// function calcWin(grids, gridrow, gridcolumn){
//     for(let i = 0; i < gridrow; i++){
//         for(let j = 0; j < gridcolumn; j++){
//             let node = grids[i][j];
//             if(node.$value){
//                 for(let k = 0; k < total; k++){
//                     if(totalWin[i][j][k]){
//                         if(node.$value === 1){
//                             aiWin[k]++;
//                             playerWin[k] = -1;
//                         }else if(node.$value === 2){
//                             playerWin[k]++;
//                             aiWin[k] = -1;
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
// function calcScore(grids, gridrow, gridcolumn){
//     for(let i = 0; i < gridrow; i++){
//         for(let j = 0; j < gridcolumn; j++){
//             let node = grids[i][j];
//             if(node.$value === 0){
//                 for(let i = 0; i < gridrow; i++){
//                     playerScore[i] = [];
//                     aiScore[i] = [];
//                     for(let j = 0; j < gridcolumn; j++){
//                         playerScore[i][j] = 0;
//                         aiScore[i][j] = 0;
//                     }
//                 }
//             }
//         }
//     }
// }
// function evaluateAi(grids, gridrow, gridcolumn){
//     for(let i = 0; i < gridrow; i++){
//         for(let j = 0; j < gridcolumn; j++){
//             for(let k = 0; k < total; k++){
//                 if(totalWin[i][j][k]){
//                     if(playerWin[k] == 1){
//                         playerScore[i][j] += 200;
//                     }else if(playerWin[k] == 2){
//                         playerScore[i][j] += 400;
//                     }else if(playerWin[k] == 3){
//                         playerScore[i][j] += 2000;
//                     }else if(playerWin[k] == 4){
//                         playerScore[i][j] += 10000;
//                     }
//                     if(aiWin[k] == 1){
//                         aiScore[i][j] += 220;
//                     }else if(aiWin[k] == 2){
//                         aiScore[i][j] += 420;
//                     }else if(aiWin[k] == 3){
//                         aiScore[i][j] += 2200;
//                     }else if(aiWin[k] == 4){
//                         aiScore[i][j] += 20000;
//                     }
//                 }   
//             }
//             // playerScore[i][j] aiScore[i][j]
//             let player = playerScore[i][j],
//                 ai = aiScore[i][j];
//             if(player > max){
//                 u = i, v = j;
//             }else if(player === max){
//                 if(ai > aiScore[u][v]){
//                     u = i, v = j;
//                 }
//             }
//             if(ai > max){
//                 u = i, v = j;
//             }else if(ai === max){
//                 if(player > ai[u][v]){
//                     u = i, v = j;
//                 }
//             }
//         }
//     }
// }
// function rowWin(gridrow, gridcolumn){
//     for(let i = 0; i < gridrow; i++){
//         for(let j = 0; j < gridcolumn - 4; j++){
//             total ++;
//             for(let q = 0; q < 5; q++){

//                 totalWin[i][j+q][total] = true;
//             }
//         }
//     }
// }
// function columnWin(gridrow, gridcolumn){
//     for(let i = 0; i < gridrow - 4; i++){
//         for(let j = 0; j < gridcolumn; j++){
//             total ++;
//             for(let q = 0; q < 5; q++){
//                 totalWin[i+q][j][total] = true;
//             }
//         }
//     }
// }
// function topBottomWin(gridrow, gridcolumn){
//     for(let i = 0; i < gridrow - 4; i++){
//         for(let j = 0; j < gridcolumn - 4; j++){
//             total ++;
//             for(let q = 0; q < 5; q++){
//                 totalWin[i+q][j+q][total] = true;
//             }
//         }
//     }
// }
// function bottomTopWin(gridrow, gridcolumn){
//     for(let i = gridrow - 1; i > 3; i--){
//         for(let j = 0; j < gridcolumn - 4; j++){
//             total ++;
//             for(let q = 0; q < 5; q++){
//                 totalWin[i-q][j+q][total] = true;
//             }
//         }
//     }
// }