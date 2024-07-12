function Picker(opts){
    opts = Object.assign({
        con:'.pickerc',
        data: [],
        change: function(){}
    }, opts);

    var self = this;
    this.opts = opts;
    //插入html
    this._build();
    //获取dom
    this.pickerc = document.querySelector(opts.con);
    this.con = this.pickerc.querySelector('.pickerwheelc');
    this.viewport = this.con.querySelector('.picker-viewport');
    //下一步思路
    //1.将滑动数据用数组保存
    //2.将位置尺寸数据用数组保存
    // this.startY = 0;
    // this.lastMoveY = 0; 
    // this.touching = true;
    // this.touchStart = 0;
    this.transTime = 700;
    this.touches = [];
    // this.movec = this.con.querySelector('.pickers');
    // this.pickerItems = this.movec.querySelectorAll('.picker-item');
    // this.itemLen = this.pickerItems.length;
    this.wheels = Array.from(this.pickerc.querySelectorAll('.picker-wheel'));
    this.wheels.forEach(function(item,index){
        self.touches[index] = {
            startY: 0,
            lastMoveY: 0,
            touching: true,
            touchStart: 0
        }
        item.addEventListener('touchstart',self._touchstart.bind(self,item,index));
        // item.addEventListener('touchmove',self._touchmove.bind(self,item,index));
        item.addEventListener('touchmove',self._touchmove.bind(self));
        item.addEventListener('touchend',self._touchend.bind(self,item,index));
    });
    //列表初始化为第一项在视口位置
    // self.viewportTop = self.viewport.getBoundingClientRect().top - self.con.getBoundingClientRect().top;
    // self._translate(self.movec, self.viewportTop);
    // self.movecHeight = self.movec.getBoundingClientRect().height;
    // self.itemHeight = self.movecHeight / self.itemLen;
    // self.viewport.style.height = self.itemHeight + 'px';
    
    // this.con.addEventListener('touchstart',this._touchstart.bind(this));
    // this.con.addEventListener('touchmove',this._touchmove.bind(this));
    // this.con.addEventListener('touchend',this._touchend.bind(this));
}

Picker.prototype._build = function(){
    var data = this.opts.data;
    if(!Array.isArray(data)){
        throw new Error('picker data must be a array');
        return;
    }
    var len = data.length,
        width = 100/len + '%';
    var wheelHtml = data.map(function(item){
        if(!Array.isArray(item)){
            throw new Error('picker data must be a 2d array');
        }
        var itemHtml;
        if(typeof item[0] == 'string'){
            itemHtml = item.map(function(item){
                return '<li class="picker-item">' + item + '</li>'
            });
        }
        else{
            itemHtml = item.map(function(item){
                return '<li data-id="' + item.id + '" class="picker-item">' + item.value + '</li>'
            });
        }
        itemHtml = itemHtml.join('');
        return `<div class="picker-wheel" style="width:${width}">
                    <ul class="pickers">
                        ${itemHtml}
                    </ul>
                </div>`;
    }).join('');
    var pickerHtml = `<div class="pickerc">
                        <div class="pickerwheelc">
                            <div class="picker-wheels">
                                ${wheelHtml}
                            </div>
                            <div class="picker-viewport"></div>
                            <div class="picker-wheelmask"></div>
                        </div>
                        <div class="picker-pagemask"></div>
                    </div>`;

    document.body.insertAdjacentHTML('beforeend',pickerHtml);
}

Picker.prototype._touchstart = function(item,index,e){
    console.log(item,index);
    var touch = e.touches[0];
    this.startY = touch.pageY;
    this.lastMoveY = touch.pageY;
    this.touching = true;
    this.touchStart = +new Date();
    //set active wheel
    this.movec = item.querySelector('.pickers');
    this.pickerItems = item.querySelectorAll('.picker-item');
    this.itemLen = this.pickerItems.length;

    var self = this;
    self.viewportTop = self.viewport.getBoundingClientRect().top - self.con.getBoundingClientRect().top;
    self._translate(self.movec, self.viewportTop);
    self.movecHeight = self.movec.getBoundingClientRect().height;
    self.itemHeight = self.movecHeight / self.itemLen;
    self.viewport.style.height = self.itemHeight + 'px';
}

Picker.prototype._touchmove = function(e){
    if(this.touching){
        e.preventDefault();
        var touch = e.touches[0];
        var moveY = touch.pageY,
            detlaY = moveY - this.lastMoveY;
        this._move(this.movec,detlaY);
        this.lastMoveY = moveY;
        this.detlaY = detlaY;
    }
}

