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
            newVnode.el = oldVnode.el;
            if(oldVnode.text!=newVnode.text){
                console.log(oldVnode);
                oldVnode.el.textContent = newVnode.text;
            }
            return oldVnode.el;
        }

        //这里逻辑是不是文本节点，要复用节点
        let el = newVnode.el = oldVnode.el;
        patchAttr(oldVnode, newVnode);
        patchChildren(oldVnode, newVnode, el);
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

function patchChildren(oldVnode, newVnode, el) {
    let oldChildren = oldVnode.children || [];
    let newChildren = newVnode.children || [];

    //旧的节点没有儿子，直接添加新的
    if (oldChildren.length == 0) {
        newChildren.forEach(child => {
            el.appendChild(createEle(child));
        })
        return;
    }
    if (newChildren.length == 0) {
        el.innerHTML = "";
        return;
    }
    updateChildren(oldChildren, newChildren, el);
}

//diff算法的核心
function updateChildren(oldChildren, newChildren, el) {
    //四个指针
    let oldStartIdx = 0;
    let oldEndIdx = oldChildren.length - 1;
    let newStartIdx = 0;
    let newEndIdx = newChildren.length - 1;
    //指向的四个节点
    let oldStartVnode = oldChildren[oldStartIdx];
    let oldEndVnode = oldChildren[oldEndIdx];
    let newStartVnode = newChildren[newStartIdx];
    let newEndVnode = newChildren[newEndIdx];

    //老节点key对应的index

    let oldKeyToIdx = {};
    oldChildren.forEach((item, index) => {
        if (item.attrs) {
            oldKeyToIdx[item.attrs.key] = index
        }
    })



    //while循环
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            oldStartVnode = oldChildren[++oldStartIdx];
        }
        if (oldEndVnode == null) {
            oldEndVnode = oldChildren[--oldEndIdx];
        }
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            newStartVnode = newChildren[++newStartIdx];
            oldStartVnode = oldChildren[++oldStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            newEndVnode = newChildren[--newEndIdx];
            oldEndVnode = oldChildren[--oldEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode);
            el.removeChild(oldStartVnode.el);
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
            oldStartVnode = oldChildren[++oldStartIdx];
            newEndVnode = newChildren[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            el.removeChild(oldEndVnode.el);
            el.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldChildren[--oldEndIdx];
            newStartVnode = newChildren[++newStartIdx];
        }
        else {
            let moveIndex = oldKeyToIdx[newStartVnode.attrs.key];
            if (moveIndex !== undefined) {
                //找到了要移动的节点
                let moveVnode = oldChildren[moveIndex];
                el.removeChild(moveVnode.el);
                el.insertBefore(moveVnode.el, oldStartVnode.el);
                oldChildren[moveIndex] = null;
                newStartVnode = newChildren[++newStartIdx];
            } else {
                // 没找到
                el.insertBefore(createEle(newStartVnode), oldStartVnode.el);
                newStartVnode = newChildren[++newStartIdx];
            }
        }
    }

    //处理剩余的节点
    if (oldStartIdx <= oldEndIdx) {
        //旧的要删除
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (oldChildren[i] != null) {
                el.removeChild(oldChildren[i].el)
            }
        }
    }
    if (newStartIdx <= newEndIdx) {
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            el.appendChild(createEle(newChildren[i]))
        }
    }


}

function isSameVnode(oldVnode, newVnode) {
    
    return oldVnode.tag == newVnode.tag && oldVnode?.attrs?.key == newVnode?.attrs?.key;
}

export function createEle(Vnode) {

    let { tag, data, key, children, text } = Vnode;
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
        el = document.createTextNode(text)
        Vnode.el = el;
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