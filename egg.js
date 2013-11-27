!function () {
    'use strict;'

    var root = this;

    'use strict';

    var util = require('util'),
        _ = require('underscore');

    var egg = util.bindAll({

        curEgg: null,

        count: 0,

        triggerCount: 4,

        eggSelectorName: '.onegg',

        eggCallback: null,

        // begin time
        time: 0,
        // 限制时间
        timeLimit: 3000, // 毫秒ms

        handlers: [],

        init: function () {
            this.onegg(this.eggSelectorName, this.oneggtrigger);
        },
        destroy: function () {
            this.offegg(this.eggSelectorName, this.oneggtrigger);
        },
        /**
         *   取消某次监听
         */
        offegg: function (selector, callback) {
            var newHandlers = [],
                _this = this;

            _.each(this.handlers, function (item, index) {
                if (item.callback === callback) {
                    /**
                     *   handerl 与 callback不同，handler为模块的彩蛋处理句柄，
                     *   callback为回调函数
                     */
                    $('body').off('click ' + item.selector, item.handler);
                    _this.handlers[index] = null;
                    // _this.handlers = util.without(_this.handlers, index);
                }
            });
            // 移除为null的项
            this.handlers = util.compact(this.handlers);
        },
        /**
          *   绑定彩蛋事件
          */ 
        onegg: function (selector, callback) {
            var _this = this;
            // 使用事件代理
            $('body').on('click ' + selector, this.createHandler(selector, callback, 
                function (e) {
                    var $curTar = util.is(e.target, selector);
                    if (!$curTar) return;
                    // 彩蛋的触发点已经开始了
                    if (!_this.isTimeout() && $curTar[0] === $(_this.curEgg)[0]) {
                        if (_this.jude()) {
                            _this.clearBegin();
                            callback && callback();
                        }
                    } else {
                        // hoist住callback
                        _this.tapBegin($curTar, callback);
                    }
                }
            ));
        },
        /**
         *   本模块监听的全局彩蛋触发事件处理器
         */
        oneggtrigger: function (e) {
            alert('丹燕是超级大美女');
        },
        /**
         *  彩蛋绑定记录，保留至destroy时清空
         */
        createHandler: function (selector, callback, handler) {
            this.handlers.push({
                selector: selector,
                handler: handler,
                callback: callback
            });
            return handler;
        },
        /**
         *   初始开始状态
         */
        tapBegin: function (target, callback) {
            this.curEgg = target;
            this.count = 0;
            this.eggCallback = callback;
            this.time = (new Date).getTime();
        },
        /**
         *   清零开始条件
         */
        clearBegin: function () {
            this.curEgg = null;
            this.count = 0;
            this.eggCallback = null;
            this.time = 0;
        },
        /**
         *   包含步骤操作与界限判断
         */
        jude: function () {
            this.count ++;
            // console.log(this.count)
            if ( (this.count + 1 ) >= this.triggerCount) {
                return true;
            }
            return false;
        },
        /**
         *   判断是否超市
         */
        isTimeout: function () {
            if (!this.time) return true;
            return ((new Date).getTime() - this.time) > this.timeLimit ? true:false;
        }
    });

    var exportModule = egg;
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = exportModule;
        }
        exports.exportModule = exportModule;
    } else {
        root.exportModule = exportModule;
    }
    
}();
