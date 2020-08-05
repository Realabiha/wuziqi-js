// click
// 2 = 黑棋 |  1 = 白棋  
const socket = io();
const GRIDROW = 16, GRIDCOLUMN = 16;
const chess = document.querySelector('.chess');
let grids = [], 
    count = 1, 
    result = false,  
    AI = true, 
    online = false, 
    done = false; // 对手回合是否落子


// AI
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
// AI



const handleClick = function(e){
    const {$x, $y} = this;
    if(this.$value) return;
    if(online){
        socket.emit('play', `${$x}|${$y}`);
        if(done) return;
        done = true;
    }
    // Ai下棋
    if(count % 2 + 1 == 1 && AI) return;

    playChess.call(this, $x, $y, 0);
}

for(let i = 0; i < GRIDROW; i ++){
    grids[i] = [];
    for(let j = 0; j < GRIDCOLUMN; j ++){
        grids[i][j] = createGrid(i, j);
        chess.appendChild(grids[i][j]);
        grids[i][j].addEventListener('click', handleClick, {once: true});
    }
}

function createGrid(x, y){
    let grid = document.createElement('div');
    grid.classList.add('light');
    grid.style.left = `${y*60 + 30}px`;
    grid.style.top = `${x*60 + 30}px`;
    grid.$value = 0;
    grid.$y = y;
    grid.$x = x;
    return grid;
}
function playChess(x, y, socket = 1){
    count = online ? localStorage.getItem('count') : count;
    const flag = count % 2 + 1;
    renderGrid(grids, x, y, flag);
    for(let k = 0; k < total; k++){
        if(totalWin[x][y][k]){
            aiWin[k]++;
        }
    }
    count ++;
    if(socket){
        localStorage.setItem('count', count);
        done = false;
    }
    result = checkResult(grids, GRIDROW, GRIDCOLUMN);
    if(result){
        console.log('比赛结束')
        return;
    }else if(AI){
        evaluateAi(grids, GRIDROW, GRIDCOLUMN)
        console.log(u, v, max);
        renderGrid(grids, u, v, 1);
        for(let k = 0; k < total; k++){
            if(totalWin[x][y][k]){
                playerWin[k]++;
            }
        }
        count ++;
        result = checkResult(grids, GRIDROW, GRIDCOLUMN);
        if(result){
            console.log('比赛结束') 
            return;
        }    
    }
}


// socket
const content = document.querySelector('.content');
const form = document.querySelector('form');
const text = document.querySelector('input[type=text]');
let user;
const handleSend = function(e){
    e.preventDefault();
    const msg = `${user}: ${text.value}`;
    socket.emit('msg', msg);
    createMsgDiv(msg)
    scrollDown();
    form.reset();
}
const handleFocus = function(){
    scrollDown();
}

form.addEventListener('submit', handleSend, {});
text.addEventListener('focus', handleFocus, {});

socket.on('connect', _ => {
    user = Date.now();
    socket.emit('login', user);
    socket.on('msg', msg => {
       createMsgDiv(msg);           
    });
    socket.on('login', user => {
        const p = document.createElement('p');
        p.classList.add('broadcast');
        p.innerHTML = `${JSON.parse(user)}进入了游戏`;
        content.appendChild(p);
    });
    socket.on('play', play => {
        console.log(play, 'play');
        const temp = play.split('|');
        playChess(temp[0], temp[1]);
    });
    socket.on('out', user => {
        const p = document.createElement('p');
        p.classList.add('broadcast');
        p.innerHTML = `${user}离开了游戏`;
        content.appendChild(p);
    })
    // 每次修改代码保存之后会触发重连
    socket.on('reconnect', _ => {
        console.log('reconnect');
    })
})

function scrollDown(){
    document.documentElement.scrollTop = content.scrollHeight;
}
function createMsgDiv(msg){
    console.log(user, msg)
    const pos = user == msg.split(':')[0] ? 'right' : 'left';
    const div = document.createElement('div');
    div.classList.add('input');
    div.setAttribute('pos', pos);
    div.innerHTML = msg;
    content.appendChild(div);
}

socket.on('disconnect', _ => {
    // 调用api断开
})
// socket



    
// AI   
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
// AI