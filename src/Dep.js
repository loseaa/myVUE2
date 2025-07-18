export class Dep{
    constructor(){
        this.subs=[];
    }
    addSub(sub){
        this.subs.push(sub);
    }
    notify(){
        this.subs.forEach(sub=>sub.update());
    }
}
Dep.target=null;

export function pushTarget(target){
    Dep.target=target;
}
export function popTarget(){
    Dep.target=null;
}