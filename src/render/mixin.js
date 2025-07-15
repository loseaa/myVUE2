export function renderMixin(Vue){
    Vue.prototype._render=function(){
        console.log( this.$options.render);
        
        return this.$options.render.call(this);
    }


}