Picker.prototype._touchend = function(e){
    var self = this;
    this.touching = false;
 
    var touchEnd = +new Date();
    //小于300，快滑
    var interiaRatio = 7;
    if(touchEnd - this.touchStart < 300){
        this._translateTime(this.movec, this.detlaY * interiaRatio, 700, function(){
            self._fixScroll();
        });
    }
    //慢滑
    else{
        self._fixScroll();
    }
}

Picker.prototype._fixScroll = function(){
    var currentY = this._getTranslate(this.movec,'y');
    var viewportTop = this.viewportTop;
    var transTime = this.transTime;
    //向下超出
    var bottomBoundary = viewportTop;
    //向上超出
    var topBoundary = viewportTop - this.movecHeight + this.itemHeight;
    var activeIndex;
    if(currentY > bottomBoundary){
        this._translateTime(this.movec, bottomBoundary - currentY, transTime);
        activeIndex = 0;
    }
    else if(currentY < topBoundary){
        this._translateTime(this.movec, topBoundary - currentY, transTime);
        activeIndex = this.itemLen - 1;
    }
    else{
        //中间未对其
        for(var i=0;i<this.itemLen;i++){
            var bottom = viewportTop - i * this.itemHeight,
                top = viewportTop - (i+1) * this.itemHeight;
            if(top < currentY && currentY <= bottom){
                if(Math.abs(top - currentY) < Math.abs(currentY - bottom)){
                    this._translateTime(this.movec, top - currentY, transTime);
                    activeIndex = i+1;
                }
                else{
                    this._translateTime(this.movec, bottom - currentY, transTime);
                    activeIndex = i;
                }
            }
        }
    }
    this._changeActiveItem(activeIndex);
    // this._fixRotate(activeIndex);
}

Picker.prototype._changeActiveItem = function(activeIndex){
    //active item激活
    for(var i=0;i<this.itemLen;i++){
        this._removeClass(this.pickerItems[i],'active');
    }
    this._addClass(this.pickerItems[activeIndex],'active');
    //todo 添加activeItem content
    //this.change(activeIndex);
}

Picker.prototype._fixRotate = function(activeIndex){
    var pickerItems = this.pickerItems,
        itemLen = this.itemLen;
    for(var i=0;i<itemLen;i++){
        pickerItems[i].style.transform = 'rotateX(' + (i-activeIndex) * 25 + 'deg)';
    }
}

Picker.prototype._move = function(dom,detlaY){
    var originY = this._getTranslate(dom,'y'),
        y = originY + detlaY;
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

Picker.prototype._transitionTime = function(dom,time){
    dom.style.transitionDuration = time + 'ms';
    dom.style.webKitTransitionDuration = time + 'ms';
}

Picker.prototype._translateTime = function(dom,distance,time,callback){
    var self = this;
    self._transitionTime(dom,time);
    self._move(dom,distance);


    dom.addEventListener('transitionend', function(){
        self._transitionTime(dom, 0);
        callback && callback();
    }, {once:true})

    // addTransitionEndOnce(dom,function(){
    //     self._transitionTime(dom, 0);
    //     callback && callback();
    // },time);
}

Picker.prototype._translateTimeAbs = function(dom,distance,time,callback){
    var self = this;
    self._transitionTime(dom,time);
    self._translate(dom,distance);


    dom.addEventListener('transitionend', function(){
        self._transitionTime(dom, 0);
        callback && callback();
    }, {once:true})

    // addTransitionEndOnce(dom,function(){
    //     self._transitionTime(dom, 0);
    //     callback && callback();
    // },time);
}

Picker.prototype._addClass = function(dom,className){
    dom.classList.add(className);
}

Picker.prototype._removeClass = function(dom,className){
    dom.classList.remove(className);
}

// var	transitionEnd=(function(){
//     var body=document.body || document.documentElement,
//         style=body.style;
//     var transEndEventNames = {
//         WebkitTransition : 'webkitTransitionEnd',
//         MozTransition    : 'transitionend',
//         OTransition      : 'oTransitionEnd otransitionend',
//         transition       : 'transitionend'
//     }
//     for(var name in transEndEventNames){
//         if(typeof style[name] === "string"){
//             return transEndEventNames[name]
//         }
//     }
// })();

// function addTransitionEndOnce(elem,fn,duration){	
//     var called = false;
//     var callback = function(){
//         if (!called){
//             fn();
//             called = true;
//         }
//     };
//     var callbackEnd = function(){
//         callback();
//         setTimeout(callback, duration);
//         elem.removeEventListener(transitionEnd, callbackEnd);
//     }
//     elem.addEventListener(transitionEnd, callbackEnd);
// }

function mid(mid,min,max){
    if(typeof min === undefined || min == null){
        min = Number.NEGATIVE_INFINITY;
    }
    if(typeof max == undefined || max == null){
        max = Number.POSITIVE_INFINITY;
    }
    return Math.min(Math.max(min,mid),max);
}