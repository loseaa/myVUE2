const oldArrayMethods = Array.prototype;
export const arrmethods=Object.create(oldArrayMethods);

let methods=[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
methods.forEach((method)=>{
    arrmethods[method]=function(...Args){
        let  insertArr;
        switch(method){
            case 'push':
            case 'unshift':
                insertArr=Args;
                break;
            case 'splice':
                insertArr=Args.slice(2);
                break;
        }
        if(insertArr)
        {

            this.__ob__.observerArray(insertArr);
        }
        this.__ob__.dep.notify();
        return oldArrayMethods[method].apply(this,Args);
    }
})
