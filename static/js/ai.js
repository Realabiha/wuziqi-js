let totalWin = [];
let total = 0;
for(let i = 0; i < 16; i++){
    totalWin[i] = [];
    for(let j = 0; j < 16; j++){
        totalWin[i][j] = [];
    }
}
let playerWin = [], 
    aiWin = [],
    u = 0,
    v = 0;
let playerScore = [],
    aiScore = [],
    max = 0;
wins(GRIDROW, GRIDCOLUMN);
for(let i = 0; i < total; i++){
    playerWin[i] = 0;
    aiWin[i] = 0;
}


function wins(gridrow, gridcolumn){
    rowWin(gridrow, gridcolumn), 
    columnWin(gridrow, gridcolumn), 
    topBottomWin(gridrow, gridcolumn), 
    bottomTopWin(gridrow, gridcolumn)
}
function calcWin(grids, gridrow, gridcolumn){
    for(let i = 0; i < gridrow; i++){
        for(let j = 0; j < gridcolumn; j++){
            let node = grids[i][j];
            if(node.$value){
                for(let k = 0; k < total; k++){
                    if(totalWin[i][j][k]){
                        playerWin[k]++;
                        aiWin[k] = 6;
                    }
                }
            }
        }
    }
}
function calcScore(gridrow, gridcolumn){
    u = 0;
    v = 0;
    max = 0;
    playerScore = [];
    aiScore = [];
    for(let i = 0; i < gridrow; i++){
        playerScore[i] = [];
        aiScore[i] = [];
        for(let j = 0; j < gridcolumn; j++){
            playerScore[i][j] = 0;
            aiScore[i][j] = 0;
        }
    }
}
function evaluateAi(grids, gridrow, gridcolumn){
    calcScore(GRIDROW, GRIDCOLUMN)
    for(let i = 0; i < gridrow; i++){
        for(let j = 0; j < gridcolumn; j++){
            if(grids[i][j].$value === 0){
                for(let k = 0; k < total; k++){
                    if(totalWin[i][j][k]){
                        if(playerWin[k] == 1){
                            playerScore[i][j] += 200;
                        }else if(playerWin[k] == 2){
                            playerScore[i][j] += 400;
                        }else if(playerWin[k] == 3){
                            playerScore[i][j] += 2000;
                        }else if(playerWin[k] == 4){
                            playerScore[i][j] += 10000;
                        }
                        if(aiWin[k] == 1){
                            aiScore[i][j] += 220;
                        }else if(aiWin[k] == 2){
                            aiScore[i][j] += 420;
                        }else if(aiWin[k] == 3){
                            aiScore[i][j] += 2200;
                        }else if(aiWin[k] == 4){
                            aiScore[i][j] += 20000;
                        }
                    }   
                }
                if(aiScore[i][j] > max){
                    max = aiScore[i][j];
                    u = i;
                    v = j;					
                }
                else if(aiScore[i][j] == max){
                    if(playerScore[i][j] > playerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(playerScore[i][j] > max){
                    max = playerScore[i][j];
                    u = i;
                    v = j;					
				}
				else if(playerScore[i][j] == max){
					if(aiScore[i][j] > aiScore[u][v]){
						u = i;
						v = j;						
					}
				}
                
                
            }
        }
    }
}
function rowWin(gridrow, gridcolumn){
        for(let i = 0; i < gridrow; i++){
            for(let j = 0; j < gridcolumn - 4; j++){
                total ++;
                for(let q = 0; q < 5; q++){
    
                    totalWin[i][j+q][total] = true;
                }
            }
        }
}
function columnWin(gridrow, gridcolumn){
        for(let i = 0; i < gridrow - 4; i++){
            for(let j = 0; j < gridcolumn; j++){
                total ++;
                for(let q = 0; q < 5; q++){
                    totalWin[i+q][j][total] = true;
                }
            }
        }
}
function topBottomWin(gridrow, gridcolumn){
        for(let i = 0; i < gridrow - 4; i++){
            for(let j = 0; j < gridcolumn - 4; j++){
                total ++;
                for(let q = 0; q < 5; q++){
                    totalWin[i+q][j+q][total] = true;
                }
            }
        }
}
function bottomTopWin(gridrow, gridcolumn){
        for(let i = gridrow - 1; i > 3; i--){
            for(let j = 0; j < gridcolumn - 4; j++){
                total ++;
                for(let q = 0; q < 5; q++){
                    totalWin[i-q][j+q][total] = true;
                }
            }
        }
}