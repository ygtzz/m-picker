function Picker(opts){
    opts = Object.assign({
        con:'.pickerc',
        data: [],
        change: function(){}
    }, opts);

    var self = this;
    this.opts = opts;
    this.defaultIndex = this.opts.data.map(t => 1);
    //插入html
    this._build();
    //获取dom
    this.pickerc = document.querySelector(opts.con);
    this.wheelc = this.pickerc.querySelector('.pickerwheelc');
    this.viewport = this.wheelc.querySelector('.picker-viewport');

    let movec = this.wheelc.querySelector('.pickers');
    let movecHeight = movec.getBoundingClientRect().height;
    this.height = movecHeight;
    this.itemHeight = movecHeight / movec.children.length;
    this.viewport.style.setProperty('--h', this.itemHeight + 'px');
    this.viewportTop = this.viewport.getBoundingClientRect().top - this.wheelc.getBoundingClientRect().top;

    this.transTime = 300;
    this.touches = [];

    //初始值应该是每列的中间项目
    this.activeIndexs = opts.data.map(t => {
        return Math.ceil(t.length/2);
    })
    console.log("🚀 ~ Picker ~ activeIndexs:", this.activeIndexs)
    // this.itemHeight = 36;

    this.wheels = Array.from(this.pickerc.querySelectorAll('.picker-wheel'));
    this.wheels.forEach((item,index) => {
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

        this.movec = item.querySelector('.pickers');
        this._setActiveItem(this.defaultIndex[index]);
    });

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
    // this.touching = true;
    this.touchStart = +new Date();
    //set active wheel
    this.movec = item.querySelector('.pickers');
    // this.pickerItems = item.querySelectorAll('.picker-item');
    this.itemLen = this.movec.children.length;

    // self._translate(self.movec, self.viewportTop);
    this.movecHeight = this.movec.getBoundingClientRect().height;
    this.itemHeight = this.movecHeight / this.itemLen;
    this.viewport.style.height = this.itemHeight + 'px';
}

Picker.prototype._touchmove = function(e){
    // if(this.touching){
        e.preventDefault();
        var touch = e.touches[0];
        var moveY = touch.pageY,
            detlaY = moveY - this.lastMoveY;
        this._move(this.movec, detlaY);
        this.lastMoveY = moveY;
        this.detlaY = detlaY;
    // }
}

Picker.prototype._touchend = function(e){
    var self = this;
    this.touching = false;
 
    var touchEnd = +new Date();
    //小于300，快滑
    var interiaRatio = 0.5;
    if(touchEnd - this.touchStart < 300){
        console.log('快滑');
        this._translateTime(this.movec, this.detlaY * interiaRatio, 700, function(){
            self._fixScroll();
        });
    }
    //慢滑
    else{
        console.log('慢滑');
        self._fixScroll();
    }
}

Picker.prototype._fixScroll = function(activeIndex){
    var currentY = this._getTranslate(this.movec, 'y');
    console.log("🚀 ~ currentY:", currentY)
    var viewportTop = this.viewportTop;
    var transTime = this.transTime;
    //向下超出
    var bottomBoundary = viewportTop;
    //向上超出
    var topBoundary = viewportTop - this.movecHeight + this.itemHeight;
    var activeIndex = activeIndex || 0;
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
    console.log("🚀 ~ activeIndex:", activeIndex)
    this._changeActiveItem(activeIndex);
}

Picker.prototype._changeActiveItem = function(activeIndex){
    this.movec.querySelector('.active')?.classList.remove('active');
    this.movec.children[activeIndex]?.classList.add('active');

    //todo 添加activeItem content
    //this.change(activeIndex);
}

Picker.prototype._setActiveItem = function(activeIndex){
    activeIndex = activeIndex - 1;
    // height 列高，itemHeight 行高，selectedIndex 当前列选中的索引
    this._translateTime(this.movec, this.height/2 - this.itemHeight - activeIndex * this.itemHeight);
    this._changeActiveItem(activeIndex);
}

Picker.prototype._move = function(dom,detlaY){
    let originY = this._getTranslate(dom,'y');
    let y = originY + detlaY;

    this._translate(dom, y);
}

Picker.prototype._translate = function(dom,y){
    dom.style.webkitTransform = dom.style.transform = 'translate3d(0,'+y+'px,0)';
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

Picker.prototype._translateTime = function(dom,distance,time,callback){
    var self = this;
    dom.style.transitionDuration = dom.style.webKitTransitionDuration = time + 'ms';

    self._move(dom,distance);

    dom.addEventListener('transitionend', function(){
        dom.style.transitionDuration = dom.style.webKitTransitionDuration = time + 'ms';
        callback && callback();
    }, {once:true})
}