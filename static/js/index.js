const GRIDROW = 16, GRIDCOLUMN = 16;
const chess = document.querySelector('.chess');
const input = document.querySelector('input');
let grids = [], count = 1, result = 0, calc = [], AI = false;


input.onchange = handleChange;

for(let i = 0; i < GRIDROW; i ++){
    grids[i] = [];
    for(let j = 0; j < GRIDCOLUMN; j ++){
        grids[i][j] = createGrid(i, j);
        chess.appendChild(grids[i][j]);
        grids[i][j].onclick = handleClick;
    }
}


function createGrid(x, y){
    let grid;
    grid = document.createElement('div');
    grid.classList.add('test');
    grid.style.left = `${y*60 + 30}px`;
    grid.style.top = `${x*60 + 30}px`;
    grid.flag = 0;
    grid.$y = y;
    grid.$x = x;
    // grid.$color = grid.flag === 1 ? 'black' : 'white';
    return grid;
}

function handleClick(){
    calc = [];
    const flag = count % 2 + 1;

    // 已有棋
    if(this.flag) return;
    // Ai下棋
    if(flag === 1 && AI) return;
    
    // 玩家
    this.style.background = flag == 1 ? '#eee' : '#111';
    this.style.boxShadow = `0px 0px 10px 1px ${flag == 1 ? '#000' : '#000'}`;
    this.flag = flag;
    count ++;
    if(count){
        calcReulst.call(this);
        if(result){
            setTimeout(_ => {
                alert(flag == 1 ? '白棋胜' : '黑棋胜');
                location.reload();
            })
        }else{
           AI && calcAi.call(this);
        }
    }
}

function calcReulst(){
    row.call(this, this.$x, this.$y, []);
    column.call(this, this.$x, this.$y, []);
    leftDown.call(this, this.$x, this.$y, []);   
    leftTop.call(this, this.$x, this.$y, []);
}

// 判断相同颜色棋子颜色个数
function getResult(target){
    // 筛选出与当前棋子颜色相同的所有棋子并排序(排序是为了后续判断是否连续)
    let test;
    if(AI){
        rest = target.filter(v => v.flag === 2).sort((a, b) => (a.$x-b.$x));
    }else{
        rest = target.filter(v => v.flag === this.flag).sort((a, b) => (a.$x-b.$x));
    }
    const len = rest.length;
    if(len < 5){
        calc.push(rest);
        return false;
    }
    if(len >= 5){
        const start = rest[0];
        const end = rest[len-1];
        // 横向判断
        if(start.$x == end.$x){
            if(Math.abs(start.$y - end.$y) == len - 1){
                rest.forEach(v => v.style.background = 'green');
                result = true;
            } 
        }
        // 纵向判断
        if(start.$y == end.$y){
            if(Math.abs(start.$x - end.$x) == len - 1){
                rest.forEach(v => v.style.background = 'green');
                result = true;
            }
        }
        // 斜向判断
        if(Math.abs(start.$x-end.$x) == len - 1){
            if(Math.abs(start.$y - end.$y) == len - 1){
                rest.forEach(v => v.style.background = 'green');
                result = true;
            }
        }
        if(!result){
            calc.push(rest);
        };
    }
}
// 横向判断
function row(x, y, target){
    if(y > 3 && y < GRIDCOLUMN - 4){
        for(let i = y - 4; i <= y + 4; i ++){
            target.push(grids[x][i]);
        }
    }
    if(y <= 3){
        for(let i = 0; i <= y + 4; i ++){
            target.push(grids[x][i]);
        }
    }
    if(y >= GRIDCOLUMN - 4){
        for(let i = GRIDCOLUMN - 1; i >= y - 4; i --){
            target.push(grids[x][i]);
        }
    }
    getResult.call(this, target);
}
// 纵向判断
function column(x, y, target){
    if(x > 3 && x < GRIDROW - 4){
        for(let i = x - 4; i <= x + 4; i ++){
            target.push(grids[i][y]);
        }
    }
    if(x <= 3){
        for(let i = 0; i <= x + 4; i ++){
            target.push(grids[i][y]);
        }
    }
    if(x >= GRIDROW - 4){
        for(let i = GRIDROW - 1; i >= x - 4; i --){
            target.push(grids[i][y]);
        }
    }

    getResult.call(this, target);
    
}
// 左下方<-->右上方判断
function leftDown(x, y, target){
    const min = x >= y ? y : x;
    const max = x >= y ? x : y;
    const minLen = GRIDROW >= GRIDCOLUMN ? GRIDROW : GRIDCOLUMN;
    const maxLen = GRIDROW >= GRIDCOLUMN ? GRIDCOLUMN : GRIDROW;
    if(min > 3 && min < minLen - 4){
        target.push(grids[x][y]);
        for(let i = 1; i <= 4; i ++){
            if(x+i<=minLen-1&&y-i>=0){
                target.push(grids[x+i][y-i])
            }
            if(x-i>=0&&y+i<=minLen-1){
                target.push(grids[x-i][y+i])
            }
        }
    }
    if(min <= 3){
        target.push(grids[x][y]);
        for(let i = 1; i <= 4; i ++){
            if(x-i>=0&&y+i<=minLen-1){
                target.push(grids[x-i][y+i]);
            }
        }
        for(let i = 1; i <= minLen-1-max; i ++){
            if(x+i<=minLen-1&&y-i>=0){
                target.push(grids[x+i][y-i]);
            }
        }
    }
    if(min >= 14){
        target.push(grids[x][y]);
        for(let i = 1; i <= 4; i ++){
            if(x+i<=minLen-1&&y-i>=0){
                target.push(grids[x+i][y-i]);
            }
        }
        for(let i = 1; i <= minLen-1-max; i ++){
            if(y+i<=minLen-1&&x-i>=0){
                target.push(grids[x-i][y+i])
            }
        }
    }
    getResult.call(this, target);
}
// 左上方<-->右下方判断
function leftTop(x, y, target){
    const min = x >= y ? y : x;
    const max = x >= y ? x : y;
    const minLen = GRIDROW >= GRIDCOLUMN ? GRIDROW : GRIDCOLUMN;
    const maxLen = GRIDROW >= GRIDCOLUMN ? GRIDCOLUMN : GRIDROW;
    if(min > 3 && min < minLen - 4){
        target.push(grids[x][y]);
        for(let i = 1; i <= 4; i ++){
            if(x-i>=0&&y-i>=0){
                target.push(grids[x-i][y-i]);
            }
            if(x+i<=minLen-1&&y+i<=minLen-1){
                target.push(grids[x+i][y+i]);
            }
        }
    }
    if(min <= 3){
        target.push(grids[x][y]);
        for(i = 1; i <= 4; i ++){
            if(x+i<=minLen-1&&y+i<=minLen-1){
                target.push(grids[x+i][y+i]);
            }
        }
        for(i = 1; i <= min; i ++){
            if(x-i>=0&&y-i>=0){
                target.push(grids[x-i][y-i])
            }
        }
    }
    if(min >= minLen - 4){
        target.push(grids[x][y]);;
        for(let i = 1; i <= 4; i ++){
            if(x-i>=0&&y-i>=0){
                target.push(grids[x-i][y-i]);
            }
        }
        for(let i = 1; i <= minLen-1-max; i ++){
            if(x+i<=minLen-1&&y+i<=minLen-1){
                target.push(grids[x+i][y+i]);
            }
        }
    }
    getResult.call(this, target);
}


