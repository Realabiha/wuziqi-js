// 2 = 黑棋 |  1 = 白棋  
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
const renderGrid = function(grids, x, y, flag){
    const node = grids[x][y];
    node.$value = flag;
    node.classList.add(`${flag === 1  ? 'white' : 'black'}`);
}
const checkResult = function(grids, gridrow, gridcolumn){
    // 判断输赢时以一个方向为准
    // 循环遍历每一个棋子顺时针判断
    // 位与运算
    let result = 0;
    for(let i = 0; i < gridrow; i ++){
        for(let j = 0; j < gridcolumn; j ++){
            if(grids[i][j].$value){
                result = directionCheck(i, j, gridrow, gridcolumn);
                if(result) return result;
            }
            continue;
        }
    }
    return result;
}

function directionCheck(i, j, gridrow, gridcolumn){
    const DIR = {row: 3, column: 3, bottomTop: 3, topBottom: 3}
    for(let q = 0; q < 5; q ++){
        // 顺时针 横向 斜下 纵向 斜上
        DIR.row &= j + q >= gridcolumn ? 0 : grids[i][j+q].$value;
        DIR.topBottom &= i + q >= gridrow || j + q >= gridcolumn ? 0 : grids[i + q][j + q].$value;
        DIR.column &= i + q >= gridrow ? 0 : grids[i+q][j].$value;
        DIR.bottomTop &= i - q < 0 || j + q >= gridcolumn ? 0 : grids[i - q][j + q].$value;
    }
    return DIR.row | DIR.column | DIR.bottomTop | DIR.topBottom;
}
function playMusic(src){
    return new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.oncanplay = function(){
            this.play()
            resolve()
        }
        audio.onerror = function(){
            reject();
        } 
    })
}
function resetGame(grids, gridrow, gridcolumn){
    for(let i = 0; i < gridrow; i++){
        for(let j = 0; j < gridcolumn; j++){
            const node = grids[i][j];
            if(node.$value === 0) continue;
            node.classList.remove('black');
            node.classList.remove('white');
            node.$value = 0;
            count = 1;
        }
    }    

}
function initConfig(){
    const config = JSON.parse(localStorage.getItem('config'));
    if(config) userConfig = config;
    userConfig.AI ? aiSwitch.classList.add('active') : aiSwitch.classList.remove('active'); 
    userConfig.online ? onlineSwitch.classList.add('active') : onlineSwitch.classList.remove('active');
    document.body.style.background = userConfig.bg;
    bgPicker.style.background = userConfig.bg;
    skinPicker.style.background = userConfig.skin;
}
function delegate(type, parent, selector, cb){
    parent.addEventListener(type, e => {
        // target事件触发元素 currentTarget事件绑定元素
        let node = e.target;
        try{
            while(node.matches){
                if(node.matches(selector)){
                    cb.call(node, e);
                    // e.path[0] === node && cb.call(node, e);
                    return;
                }
                node = node.parentNode;
            }
        }catch(error){
            // console.log(error);
        }
    }, {})
}
function MsgBox(msg, src){
    const u = 0.6;
    const right = 300;
    const delay = 500;
    let span;
    let init = function(){
        createBox();
    }
    let createBox = function(){
        const maxtop = u * document.documentElement.clientHeight; 
        span = document.createElement('span');
        span.classList.add('msgbox');
        span.style.right = -right + 'px';
        span.style.top = Math.random() * maxtop + 'px';
        span.textContent = msg;
        document.body.appendChild(span);
        playMusic(src).finally(res => {
            fadeOut(span)
        })
    };
    init();
    function fadeOut(dom){
        setTimeout(_ => {
            dom.classList.add('fadeout');
            setTimeout(_ => {
                document.body.removeChild(dom);
            }, delay)
        }, delay)
    }
    return span;
}
