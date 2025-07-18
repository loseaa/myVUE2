export function patch(oldVnode, newVnode) {

    let newEl = createEle(newVnode);
    oldVnode.parentNode.replaceChild(newEl, oldVnode);
    document.body.appendChild(newEl);
    return newEl;

}

function createEle(Vnode) {
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