function calcAi(){
    console.log('Ai下棋了！！！', calc)
    calc = calc.sort((a, b) => a.length - b.length);
    const target = calc[calc.length-1].sort((a,b)=>a.$y-b.$y);
    const last = target[target.length-1];
    const first = target[0];

    
    if(target.length <= 1){
        console.log(last.$x, last.$y)
        if(last.$x>=GRIDROW - 1){
            grids[last.$x-1][last.$y-1].style.background = '#eee';
            grids[last.$x-1][last.$y-1].style.boxShadow = '0 0 10px 1px #111';
            grids[last.$x-1][last.$y-1].flag = 1;
            count ++;
            calcReulst();
            return;
        }
        if(last.$y >= GRIDCOLUMN - 1){
            grids[last.$x-1][last.$y-1].style.background = '#eee';
            grids[last.$x-1][last.$y-1].style.boxShadow = '0 0 10px 1px #111';
            grids[last.$x-1][last.$y-1].flag = 1;
            count ++;
            calcReulst();
            return;
        }
        grids[last.$x+1][last.$y+1].style.background = '#eee';
        grids[last.$x+1][last.$y+1].style.boxShadow = '0 0 10px 1px #111';
        grids[last.$x+1][last.$y+1].flag = 1;
        count ++;
        calcReulst();
        return;
    }    
    if(last.$x == first.$x){
        console.log('横向')
        let next, prev;
        next = grids[last.$x][last.$y+1];
        prev = grids[first.$x][first.$y-1];
        if(next && next.flag == 0){
            next.style.background = '#eee';
            next.style.boxShadow = '0 0 10px 1px #111';
            next.flag = 1;
        }else{
            prev.style.background = '#eee';
            prev.style.boxShadow = '0 0 10px 1px #111';
            prev.flag = 1;
        }
        count ++;
        calcReulst();
        return;
    }
    if(last.$y == first.$y){
        console.log('纵向')
        let next, prev;
        next = grids[last.$x+1][last.$y];
        prev = grids[first.$x-1][first.$y];
        if(next && next.flag == 0){
            next.style.background = '#eee';
            next.style.boxShadow = '0 0 10px 1px #111';
            next.flag = 1;
        }else{
            prev.style.background = '#eee';
            prev.style.boxShadow = '0 0 10px 1px #111';
            prev.flag = 1;
        }
        count ++;
        calcReulst()
        return;

    }
    if(Math.abs(last.$y-first.$y) >= target.length - 1){
        console.log('斜向')
        let next, prev;
        if(last.$y - first.$y){
            console.log(first.$x, last.$x, '$x')
            if(first.$x - last.$x > 0){
                prev = grids[first.$x+1][first.$y-1];
                next = grids[last.$x-1][last.$y+1];
                if(next && next.flag == 0){
                    next.style.background = '#eee';
                    next.style.boxShadow = '0 0 10px 1px #111';
                    next.flag = 1;
                    count ++;
                    calcReulst();
                    return;
                }
                if(prev && prev.flag == 0){
                    prev.style.background = '#eee';
                    prev.style.boxShadow = '0 0 10px 1px #111';
                    prev.flag = 1;
                    count ++;
                    calcReulst();
                    return;
                }
            }else{
                console.log('here')
                prev = grids[first.$x-1][first.$y-1];
                next = grids[last.$x+1][last.$y+1];
                if(next && next.flag == 0){
                    next.style.background = '#eee';
                    next.style.boxShadow = '0 0 10px 1px #111';
                    next.flag = 1;
                    count ++;
                    calcReulst();
                    return;
                }
                if(prev && prev.flag == 0){
                    prev.style.background = '#eee';
                    prev.style.boxShadow = '0 0 10px 1px #111';
                    prev.flag = 1;
                    count ++;
                    calcReulst();
                    return;
                }
            }
        }
    }
}


function handleChange(e){
    AI = e.target.checked;
}

