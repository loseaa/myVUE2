let id = 0;
import { popTarget, pushTarget } from './Dep.js'
export class Watcher {
    constructor(vm, exprOrFn, cb) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.id = id++;
        this.deps = [];
        this.depIds = new Set();
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
        watcher.get()
        
    })
    has={}
    pending=false
    queue = []
}
let pending = false
let has={}
function queueWatcher(watcher) {
    if(has[watcher.id])
        return
    has[watcher.id]=true
    queue.push(watcher);
    
    if (!pending) {
        setTimeout(() => {
            flushQueue()
        }, 0);
        pending = true
    }

}