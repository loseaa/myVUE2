let id = 0;
import { nextTick } from './util.js';
import { popTarget, pushTarget } from './Dep.js'
export class Watcher {
    constructor(vm, exprOrFn, cb, option = false) {

        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.user = option.user;
        this.id = id++;
        this.deps = [];
        this.depIds = new Set();
        if (typeof this.exprOrFn == "function") {
            this.getter = this.exprOrFn;

        }
        else {
            this.getter = function () {
                let obj = this.vm
                let path = this.exprOrFn.split(".")
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                    if (!obj)
                        return
                }
                return obj
            }
        }
        this.value = this.get()

    }
    get() {
        pushTarget(this);
        let res = this.getter();
        popTarget()
        return res;
    }

    run() {
        let oldValue = this.value;
        let newValue = this.get();
        if (this.user) {
            this.cb(newValue, oldValue)
        }
        this.value = newValue;
    }
    update() {
        queueWatcher(this)
    }
    addDep(dep) {
        if (this.depIds.has(dep.id))
            return
        this.depIds.add(dep.id);
        this.deps.push(dep);
    }
}
let queue = []
function flushQueue() {
    queue.forEach(watcher => {
        watcher.run()

    })
    has = {}
    pending = false
    queue = []
}
let pending = false
let has = {}
function queueWatcher(watcher) {
    if (has[watcher.id])
        return
    has[watcher.id] = true
    queue.push(watcher);
    if (!pending) {
        nextTick(flushQueue)
        pending = true
    }
}