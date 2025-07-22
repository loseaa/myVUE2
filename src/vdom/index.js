export function patch(oldVnode, newVnode) {
    if (oldVnode instanceof HTMLElement) {
        let newEl = createEle(newVnode);
        oldVnode.parentNode.replaceChild(newEl, oldVnode);
        return newEl;
    }
    else {
        //标签不同直接删除更新
        if (newVnode.tag != oldVnode.tag) {
            let newEl = createEle(newVnode);
            oldVnode.el.parentNode.replaceChild(newEl, oldVnode.el);
            return newEl;
        }
        //标签相同如果是文字也直接更新
        if (newVnode.text) {
            oldVnode.el.textContent = newVnode.text;
            return oldVnode.el;
        }

        //这里逻辑是不是文本节点，要复用节点
        let el=newVnode.el=oldVnode.el;
        patchAttr(oldVnode, newVnode);
        patchChildren(oldVnode,newVnode,el);
        return oldVnode.el;
    }

}

function patchAttr(oldVnode, newVnode) {
    for (let key in oldVnode.attrs) {
        if (!newVnode.attrs[key]) {
            oldVnode.el.removeAttribute(key);
        }
    }
    let newAttrs = newVnode.attrs || {};
    let oldAttrs = oldVnode.attrs || {};


    for (let key in newAttrs) {
        if (key == "style") continue;
        if (!oldAttrs[key] || oldAttrs[key] != newAttrs[key]) {
            oldVnode.el.setAttribute(key, newVnode.attrs[key]);
        }
    }

    let newStyle = newAttrs.style || {};
    let oldStyle = oldAttrs.style || {};

    for (let key in oldStyle) {
        if (!newStyle[key]) {
            oldVnode.el.style[key] = "";
        }
    }

    for (let key in newStyle) {
        oldVnode.el.style[key] = newStyle[key];
    }

}

function patchChildren(oldVnode,newVnode,el){
    let oldChildren=oldVnode.children||[];
    let newChildren=newVnode.children||[];

    console.log(oldChildren,newChildren);
    //旧的节点没有儿子，直接添加新的
    if(oldChildren.length==0){
        newChildren.forEach(child=>{
            el.appendChild(createEle(child));
        })
        return;
    }
    if(newChildren.length==0){
        el.innerHTML="";
        return;
    }

    updateChildren(oldChildren,newChildren,el);
}

//diff算法的核心
function updateChildren(oldChildren,newChildren,el){

}

export function createEle(Vnode) {
    let { tag, data, children, key, text } = Vnode;
    let el;
    if (tag) {
        el = document.createElement(tag);
        Vnode.el = el;
        dispatchAttributes(Vnode)
        if (children.length) {
            children.forEach(child => {
                el.appendChild(createEle(child));
            })
        }
    }
    else {
        el = document.createTextNode(text);
    }
    return el;
}

function dispatchAttributes(vnode) {
    for (let key in vnode.attrs) {
        if (key == "class") {
            vnode.el.className = vnode.attrs[key];
        }
        else if (key == "style") {
            for (let styleName in vnode.attrs[key]) {
                vnode.el.style[styleName] = vnode.attrs[key][styleName];
            }
        }
        else {
            vnode.el.setAttribute(key, vnode.attrs[key]);
        }
    }
}