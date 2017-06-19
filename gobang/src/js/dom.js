class DomChess extends Chess {
    constructor(obj={}, r, c) {
        super(obj);

        this.r = r;
        this.c = c;
        this.ele = null;
    }

    draw(color) {
        this.ele.style.backgroundColor = color;
    }
}

class GoBang {
    constructor(obj={}) {
        this.id = 'panel';
        this.owner = null;

        Object.assign(this, obj);

        this.r = this.r >= 4 ? this.r : 4;
        this.c = this.c >= 4 ? this.c : 4;

        this.d = 40;     //间隔
        this.chessArr = [];
        this.parent = document.getElementById(this.id);
        if(!parent) {
            console.error('There is no container');
            return;
        }

        this.parentEvent = this.parentEvent.bind(this);
        this.win = document.getElementById('win');

        this.init();
        this.bindEvent();
        console.log('dom')
    }

    init() {
        this.initChessBoard();
        this.initChessArr();
    }

    initChessBoard() {
        let str = '<table><tbody>',
            strdiv = '',
            rd = this.d / 2;
        for(let i = 0; i <= this.r; ++i) {
            str += '<tr>';
            for(let n = 0; n <= this.c; ++n) {
                if(n < this.c && i < this.r) {
                    str += '<td></td>';
                }
                strdiv += `<div style='top: ${i * this.d + 5}px;left: ${n * this.d + 5}px;'></div>`;
            }
            str += '</tr>';
        }
        str += '</tbody></table>' + strdiv;

        this.parent.innerHTML = str;
    }

    initChessArr() {
        for(let i = 0; i <= this.r; ++i) {
            this.chessArr[i] = [];
            for(let n = 0; n <= this.c; ++n) {
                this.chessArr[i][n] = new DomChess({
                    x: this.d * n, 
                    y: this.d * i,
                    flag: 0,
                    owner: this
                }, i, n)
            }
        }
        console.log(this.chessArr)
    }

    bindEvent() {
        this.parent.addEventListener('click', this.parentEvent)
    }

    parentEvent(e) {
        if(e.target !== this.parent && e.target.tagName.toLowerCase() === 'div') {
            let flag = this.owner ? this.owner.curChess : 1;
            this.drawChess(flag, e.target);
        }
    }

    removeEvent() {
        this.parent.removeEventListener('click', this.parentEvent)
    }

    drawChess(flag, tar, tx, ty) {
        let y = ty || parseInt(tar.style.top),
            x = tx || parseInt(tar.style.left);
        let c = ~~(x / this.d),
            r = ~~(y / this.d);

        if(c < 0 || r < 0 || c > this.c || r > this.r || this.chessArr[r][c].flag !== 0) {
            return null;
        }
        this.chessArr[r][c].flag = flag,
        this.chessArr[r][c].ele = tar;
        this.chessArr[r][c].draw(flag === 1 ? 'white' : 'black');

        this.owner && this.owner.step && this.owner.step(this.chessArr[r][c]);
    }

    clearChess(x, y) {
        let c = ~~((x - this.d / 2) / this.d),
            r = ~~((y - this.d / 2) / this.d);

        this.chessArr[r][c].ele.style.backgroundColor = 'transparent';
        this.chessArr[r][c].flag = 0;
    }

    cancelChess(x, y, flag) {
         let c = ~~((x - this.d / 2) / this.d),
            r = ~~((y - this.d / 2) / this.d);

        this.chessArr[r][c].ele.style.backgroundColor = flag === 1 ? 'white' : 'black';
        this.chessArr[r][c].flag = flag;
    }

    restart() {
        this.chessArr.forEach(row => {
            row.forEach(col => {
                col.flag = 0;
                if(col.ele) {
                    col.draw('transparent');
                    col.ele = null;
                }
            })
        })
        this.win.classList.add('hide');
        this.bindEvent();
    }

    drawLine(checkResult) {
        let win = this.win,
            list = win.classList;
        let sr = checkResult.sr,
            sc = checkResult.sc,
            er = checkResult.er,
            ec = checkResult.ec,
            top = 0,
            left = 0,
            width = Math.abs(sc - ec) * 40 + 20;
        if(sr < er && sc === ec) {
            win.classList.add('vertical');
            win.style.width = `${width}px`;
            top -= 4;
            left += 8;
        }else if(sr < er && sc < ec) {
            win.classList.add('blackslash');
            win.style.width = `${width * 1.35}px`;
        }else if(sr < er && sc > ec) {
            win.classList.add('slash');
            win.style.width = `${width * 1.35}px`;
            left += 10;
        }else if(sr === er && sc < ec){
            win.style.width = `${width}px`;
            top += 5;
        }
        top += (sr + 1) * 40;
        left += (sc + 1) * 40;
        console.log(win.style.width)
        win.style.top = `${top}px`;
        win.style.left = `${left}px`;
        list.remove('hide');
    }
}