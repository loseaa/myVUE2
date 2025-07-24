let id = 0;
import { nextTick } from './util.js';
import { popTarget, pushTarget } from './Dep.js'
import{Dep} from './Dep.js'
export class Watcher {
    constructor(vm, exprOrFn, cb, option = false) {

        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.user = option.user;
        this.lazy = option.lazy;
        this.dirty = option.lazy;
        this.id = id++;
        this.deps = [];
        this.depIds = new Set();
        if (typeof this.exprOrFn == "function") {
            this.getter = this.exprOrFn.bind(this.vm);
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
        if (!this.lazy) {
            this.value = this.get()
        }
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
        } else {
            this.cb();
        }
        this.value = newValue;
    }
    update() {
        if (this.lazy) {
            this.dirty = true
        } else
            queueWatcher(this)
    }

    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    addDep(dep) {
        if (this.depIds.has(dep.id))
            return
        this.depIds.add(dep.id);
        this.deps.push(dep);
    }
    depend(){
        this.deps.forEach(dep=>dep.addSub(Dep.target));
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