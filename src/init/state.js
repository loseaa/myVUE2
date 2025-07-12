export function initData(vm){
    //用户输入的data可能是一个对象 或者函数
    typeof vm.$data === 'function' ? vm.$data = vm.$data() : vm.$data;
    observer(vm.$data);
}

function observer(obj){
    if(typeof obj !== 'object' || obj === null){
        return obj;
    }
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
        this.walk(obj);
    }
    walk(obj){
        for(let key in obj){
            defineReactive(obj,key,obj[key]);
        }
    }
}
