import { initData, initWatch } from './init/state.js';
import {patch,createEle} from './vdom/index.js'

import { template2Function } from './render/index.js';
import { mountComponent } from './lifecycle.js';
import { lifecycleMixin } from './lifecycle.js';
import { renderMixin } from './render/mixin.js';
import { globalApi, mergeOptions } from './globalapi/index.js';
import { callHook } from './lifecycle.js';
import { stateMixin } from './init/state.js';

export function Vue(option) {
    this.$el = option.el;
    this.$data = option.data;
    this.$options = option;
    this.$init();
}


lifecycleMixin(Vue)
renderMixin(Vue)
globalApi(Vue)
stateMixin(Vue)






    

Vue.prototype.$init = function () {
    this.$options = mergeOptions(this.constructor.$options, this.$options);

    //调用beforeCreate
    callHook(this, 'beforeCreate');
    //做数据响应式
    initData(this);
    initWatch(this);
    //调用created
    callHook(this, 'created');
    //如果制定了el，则直接渲染
    if (this.$el) {
        //调用beforeMount
        callHook(this, 'beforeMount');
        this.$mount(this.$el);
        //调用mounted
        callHook(this, 'mounted');
    }

}

Vue.prototype.$mount = function (el) {
    //处理template  el  和 render函数
    const vm = this;
    if (!this.$options.render) {
        let template = this.$options.template;
        if (!template && this.$options.el) {
            template = document.querySelector(this.$options.el).outerHTML;
        }

        this.$options.render = template2Function(template);
    }
    this.$el = document.querySelector(el)


    mountComponent(vm, el);
}


//测试patch功能
    let vm1 = new Vue({
        data(){
            return{
                a:1,
                b:2,
            }
        }
    })
    let render1=template2Function("<div style='color:red' x='1'>{{a}}</div>")
    let vnode1=render1.call(vm1)

    document.body.appendChild(createEle(vnode1))
    
    let vm2 = new Vue({
        data(){
            return{
                a:1,
                b:2,
            }
        }
    })
    let render2=template2Function("<div style='background:blue' class='a' y='2'></div>")
    let vnode2=render2.call(vm2)
setTimeout(()=>{
    patch(vnode1,vnode2)
},1000)
