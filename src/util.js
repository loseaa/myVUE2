
let callbacks=[]
let pending=false;
export function nextTick(cb){
    callbacks.push(cb)
    if(!pending){
        pending=true
        timerFunc()
    }
}
function flushQueue(){
    callbacks.forEach(cb=>cb())
    callbacks=[]
    pending=false
}
let timerFunc;
if(Promise)
{
    timerFunc=()=>{
        Promise.resolve().then(()=>{
            flushQueue()
        })
    }
}else if(MutationObserver){
    let observer=new MutationObserver(flushQueue);
    let textNode=document.createTextNode(1);
    observer.observe(textNode,{
        characterData:true
    })
    timerFunc=()=>{
        textNode.textContent=2
    }
}else if(setImmediate)
{
    timerFunc=()=>{
        setImmediate(()=>{
            flushQueue()
        })
    }
}
else{
    timerFunc=()=>{
        setTimeout(()=>{
            flushQueue()
        },0)
    }
}