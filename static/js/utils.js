// 2 = 黑棋 |  1 = 白棋  
const renderGrid = function(grids, x, y, flag){
    grids[x][y].$value = flag;
    grids[x][y].classList.add(`${flag === 1  ? 'white' : 'black'}`);
}

const evaluator = function(grids, gridrow, gridcolumn){
    let score = {row: 1, topBottom: 1, column: 1, bottomTop: 1};
    let maxmin = {max: 0, min: 0};
    const MAP = [1, 10, 10];
    for(let i = 0; i < gridrow; i++){
        for(let j = 0; j < gridcolumn; j++){
            let node = grids[i][j];
            if(node.$value){
                for(let q = 0; q < 5; q ++){
                    score.row *= j + q >= gridcolumn ? 1 : MAP[grids[i][j+q].$value];
                    score.topBottom *= i + q >= gridrow || j + q >= gridcolumn ? 1 : MAP[grids[i + q][j + q].$value];
                    score.column *= i + q >= gridrow ? 1 : MAP[grids[i+q][j].$value];
                    score.bottomTop *= i - q < 0 || j + q >= gridcolumn ? 1 : MAP[grids[i - q][j + q].$value];
                }
                maxmin.max = Math.max(score.row, score.topBottom, score.column, score.bottomTop, maxmin.max);
                maxmin.min = Math.min(score.row, score.topBottom, score.column, score.bottomTop, maxmin.min);
                Object.keys(score).forEach(prop => {
                    score[prop] = 1;
                })
            }
        }
    }
    console.dir(maxmin);
    return maxmin;
}


function checkResult(grids, gridrow, gridcolumn){
    // 判断输赢时以一个方向为准
    // 循环遍历每一个棋子顺时针判断
    // 位与运算
    let result = 0;
    let row = 3, column = 3, bottomTop = 3, topBottom = 3;
    for(let i = 0; i < gridrow; i ++){
        for(let j = 0; j < gridcolumn; j ++){
            if(grids[i][j].$value){
                for(let q = 0; q < 5; q ++){
                    // 顺时针 横向 斜下 纵向 斜上
                    row &= j + q >= gridcolumn ? 0 : grids[i][j+q].$value;
                    topBottom &= i + q >= gridrow || j + q >= gridcolumn ? 0 : grids[i + q][j + q].$value;
                    column &= i + q >= gridrow ? 0 : grids[i+q][j].$value;
                    bottomTop &= i - q < 0 || j + q >= gridcolumn ? 0 : grids[i - q][j + q].$value;
                }
                result =  row | column | bottomTop | topBottom;
                if(result) return result;
                row = 3, column = 3, bottomTop = 3, topBottom = 3;
            }
            continue;
        }
    }
    return result;
}
function miniMax(grids, gridrow, gridcolumn, depth, isMax,){
    if(checkResult(grids, gridrow, gridcolumn) || depth === 0){
        return evaluator(grids, gridrow, gridcolumn);
    }
    // 寻找大值 黑棋2
    if(isMax){
        let max = -Infinity;
        for(let i = 0;i < gridrow; i++){
            for(let j = 0; j < gridcolumn; j++){
                let node = grids[i][j];
                if(node.$value === 0){
                    node.$value = 2;
                    const result = miniMax(grids, gridrow, gridcolumn, depth - 1, false)
                    node.$value = 0;
                    max = Math.max(max, result);
                }
            }
        }
        return max;
    }else{
        let min = +Infinity;
        for(let i = 0;i < gridrow; i++){
            for(let j = 0; j < gridcolumn; j++){
                let node = grids[i][j];
                if(node.$value == 0){
                    node.$value = 1;
                    const result = miniMax(grids, gridrow, gridcolumn, depth - 1, true)
                    node.$value = 0;
                    min = Math.min(min, result);
                }
            }
        }
        return min;
    }
}
