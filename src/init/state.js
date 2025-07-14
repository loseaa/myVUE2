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
        return obj;
    }
    if(obj.__ob__)
        return obj;
    return new Observer(obj);
}

function defineReactive(obj,key,value){
    observer(value);

    Object.defineProperty(obj,key,{
        get(){
            console.log('get');
            return value;
        },
        set(newVal){
            console.log("set");
            if(newVal === value){
                return;
            }
            observer(newVal)
            value =newVal;
        }
    })
}

class Observer{
    constructor(obj){
        this.value = obj;
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
