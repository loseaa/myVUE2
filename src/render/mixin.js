export function renderMixin(Vue) {
    Vue.prototype._render = function () {
        // 通过执行render函数拿到虚拟节点，将虚拟节点返回
        // console.log();

        return this.$options.render.call(this)
    }

    Vue.prototype._c = function (tag, attrs, ...children) {
        return createElement(tag, attrs, children)
    }

    Vue.prototype._s = function (name) {


        if (typeof name == "object") {
            return JSON.stringify(name)
        }

        if (!name) return ""
        return name
    }
    Vue.prototype._v = function (text) {
        return creatTextNode(text)
    }

    function createElement(tag, attrs, children) {
        return Vnode(tag, attrs, undefined, children, undefined)

    }

    function creatTextNode(text) {
        return Vnode(undefined, undefined, undefined, undefined, text)
    }

    function Vnode(tag, attrs, key, children, text) {
        return {
            tag,
            attrs,
            key,
            children,
            text
        }
    }



}