import {patch} from './vdom/index.js'
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        patch(this.$el, vnode)
    }
}

export function callHook(vm, hook){
    let handlers = vm.$options[hook];
    if(handlers){
        handlers.forEach(handler => handler.call(vm));
    }
}
