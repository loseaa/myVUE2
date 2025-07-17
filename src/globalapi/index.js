export function globalApi(Vue) {
    Vue.$options = {}
    Vue.mixin = function (mixin) {
        this.$options = mergeOptions(this.$options, mixin);

    }
}

const strats = {};

// strats.data = function () { }
// strats.computed = {}
// strats.watch = {}

const LIFE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];

LIFE_HOOKS.forEach((lc) => {
    strats[lc] = function (parentValue, childValue) {
        if (childValue) {
            if (parentValue) {
                return parentValue.concat(childValue);
            } else {
                return [childValue]
            }
        } else {
            return parentValue;
        }

    }
})

export function mergeOptions(parent, child) {
    let options = {}
    for (let key in parent) {
        mergeField(key);
    }

    for (let key in child) {
        mergeField(key);

    }
    function mergeField(key) {
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key]);
        }
        else{
            options[key]=child[key];
            
        }
    }
    return options
}

