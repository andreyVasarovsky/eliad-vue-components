"use strict";var e=require("vue"),t={name:"InputText"};const n={type:"text"};t.render=function(t,r,a,i,s,o){return e.openBlock(),e.createElementBlock("input",n)},t.__file="src/InputText.vue";var r={name:"InputTextarea"};r.render=function(t,n,r,a,i,s){return e.openBlock(),e.createElementBlock("textarea")},r.__file="src/InputTextarea.vue";var a={name:"av-drag-and-drop",emits:["change","mounted","update:modelValue"],props:{stack:{type:Array,required:!0,default:()=>[]},containers:{type:Array,required:!1,default:()=>[]},elementsTitles:{type:Object,required:!1,default:()=>({})},containersTitles:{type:Object,required:!1,default:()=>({})},mainTitle:{type:String,required:!1,default:"Stack"},disabledContainers:{type:Array,required:!1,default:()=>[]},maxInContainer:{type:Object,required:!1,default:()=>({})},modelValue:Object},data:()=>({editable:{stack:[],containers:{}},dragged:null,draggingTargetId:null}),watch:{modelValue(){this.setup()}},mounted(){this.setup(),document.addEventListener("dragstart",this.onDragStart,!1),document.addEventListener("dragend",this.onDragEnd,!1),document.addEventListener("dragover",this.onDragOver,!1),document.addEventListener("drop",this.onDrop,!1),this.$emit("mounted")},beforeUnmount(){document.removeEventListener("dragstart",this.onDragStart,!1),document.removeEventListener("dragend",this.onDragEnd,!1),document.removeEventListener("dragover",this.onDragOver,!1),document.removeEventListener("drop",this.onDrop,!1)},methods:{setup(){this.editable.stack=this.stack,Object.keys(this.modelValue).length>0?this.editable.containers=this.modelValue:this.containers.map((e=>{this.editable.containers[e]=[]}))},showError(e){this.$refs.error.innerHTML=e,this.$refs.error.classList.toggle("error-msg-hidden"),setTimeout((()=>{this.$refs.error.classList.toggle("error-msg-hidden")}),2e3)},bindDraggable(e){this.$refs[e][0].classList.contains("disabled")||(this.$refs[e][0].setAttribute("draggable",!0),this.$refs[e][0].style.transform="translateZ(0px)")},onDragStart(e){this.dragged=e.target,e.dataTransfer.effectAllowed="copyMove"},onDragEnd(){this.draggableElementIds.includes(this.dragged.id)&&this.dragged.setAttribute("draggable",!1)},onDragOver(e){e.preventDefault(),this.draggingTargetId=null,this.resetDraggableElementsBottomBorder();const t=e.target.id;""!==t&&this.draggableElementIds.includes(t)&&(document.getElementById(t).style.borderTop="solid 1px #409eff",this.draggingTargetId=t)},resetDraggableElementsBottomBorder(){this.draggableElementIds.map((e=>{document.getElementById(e).style.borderTop=""}))},getElementPath(e){if(void 0===e.path){let t=[],n=e.target;for(;n;)t.push(n),n=n.parentElement;return t}return e.path},onDrop(e){e.preventDefault(),this.resetDraggableElementsBottomBorder();let t=null;if(this.getElementPath(e).forEach((e=>{if(void 0!==e.classList&&e.classList.contains("dropzone"))return t=e,!1})),t){const e=t.id,n=this.dragged.id,r=this.draggingTargetId;this.draggableElementIds.includes(n)&&n!==r&&(e in this.maxInContainer&&parseInt(this.maxInContainer[e])===parseInt(this.containersQty[e])?this.showError("Quantity limit"):(this.removeFromStack(n),this.removeFromContainers(n),"stack"===e?this.pushInStack(n):this.pushInContainer(e,n),this.$emit("change",this.editable.containers),this.$emit("update:modelValue",this.editable.containers)))}},removeFromContainers(e){Object.keys(this.editable.containers).map((t=>{let n=this.editable.containers[t].indexOf(e);-1!==n&&this.editable.containers[t].splice(n,1)}))},removeFromStack(e){let t=this.editable.stack.indexOf(e);-1!==t&&this.editable.stack.splice(t,1)},pushInContainer(e,t){if(!this.editable.containers[e].includes(t)){const n=this.draggingTargetId;null!==n?this.editable.containers[e].splice(this.editable.containers[e].indexOf(n),0,t):this.editable.containers[e].push(t)}},pushInStack(e){if(!this.editable.stack.includes(e)){const t=this.draggingTargetId;null!==t?this.editable.stack.splice(this.editable.stack.indexOf(t),0,e):this.editable.stack.push(e)}}},computed:{containersQty(){let e={};return Object.keys(this.editable.containers).map((t=>{e[t]=this.editable.containers[t].length})),e},draggableElementIds(){const e=new Set;return this.stack.map((t=>e.add(t))),Object.values(this.editable.containers).map((t=>t.map((t=>{e.add(t)})))),[...e]}}};const i={class:"drag-and-drop-box"},s={class:"drop-zones container-list"},o={class:"container main dropzone",id:"stack"},l={class:"title"},d={class:"element-list"},c=["id","onMousedown"],m=["id"],g={class:"title"},u={key:2,class:"limit"},p={class:"element-list"},h=["id","onMousedown"],k={ref:"error",class:"error-msg error-msg-hidden"};a.render=function(t,n,r,a,b,f){return e.openBlock(),e.createElementBlock("div",i,[e.createElementVNode("div",s,[e.createElementVNode("div",o,[e.createElementVNode("div",l,e.toDisplayString(r.mainTitle),1),e.createElementVNode("div",d,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(b.editable.stack,((t,n)=>(e.openBlock(),e.createElementBlock("div",{ref_for:!0,ref:t,id:t,key:n,class:"element",onMousedown:e=>f.bindDraggable(t)},[t in r.elementsTitles?(e.openBlock(),e.createElementBlock(e.Fragment,{key:0},[e.createTextVNode(e.toDisplayString(r.elementsTitles[t]),1)],2112)):(e.openBlock(),e.createElementBlock(e.Fragment,{key:1},[e.createTextVNode(e.toDisplayString(t),1)],2112))],40,c)))),128))])]),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(b.editable.containers,((t,n)=>(e.openBlock(),e.createElementBlock("div",{key:n,class:e.normalizeClass([{disabled:r.disabledContainers.includes(n),dropzone:!r.disabledContainers.includes(n)},"container"]),id:n},[e.createElementVNode("div",g,[n in r.containersTitles?(e.openBlock(),e.createElementBlock(e.Fragment,{key:0},[e.createTextVNode(e.toDisplayString(r.containersTitles[n]),1)],2112)):(e.openBlock(),e.createElementBlock(e.Fragment,{key:1},[e.createTextVNode(e.toDisplayString(n),1)],2112)),n in r.maxInContainer?(e.openBlock(),e.createElementBlock("span",u,"("+e.toDisplayString(f.containersQty[n])+"/"+e.toDisplayString(r.maxInContainer[n])+")",1)):e.createCommentVNode("v-if",!0)]),e.createElementVNode("div",p,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t,((t,a)=>(e.openBlock(),e.createElementBlock("div",{ref_for:!0,ref:t,id:t,key:a,class:e.normalizeClass(["element",{disabled:r.disabledContainers.includes(n)}]),onMousedown:e=>f.bindDraggable(t)},[t in r.elementsTitles?(e.openBlock(),e.createElementBlock(e.Fragment,{key:0},[e.createTextVNode(e.toDisplayString(r.elementsTitles[t]),1)],2112)):(e.openBlock(),e.createElementBlock(e.Fragment,{key:1},[e.createTextVNode(e.toDisplayString(t),1)],2112))],42,h)))),128))])],10,m)))),128))]),e.createElementVNode("div",k,null,512)])},a.__scopeId="data-v-3f0d3494",a.__file="src/AVDragAndDrop.vue";var b={InputTextarea:r,InputText:t,AVDragAndDrop:a};const f={install(e){for(const t in b)if(b.hasOwnProperty(t)){const n=b[t];e.component(n.name,n)}}};module.exports=f;