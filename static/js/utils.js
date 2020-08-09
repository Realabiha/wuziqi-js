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
            try {
                this.play()
                resolve()
            } catch (error) {
                console.log(error);
            }
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