class Game {
    constructor(aiModeTool) {
        this.toolbar = new ToolBar({
            parent: document.getElementById('container'), 
            owner: this,
            aiTool: aiModeTool
        });
        this.isAIMode = false;
        aiModeTool && this.toolbar.changeMode(1);

        this.playerChess = 2;
        this.aiChess = 1;
        this.curChess = this.playerChess;
        this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');

        this.goBang = new GoBang({
            owner: this,
            r: 15,
            c: 15,
            d: 30
        });

        if(!this.goBang) {
            return;
        }

        this.steps = [];
        this.regrets = [];
        this.direction = ['checklr', 'checktb', 'checklt', 'checkrt'];
        this.weightDirection = ['checkWeightlr', 'checkWeighttb', 'checkWeightlt', 'checkWeightrt'];
        this.isEnd = false;
        this.isAI = false;

        this.regret = this.regret.bind(this);
        this.cancelRreget = this.cancelRreget.bind(this);
        this.aiPlay = this.aiPlay.bind(this);
    }

    /*
     * mode 1: aiMode 2: selfMode
     */
    changeMode(mode) {
        this.isAIMode = mode === 1 ? true : false;
    }

    step(chess) {
        if(chess) {
            this.checkGmae(chess);
        }
        if(this.regrets.length !== 0) {
            this.regrets.length = 0;
        }
    }

    checkGmae(chess) {
        let chessArr = this.goBang.chessArr,
            count = 0,
            r = chess.r,
            c = chess.c,
            flag = chess.flag,
            sum = chessArr.length * chessArr[0].length;

        this.steps.push(chess);

        if(this.steps.length >= sum) {
            this.tied();
            return;
        }

        for(let i = 0, len = this.direction.length; i < len; ++i) {
            let checkResult = this[this.direction[i]](r, c, flag);
            if(checkResult.result) {
                checkResult.flag = chess.flag;
                this.end(checkResult);
                return;
            }
        }
        this.changeCurChess();
    }

