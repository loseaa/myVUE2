import { Dep } from '../Dep.js'
import { nextTick } from "../util.js"
import { Watcher } from '../watcher.js'


export function initData(vm) {
    //用户输入的data可能是一个对象 或者函数
    typeof vm.$data === 'function' ? vm.$data = vm.$data() : vm.$data;
    observer(vm.$data);
    //将data代理到vm上
    for (let key in vm.$data) {
        proxy(vm, key);
    }
}

export function initWatch(vm) {
    let watch = vm.$options.watch
    if (watch) {
        for (let key in watch) {
            if (Array.isArray(watch[key])) {//如果是一个函数数组的话
                watch[key].forEach(handler => {
                    createWatcher(vm, key, handler);
                })
            }
            else {
                createWatcher(vm, key, watch[key]);
            }
        }
    }
}

export function initComputed(vm) {
    let computed = vm.$options.computed;
    let watchers = vm._computedWatchers = {}
    for (let key in computed) {
        let makefull = {}
        let userDef;
        if (typeof computed[key] == 'function') {
            makefull = {
                get: createComputedGetter(key)
            }
            userDef=computed[key]
        }
        else {
            makefull.get = createComputedGetter(key)
            makefull.set = computed[key].set;
            userDef=computed[key].get;
        }
        watchers[key] = new Watcher(vm, userDef, () => { }, { lazy: true })
        defineComputed(vm, key, makefull)
    }
}

function defineComputed(vm, key, makefull) {
    Object.defineProperty(vm, key, makefull)
}

function createComputedGetter(key) {
    return function () {
        let watcher = this._computedWatchers[key];
        //脏了就去取值
        if (watcher.dirty) {
            watcher.evaluate();
        }
        if (Dep.target) {
            watcher.depend();
        }
        return watcher.value;
    }
}

function createWatcher(vm, key, handler) {
    let option = {}
    if (typeof handler == "string") {
        handler = vm[handler];
    }
    else if (typeof handler == "object") {
        option = handler;
        handler = handler.handler
    }

    vm.$watch(key, handler, option);
}

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (fn) {
        nextTick(fn);
    }
    Vue.prototype.$watch = function (exprOrfn, callback, option) {
        new Watcher(this, exprOrfn, callback, { ...option, user: true });
    }
}


function proxy(vm, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm.$data[key];
        },
        set(newVal) {
            vm.$data[key] = newVal;
        }
    })
}

import { arrmethods } from '../array.js';
import { lazy } from 'react';


function observer(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return
    }
    if (obj.__ob__)
        return obj;
    return new Observer(obj);
}

function defineReactive(obj, key, value) {
    let ob = observer(value);
    let dep = new Dep();
    Object.defineProperty(obj, key, {
        get() {
            if (Dep.target) {
                dep.addSub(Dep.target);
                if (ob) {
                    ob.dep.addSub(Dep.target);
                }
            }
            return value;
        },
        set(newVal) {

            if (newVal === value) {
                return;
            }
            observer(newVal)
            value = newVal;
            dep.notify()
        }
    })
}

class Observer {
    constructor(obj) {
        this.value = obj;
        this.dep = new Dep()
        Object.defineProperty(this.value, "__ob__", {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        })
        if (Array.isArray(obj)) {
            this.observerArray()
            obj.__proto__ = arrmethods;
        }
        else {
            this.walk(obj);
        }
    }
    walk(obj) {
        for (let key in obj) {
            defineReactive(obj, key, obj[key]);
        }
    }
    observerArray() {
        this.value.forEach(item => {
            observer(item);
        })
    }
}
