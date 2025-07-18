let id = 0;
import {  popTarget, pushTarget } from './Dep.js'
export class Watcher {
    constructor(vm, exprOrFn, cb) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.id = id++;
        if (typeof this.exprOrFn == "function") {
            this.getter = this.exprOrFn;
        }
        this.get()
        
    }
    get() {
        pushTarget(this);
        this.getter()
        popTarget()
    }
    update() {
        this.get()
    }
}