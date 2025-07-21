import {patch} from './vdom/index.js'
import {Watcher} from './watcher.js'
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        this.$el=patch(this.$el, vnode)

    }
}

export function mountComponent(vm,el){
    callHook(vm, 'beforeMount');
    vm._update(vm._render())
    let updateComponent=()=>{
        
        vm._update(vm._render());
    }
    new Watcher(vm,updateComponent,()=>{
        callHook(vm,"beforeUpdate")
    })

    callHook(vm, 'mounted');
}

export function callHook(vm, hook){
    let handlers = vm.$options[hook];
    if(handlers){
        handlers.forEach(handler => handler.call(vm));
    }
}
