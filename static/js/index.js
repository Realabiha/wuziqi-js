// 2 = 黑棋 |  1 = 白棋  
const GRIDROW = 16, GRIDCOLUMN = 16;
const chess = document.querySelector('.chess');
const aiSwitch = document.querySelector('label[for=ai]');
const onlineSwitch = document.querySelector('label[for=online]');

let grids = [], 
    count = 1, 
    result = false,  
    AI = false, 
    online = false, 
    done = false; // 对手回合是否落子

const handleSwitch = function(e){
    let type = this.dataset.switch;
    this.classList.toggle('active');
    type == 'ai' ? AI = e.target.checked : online = e.target.checked;
}
aiSwitch.addEventListener('change', handleSwitch, {})
onlineSwitch.addEventListener('change', handleSwitch, {})

const onlineCheck = function(){
    if(online){
        if(done) return;
        done = true;
        socket.emit('play', `${$x}|${$y}`);
    }
}
const handleClick = function(e){
    const {$x, $y} = this;
    if(this.$value) return;
    onlineCheck();
    playChess.call(this, $x, $y, 0);
}

const bindClick = function(){
    for(let i = 0; i < GRIDROW; i ++){
        grids[i] = [];
        for(let j = 0; j < GRIDCOLUMN; j ++){
            grids[i][j] = createGrid(i, j);
            chess.appendChild(grids[i][j]);
            grids[i][j].addEventListener('click', handleClick, {});
        }
    }
}
bindClick();


const getResult = function(){
    result = checkResult(grids, GRIDROW, GRIDCOLUMN);
    gameOver();
    if(AI && count % 2 == 0){
        evaluateAi(grids, GRIDROW, GRIDCOLUMN)
        renderGrid(grids, u, v, 1);
        count++;
        for(let k = 0; k < total; k++){
            if(totalWin[u][v][k]){
                aiWin[k]++;
                playerWin[k] = -5;
            }
        }
        gameOver();    
    }
}
function playChess(x, y, socket = 1){
    count = online ? localStorage.getItem('count') : count;
    const flag = count % 2 + 1;
    renderGrid(grids, x, y, flag);
    count++;
    if(socket){
        localStorage.setItem('count', count);
        done = false;
    }
    for(let k = 0; k < total; k++){
        if(totalWin[x][y][k]){
            playerWin[k]++;
            aiWin[k] = -5;
        }
    }
    getResult();
}
function gameOver(){
    result = checkResult(grids, GRIDROW, GRIDCOLUMN);
    if(result){
        const DIR = JSON.parse(localStorage.getItem('dir'));
        const pos = localStorage.getItem('pos');
        const dir = Object.keys(DIR).find(prop => DIR[prop]);
        renderWin(dir, pos.split('|')[0], pos.split('|')[1]);
    }
}
function renderWin(dir, i, j){
    const map = {
        row: [i, j],
        column: [i, j],
        bottomTop: [i, j],
        topBottom: [i, j]
    }
    console.log(i, j)
    grids[i][j].style.background = 'greenyellow';
    setTimeout( _ => {
        alert('比赛结束')
    }, 100)
}