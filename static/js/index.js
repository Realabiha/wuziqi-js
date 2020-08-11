// 2 = 黑棋 |  1 = 白棋  
const GRIDROW = 16, GRIDCOLUMN = 16;
const chess = document.querySelector('.chess');
const switchWrap = document.querySelector('.switch');
const aiSwitch = document.querySelector('label[for=AI]');
const hackSwitch = document.querySelector('label[for=hack]');
const onlineSwitch = document.querySelector('label[for=online]');
const bgPicker = document.querySelector('label[for=bg]');
const skinPicker = document.querySelector('label[for=skin]');
const showBg = document.querySelector('.pbg');
const configBtn = document.querySelector('.config');

let grids = [], 
    count = 1, 
    result = false,  
    done = false; // 对手回合是否落子

let userConfig = {
    AI: false,
    online: true,
    bg: '#2a473d',
    skin: '#000',
    hack: false
} 
initConfig();
const handleSwitch = function(e){
    const checked = e.target.checked;
    const type = this.dataset.switch;
    const status = checked ? '开启' : '关闭';
    const txt = type === 'AI' ? `人机对战${status}` : `在线对战开启${status}`;
    type === 'AI' ? userConfig.AI = checked : userConfig.online = checked;
    userConfig[type] = checked;
    userConfig[type] ? this.classList.add('active') : this.classList.remove('active');
    localStorage.setItem('config', JSON.stringify(userConfig));
    new MsgBox(txt, '../sound/switch.mp3');
}
const handlePick = function(e){
    const type = this.dataset.switch;
    const color = e.target.value;
    const txt = type === 'bg' ? '背景已更换' : '皮肤已更换';
    type === 'bg' ? (document.body.style.background = color, this.style.background = color) : '';
    userConfig[type] = color;
    localStorage.setItem('config', JSON.stringify(userConfig));
    new MsgBox(txt, '../sound/switch.mp3');
}
const handleHack = function(e){
    if(userConfig.AI) userConfig.hack = e.target.checked;
    localStorage.setItem('config', JSON.stringify(userConfig));
}
const handleMouseOver = function(e){
    let {width, height, left, top} = this.querySelector('p').getBoundingClientRect();
    const temp = {width, height, left, top};
    switchWrap.classList.add('hover');
    Object.keys(temp).forEach(prop => {
        showBg.style[prop] = temp[prop] + 'px';
    })
    showBg.style.borderRadius = '10px';
    setTimeout(_ => {
        this.classList.add('hover');
    }, 100)
}
const handleMouseOut = function(e){
    switchWrap.classList.remove('hover');
    setTimeout(_ => {
        this.classList.remove('hover');
    }, 100)
}
const handleMouseEnter = function(e){
    switchWrap.classList.remove('hide');
}
const handleMouseLeave = function(e){
    this.classList.add('hide');
}
const handleResize = function(e){
    let {width, height, left, top} = switchWrap.querySelector('p').getBoundingClientRect();
    const temp = {width, height, left, top};
    Object.keys(temp).forEach(prop => {
        showBg.style[prop] = temp[prop] + 'px';
    })
    showBg.style.borderRadius = '10px';

}

aiSwitch.addEventListener('change', handleSwitch, {});
onlineSwitch.addEventListener('change', handleSwitch, {});
hackSwitch.addEventListener('change', handleHack, {});
bgPicker.addEventListener('change', handlePick, {});
skinPicker.addEventListener('change', handlePick, {});
delegate('mouseover', switchWrap, '.switch label', handleMouseOver);
delegate('mouseout', switchWrap, '.switch label', handleMouseOut);
switchWrap.addEventListener('mouseleave', handleMouseLeave, {})
configBtn.addEventListener('mouseenter', handleMouseEnter, {});
window.addEventListener('resize', handleResize, {});

const onlineCheck = function(x, y){
    if(userConfig.online){
        const role = localStorage.getItem('role');
        if(done || role === 'watcher') return;
        done = true;
        socket.emit('play', `${x}|${y}`);
    }
    playChess.call(this, x, y, 0);
}
const handleClick = function(e){
    e.stopPropagation();
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
    if(userConfig.AI && count % 2 == 0){
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
        userConfig.hack && (grids[u][v].style.border = '3px solid greenyellow');
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
    playMusic('../sound/play.wav').finally(res => {
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