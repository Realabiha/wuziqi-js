window.onload = function(){
    console.log('load')
}

// 2 = 黑棋 |  1 = 白棋  
const GRIDROW = 16, GRIDCOLUMN = 16;
const chess = document.querySelector('.chess');
const aiSwitch = document.querySelector('label[for=ai]');
const onlineSwitch = document.querySelector('label[for=online]');
const bgPicker = document.querySelector('label[for=bg]');
let grids = [], 
    count = 1, 
    result = false,  
    AI = false, 
    online = true, 
    done = false; // 对手回合是否落子

const handleSwitch = function(e){
    let type = this.dataset.switch;
    this.classList.toggle('active');
    type == 'ai' ? AI = e.target.checked : online = e.target.checked;
}
const handlePick = function(e){
    console.log(e.target.value);
    document.body.style.background = e.target.value;
}
aiSwitch.addEventListener('change', handleSwitch, {})
onlineSwitch.addEventListener('change', handleSwitch, {})
bgPicker.addEventListener('change', handlePick, {});
const onlineCheck = function(x, y){
    if(online){
        const role = localStorage.getItem('role');
        if(done || role === 'watcher') return;
        done = true;
        socket.emit('play', `${x}|${y}`);
    }
    playChess.call(this, x, y, 0);
}
const handleClick = function(e){
    const {$x, $y} = this;
    if(this.$value) return;
    onlineCheck($x, $y);
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
        evaluateAi(grids, GRIDROW, GRIDCOLUMN)
        console.log(u, v);
        grids[u][v].style.border = '3px solid greenyellow';
        gameOver();    
    }
}
function playChess(x, y, socket = 1){
    const flag = count % 2 + 1;
    renderGrid(grids, x, y, flag);
    socket ? (count--, done=false) : count++
    for(let k = 0; k < total; k++){
        if(totalWin[x][y][k]){
            playerWin[k]++;
            aiWin[k] = -5;
        }
    }
    playMusic('../sound/cat.wav').finally(res => {
        getResult();
    });
}
function gameOver(){
    result = checkResult(grids, GRIDROW, GRIDCOLUMN);
    if(result){
        // const DIR = JSON.parse(localStorage.getItem('dir'));
        // const pos = localStorage.getItem('pos');
        // const dir = Object.keys(DIR).find(prop => DIR[prop]);
        // renderWin(dir, pos.split('|')[0], pos.split('|')[1]);

        playMusic('../sound/victory.mp3').finally(
            setTimeout( _ => {
                // location.reload();
                alert(`比赛结束: ${count % 2 == 1 ? '白棋' : '黑棋'}胜`)
                resetGame(grids, GRIDROW, GRIDCOLUMN);
            }, 300)
        )
    }
}