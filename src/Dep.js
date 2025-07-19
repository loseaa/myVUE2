let id=0;

export class Dep{
    constructor(){
        this.subs=[];
        this.depIds=new Set();
        this.id=id++;
    }
    addSub(sub){
        sub.addDep(this);
        if(this.depIds.has(sub.id))
            return 
        this.depIds.add(sub.id);
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