    checklr(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sc = c,
            ec = c,
            result = false;

        for(let i = c - 1; i >= 0; --i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
                sc = i;
            }else {
                break;
            }
        }
        for(let i = c + 1; i <= this.goBang.c; ++i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
                ec = i;
            }else {
                break;
            }
        }
        if(count >= 5) {
            result = true;
        }

        return {
            sr: r,
            sc: sc,
            er: r,
            ec: ec,
            result: result
        };
    }

    checktb(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sr = r,
            er = r,
            result = false;

        for(let i = r - 1; i >= 0; --i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
                sr = i;
            }else {
                break;
            }
        }
        for(let i = r + 1; i <= this.goBang.r; ++i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
                er = i;
            }else {
                break;
            }
        }
        if(count >= 5) {
            result = true;
        }

        return {
            sr: sr,
            sc: c,
            er: er,
            ec: c,
            result: result
        };
    }

    checklt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sr = r,
            sc = c,
            er = r,
            ec = c,
            result = false;

        for(let i = r - 1, n = c - 1; i >= 0 && n >= 0; --i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                sr = i;
                sc = n;
            }else {
                break;
            }
        }
        for(let i = r + 1, n = c + 1; i <= this.goBang.r && n <= this.goBang.c; ++i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                er = i;
                ec = n;
            }else {
                break;
            }
        }
        if(count >= 5) {
            result = true;
        }

        return {
            sr: sr,
            sc: sc,
            er: er,
            ec: ec,
            result: result
        };
    }

    checkrt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sr = r,
            sc = c,
            er = r,
            ec = c,
            result = false;

        for(let i = r - 1, n = c + 1; i >= 0 && n <= this.goBang.c; --i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                sr = i;
                sc = n;
            }else {
                break;
            }
        }
        for(let i = r + 1, n = c - 1; i <= this.goBang.r && n >= 0; ++i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                er = i;
                ec = n;
            }else {
                break;
            }
        }
        if(count >= 5) {
            result = true;
        }

        return {
            sr: sr,
            sc: sc,
            er: er,
            ec: ec,
            result: result
        };
    }

    regret() {
        if(this.isEnd) {
            alert('游戏已结束');
            return;
        }
        if(this.steps.length === 0) {
            alert('棋盘上没有可以反悔的棋子了');
            return;
        }
        let i = 0,
            loop = this.isAIMode ? 2 : 1;
        while(i < loop) {
            let chess = this.steps.pop();
            this.regrets.push({
                chess: chess,
                oriFlag: chess.flag
            });

            this.goBang.clearChess(chess);
            ++i;
        }
    }

    cancelRreget() {
        if(this.isEnd) {
            alert('游戏已结束');
            return;
        }
        if(this.regrets.length === 0) {
            alert('没有反悔的棋子哦');
            return;
        }
        let i = 0,
            loop = this.isAIMode ? 2 : 1;
        while(i < loop) {
            let newChess = this.regrets.pop();
            this.steps.push(newChess.chess);
            console.log(newChess)
            this.goBang.cancelChess(newChess, newChess.oriFlag);
            ++i;
        }
    }

    restart() {
        console.log(this)
        this.goBang.restart();
        this.isEnd = false;
        this.regrets.length = 0;
        this.steps.length = 0;
        this.isAI = false;
        this.curChess = this.playerChess;
        this.toolbar.changeCur('black');
    }

    async changeCurChess() {
        this.curChess = this.curChess === 1 ? 2 : 1;
        this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');
        this.isAI = this.isAIMode ? !this.isAI : false;
        if(this.isAIMode && this.isAI) {
            await this.sleep(500);
            this.aiPlay();
        }
    }

    aiPlay() {
        let chess = this.maxWeightChess();
        console.log(chess)
        this.goBang.drawChess(chess.r, chess.c, this.curChess, 0);
    }

    maxWeightChess() {
        let chessArr = this.goBang.chessArr,
            chess = null,
            maxWeight = -1;
        for(let i = 0, len1 = chessArr.length; i < len1; ++i) {
            for(let n = 0, len2 = chessArr[0].length; n < len2; ++n) {
                if(chessArr[i][n].flag === 0) {
                    let aiWeight = 0,
                        playWeight = 0,
                        weight = 0;
                    for(let j = 0, len = this.weightDirection.length; j < len; ++j) {
                        let aiResult = this[this.weightDirection[j]](i, n, this.aiChess);
                        let playResult = this[this.weightDirection[j]](i, n, this.playerChess);
                        aiWeight += this.calcWeight(aiResult, true);
                        playWeight += this.calcWeight(playResult, false);
                    }
                    weight = aiWeight > playWeight ? aiWeight : playWeight;
                    if(maxWeight < weight) {
                        maxWeight = weight;
                        chess = chessArr[i][n];
                    }
                }
            }
        }
        return chess;
    }

    checkWeightlr(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = c - 1; i >= 0; --i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
            }else {
                if(chessArr[r][i].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = c + 1; i <= this.goBang.c; ++i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
            }else {
                if(chessArr[r][i].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    checkWeighttb(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = r - 1; i >= 0; --i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][c].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = r + 1; i <= this.goBang.r; ++i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][c].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    checkWeightlt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = r - 1, n = c - 1; i >= 0 && n >= 0; --i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = r + 1, n = c + 1; i <= this.goBang.r && n <= this.goBang.c; ++i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    checkWeightrt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = r - 1, n = c + 1; i >= 0 && n <= this.goBang.c; --i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = r + 1, n = c - 1; i <= this.goBang.r && n >= 0; ++i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    calcWeight(obj, isAI) {
        let weight = 0,
            count = obj.count,
            side1 = obj.side1,
            side2 = obj.side2;
            // console.log(this.isAI)
        switch(count) {
            case 1:
                if(side1 && side2) {
                    // weight = this.isAI ? 15 : 10; 
                    weight = isAI ? 15 : 10; 
                }
                break;
            case 2:
                if(side1 && side2) {
                    weight =isAI ? 100 : 50; 
                }else if(side1 || side2) {
                    weight = this.isAI ? 10 : 5; 
                }
                break;
            case 3:
                if(side1 && side2) {
                    weight =isAI ? 500 : 200; 
                }else if(side1 || side2) {
                    weight = isAI ? 30 : 20; 
                }
                break;
            case 4:
                if(side1 && side2) {
                    weight = isAI ? 5000 : 2000; 
                }else if(side1 || side2) {
                    weight = isAI ? 400 : 100; 
                }
                break;
            case 5:
                weight = isAI ? 1000000 : 10000; 
            default:
                weight = isAI ? 500000 : 250000; 
        }
        return weight;
    }

    drawLine(res) {
        this.goBang.drawLine(res)
    }

    sleep(time) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), time);
        })
    }

    async end(checkResult) {
        this.isEnd = true;
        this.drawLine(checkResult);
        let color = checkResult.flag === 1 ? '白' : '黑';
        await this.sleep(500);
        alert(`${color}棋手胜`);
    }

    async tied() {
        this.isEnd = true;
        await this.sleep(500);
        alert('平局');
    }
}

