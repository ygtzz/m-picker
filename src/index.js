import assign from 'object-assign';

function Picker(opts){
    opts = assign({
        con:'.pickerc'
    }, opts);

    this.con = document.querySelector(opts.con);
    this.movec = this.con.querySelector('.pickers');
    this.pickerItems = this.movec.querySelectorAll('.picker-item');
    this.itemLen = this.pickerItems.length;
    this.viewport = this.con.querySelector('.picker-viewport');
    this.startY = 0;
    this.lastMoveY = 0; 
    this.touching = true;
    
    //列表初始化为第一项在视口位置
    this.viewportTop = this.viewport.getBoundingClientRect().top - 
              this.con.getBoundingClientRect().top;
    this._translate(this.movec, this.viewportTop);
    this.movecHeight = this.movec.getBoundingClientRect().height;
    this.itemHeight = this.movecHeight / this.itemLen;
    this.viewport.style.height = this.itemHeight + 'px';
    
    this.con.addEventListener('touchstart',this._touchstart.bind(this));
    this.con.addEventListener('touchmove',this._touchmove.bind(this));
    this.con.addEventListener('touchend',this._touchend.bind(this));
}

Picker.prototype._touchstart = function(e){
    var touch = e.touches[0];
    this.startY = touch.pageY;
    this.lastMoveY = touch.pageY;
    this.touching = true;
}

Picker.prototype._touchmove = function(e){
    if(this.touching){
        e.preventDefault();
        var touch = e.touches[0];
        var moveY = touch.pageY,
            detlaY = moveY - this.lastMoveY;
        this._move(this.movec,detlaY);
        this.lastMoveY = moveY;
    }
}

Picker.prototype._touchend = function(e){
    this.touching = false;
    var currentY = this._getTranslate(this.movec,'y');
    var viewportTop = this.viewportTop;
    //向下超出
    var bottomBoundary = viewportTop;
    if(currentY > bottomBoundary){
        this._translate(this.movec,bottomBoundary);
    }
    //向上超出
    var topBoundary = viewportTop - this.movecHeight + this.itemHeight;
    if(currentY < topBoundary){
        this._translate(this.movec,topBoundary);
    }
    //中间未对其

}

Picker.prototype._move = function(dom,detlaY){
    // var self = this,
    //     leftBoundary = self.leftBoundary,
    //     rightBoundary = self.rightBoundary;
    //     oPlayer = self.oPlayer,
    var originY = this._getTranslate(dom,'y'),
        y = originY + detlaY;
    // x = mid(x,leftBoundary,rightBoundary);
    this._translate(dom,y);
}

Picker.prototype._translate = function(dom,y){
    dom.style.transform = 'translate3d(0,'+y+'px,0)';
    dom.style.webkitTransform = 'translate3d(0,'+y+'px,0)';
}

Picker.prototype._getTranslate = function(dom,type){
    var transform = dom.style.webkitTransform || dom.style.transform,
        reg = /translate3d\(([\w,-\s.]+)\)/,
        match = transform.match(reg),
        transRes = 0;
    if(match){
        var sTrans = match[1],
            aTrans = sTrans.split(','),
            map = {x:0,y:1,z:2};
        if(typeof(map[type]) == 'undefined'){
            throw new Error('invalid translate type');
            return;
        }
        transRes = parseInt(aTrans[map[type]]);
    }
    return transRes;    
}

function mid(mid,min,max){
    if(typeof min === undefined || min == null){
        min = Number.NEGATIVE_INFINITY;
    }
    if(typeof max == undefined || max == null){
        max = Number.POSITIVE_INFINITY;
    }
    return Math.min(Math.max(min,mid),max);
}

export {Picker};
