import {initData} from './init/state.js';

export function Vue(option){
    this.$el = option.el;
    this.$data = option.data;
    this.$options = option;
    this.$init();
}

Vue.prototype.$init = function(){
    initData(this);
}

