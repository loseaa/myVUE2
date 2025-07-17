import {initData} from './init/state.js';
import {template2Function} from './render/index.js';

import {lifecycleMixin} from './lifecycle.js';
import {renderMixin} from './render/mixin.js';
import {globalApi, mergeOptions} from './globalapi/index.js';
import { callHook } from './lifecycle.js';

export function Vue(option){
    this.$el = option.el;
    this.$data = option.data;
    this.$options = option;
    this.$init();
}


lifecycleMixin(Vue)
renderMixin(Vue)
globalApi(Vue)

Vue.prototype.$init = function(){
    this.$options=mergeOptions(this.constructor.$options, this.$options);

    //调用beforeCreate
    callHook(this, 'beforeCreate');
    //做数据响应式
    initData(this);
    //调用created
    callHook(this, 'created');
    //如果制定了el，则直接渲染
    if(this.$el)
    {
        //调用beforeMount
        callHook(this, 'beforeMount');
        this.$mount(this.$el);
        //调用mounted
        callHook(this, 'mounted');
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


