import {Dep} from '../Dep.js'


export function initData(vm){
    //用户输入的data可能是一个对象 或者函数
    typeof vm.$data === 'function' ? vm.$data = vm.$data() : vm.$data;
    observer(vm.$data);

    //将data代理到vm上
    for(let key in vm.$data){
        proxy(vm,key);
    }

}


function proxy(vm,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm.$data[key];
        },
        set(newVal){
            vm.$data[key]=newVal;
        }
    })
}

import {arrmethods} from '../array.js';


function observer(obj){
    if(typeof obj !== 'object' || obj === null){
        return 
    }
    if(obj.__ob__)
        return obj;
    return new Observer(obj);
}

function defineReactive(obj,key,value){
    let ob=observer(value);
    let dep=new Dep();
    Object.defineProperty(obj,key,{
        get(){
            if(Dep.target){
                dep.addSub(Dep.target);
                if(ob){
                    ob.dep.addSub(Dep.target);
                }
            }
            return value;
        },
        set(newVal){
            
            if(newVal === value){
                return;
            }
            observer(newVal)
            value =newVal;
            dep.notify()
        }
    })
}

class Observer{
    constructor(obj){
        this.value = obj;
        this.dep=new Dep()
        Object.defineProperty(this.value,"__ob__",{
            value:this,
            enumerable:false,
            writable:true,
            configurable:true
        })
        if(Array.isArray(obj)){
            this.observerArray()
            obj.__proto__=arrmethods;
        }
        else{
            this.walk(obj);
        }
    }
    walk(obj){
        for(let key in obj){
            defineReactive(obj,key,obj[key]);
        }
    }
    observerArray(){
        this.value.forEach(item => {
            observer(item);
        })
    }
}
