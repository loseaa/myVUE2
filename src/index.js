import {initData} from './init/state.js';
import {template2Function} from './render/index.js';

import {lifecycleMixin} from './lifecycle.js';
import {renderMixin} from './render/mixin.js';


export function Vue(option){
    this.$el = option.el;
    this.$data = option.data;
    this.$options = option;
    this.$init();
}

lifecycleMixin(Vue)
renderMixin(Vue)

Vue.prototype.$init = function(){

    //做数据响应式
    initData(this);
    //如果制定了el，则直接渲染
    if(this.$el)
    {
        this.$mount(this.$el);
    }
    
}

Vue.prototype.$mount = function(el){
    //处理template  el  和 render函数
    const vm=this;
    if(!this.$options.render)
    {
        let template=this.$options.template;
        if(!template&&this.$options.el)
        {
            template=document.querySelector(this.$options.el).outerHTML;
        }
 
        this.$options.render=template2Function(template);
    }
    this.$el=document.querySelector(el)
    vm._update(vm._render())
}


