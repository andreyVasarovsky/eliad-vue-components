<template>
  <div class="drag-and-drop-box">
    <div class="drop-zones container-list">
      <div class="container main dropzone" id="stack">
        <div class="title">{{ mainTitle }}</div>
        <div class="element-list">
          <div v-for="(el, index) in editable.stack" :ref="el" :id="el" :key="index" class="element" @mousedown="bindDraggable(el)">
            <template v-if="el in elementsTitles">
              {{ elementsTitles[el] }}
            </template>
            <template v-else>
              {{ el }}
            </template>
          </div>
        </div>
      </div>

      <div v-for="(container, containerTitle) in editable.containers"
           :key="containerTitle"
           :class="{'disabled': disabledContainers.includes(containerTitle), 'dropzone': !disabledContainers.includes(containerTitle)}"
           class="container"
           :id="containerTitle">
        <div class="title">
          <template v-if="containerTitle in containersTitles">
            {{ containersTitles[containerTitle] }}
          </template>
          <template v-else>
            {{ containerTitle }}
          </template>
          <template v-if="containerTitle in maxInContainer">
            <span class="limit">({{ containersQty[containerTitle] }}/{{ maxInContainer[containerTitle] }})</span>
          </template>
        </div>
        <div class="element-list">
          <div v-for="(el, index) in container" :ref="el" :id="el" :key="index" class="element"
               :class="{'disabled': disabledContainers.includes(containerTitle)}"
               @mousedown="bindDraggable(el)">
            <template v-if="el in elementsTitles">
              {{ elementsTitles[el] }}
            </template>
            <template v-else>
              {{ el }}
            </template>
          </div>
        </div>
      </div>
    </div>
    <div ref="error" class="error-msg error-msg-hidden"></div>
  </div>
</template>

<script>
export default {
  name: "av-drag-and-drop",
  emits: ["change", "mounted", "update:modelValue"],
  props: {
    stack: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    containers: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    elementsTitles: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    containersTitles: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    mainTitle: {
      type: String,
      required: false,
      default: 'Stack'
    },
    disabledContainers: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    maxInContainer: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    modelValue: Object,
  },
  data() {
    return {
      editable: {
        stack: [],
        containers: {},
      },
      dragged: null,
      draggingTargetId: null,
    }
  },
  watch: {
    'modelValue'() {
      this.setup();
    },
  },
  mounted() {
    this.setup();
    document.addEventListener('dragstart', this.onDragStart, false)
    document.addEventListener('dragend', this.onDragEnd, false)
    document.addEventListener('dragover', this.onDragOver, false)
    document.addEventListener('drop', this.onDrop, false)
    this.$emit("mounted");
  },
  beforeUnmount() {
    document.removeEventListener('dragstart', this.onDragStart, false)
    document.removeEventListener('dragend', this.onDragEnd, false)
    document.removeEventListener('dragover', this.onDragOver, false)
    document.removeEventListener('drop', this.onDrop, false)
  },
  methods: {
    setup() {
      this.editable.stack = this.stack;

      if (Object.keys(this.modelValue).length > 0) {
        this.editable.containers = this.modelValue;
      } else {
        this.containers.map(container => {
          this.editable.containers[container] = [];
        });
      }
    },
    showError(msg) {
      this.$refs.error.innerHTML = msg;
      this.$refs.error.classList.toggle("error-msg-hidden");
      setTimeout(() => {
        this.$refs.error.classList.toggle("error-msg-hidden");
      }, 2000);
    },
    bindDraggable(item) {
      if (!this.$refs[item][0].classList.contains('disabled')) {
        this.$refs[item][0].setAttribute('draggable', true)
        this.$refs[item][0].style.transform = 'translateZ(0px)'
      }
    },
    onDragStart(event) {
      this.dragged = event.target;
      event.dataTransfer.effectAllowed = 'copyMove';
    },
    onDragEnd() {
      if (this.draggableElementIds.includes(this.dragged.id)){
        this.dragged.setAttribute('draggable', false);
      }
    },
    onDragOver(event) {
      event.preventDefault();
      this.draggingTargetId = null;
      this.resetDraggableElementsBottomBorder();
      const targetId = event.target.id;
      if (targetId !== "" && this.draggableElementIds.includes(targetId)) {
        document.getElementById(targetId).style.borderTop = 'solid 1px #409eff';
        this.draggingTargetId = targetId;
      }
    },
    resetDraggableElementsBottomBorder() {
      this.draggableElementIds.map(id => {
        document.getElementById(id).style.borderTop = '';
      })
    },
    getElementPath(event) {
      //Fix for Safari Browser
      if (typeof event.path === "undefined") {
        let path = [];
        let currentElem = event.target;
        while (currentElem) {
          path.push(currentElem);
          currentElem = currentElem.parentElement;
        }
        return path;
      } else {
        return event.path;
      }
    },
    onDrop(event) {
      event.preventDefault()
      this.resetDraggableElementsBottomBorder();

      let target = null;
      this.getElementPath(event).forEach(el => {
        if (typeof el.classList !== "undefined" && el.classList.contains('dropzone')) {
          target = el;
          return false;
        }
      });

      if (target) {
        const targetId = target.id;
        const elementId = this.dragged.id;
        const draggingTargetId = this.draggingTargetId;
        if (this.draggableElementIds.includes(elementId) && elementId !== draggingTargetId) {
          if (!(targetId in this.maxInContainer) || parseInt(this.maxInContainer[targetId]) !== parseInt(this.containersQty[targetId])) {
            this.removeFromStack(elementId);
            this.removeFromContainers(elementId);
            if (targetId === 'stack') {
              this.pushInStack(elementId);
            } else {
              this.pushInContainer(targetId, elementId);
            }
            this.$emit('change', this.editable.containers);
            this.$emit('update:modelValue', this.editable.containers);
          } else {
            this.showError('Quantity limit');
          }
        }
      }
    },
    removeFromContainers(value) {
      Object.keys(this.editable.containers).map(container => {
        let index = this.editable.containers[container].indexOf(value);
        if (index !== -1) {
          this.editable.containers[container].splice(index, 1);
        }
      });
    },
    removeFromStack(value) {
      let index = this.editable.stack.indexOf(value);
      if (index !== -1) {
        this.editable.stack.splice(index, 1);
      }
    },
    pushInContainer(container, value) {
      if (!this.editable.containers[container].includes(value)) {
        const draggingTargetId = this.draggingTargetId;
        if (draggingTargetId !== null) {
          this.editable.containers[container].splice(this.editable.containers[container].indexOf(draggingTargetId), 0, value);
        }else{
          this.editable.containers[container].push(value);
        }
      }
    },
    pushInStack(value) {
      if (!this.editable.stack.includes(value)) {
        const draggingTargetId = this.draggingTargetId;
        if (draggingTargetId !== null) {
          this.editable.stack.splice(this.editable.stack.indexOf(draggingTargetId), 0, value);
        }else{
          this.editable.stack.push(value);
        }
      }
    },
  },
  computed: {
    containersQty() {
      let qty = {};
      Object.keys(this.editable.containers).map(containerKey => {
        qty[containerKey] = this.editable.containers[containerKey].length;
      });
      return qty;
    },
    draggableElementIds() {
      const ids = new Set();
      this.stack.map(value => ids.add(value));
      Object.values(this.editable.containers).map(container => container.map(element => {
        ids.add(element);
      }));
      return [...ids];
    },
  }
}

</script>

<style scoped>
.drag-and-drop-box {
  display: flex;
  flex-wrap: wrap;
}

.drag-and-drop-box .error-msg {
  opacity: 1;
  color: #f56c6c;
  width: 100%;
  background-color: #ffe2e2;
  transition: all 1s;
  margin: 8px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 16px;
  padding: 8px;
  height: 18px;
}

.drag-and-drop-box .error-msg.error-msg-hidden {
  transition: all .2s ease-out;
  opacity: 0;
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
}

.drag-and-drop-box .container-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.drag-and-drop-box .container-list .container {
  padding: 8px;
  min-height: 300px;
  min-width: 200px;
  user-select: none;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(31, 54, 73, .09), 0 3px 9px 0 rgba(31, 54, 73, .09);
}

.drag-and-drop-box .container-list .container.disabled {
  background-color: #d9d9d9;
  opacity: 0.4;
}

.drag-and-drop-box .container-list .container.disabled .title {
  border-bottom: solid 1px #757575;
  color: #000000;
}

.drag-and-drop-box .container-list .container .title {
  height: 24px;
  border-bottom: solid 1px #d3d3d3;
  color: #757575;
  margin-bottom: 8px;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
}


.drag-and-drop-box .container-list .container .title .limit {
  font-size: 12px;
  float: right;
}

.drag-and-drop-box .container-list .container .element-list {
  height: 270px;
  overflow-y: auto;
}

.drag-and-drop-box .container-list .container .element-list .element {
  background-color: #ecf5ff;
  padding: 4px;
  font-weight: 300;
  border-radius: 4px;
  box-shadow: 0 2px 0 0 rgba(31, 54, 73, .09), 0 2px 4px 0 rgba(31, 54, 73, .09);
  margin-bottom: 8px;
}

.drag-and-drop-box .container-list .container .element-list .element:hover {
  cursor: pointer;
  transition: all .4s ease;
  color: #ffffff;
  background-color: #409EFF;
}

.drag-and-drop-box .container-list .container.disabled .element-list .element:hover {
  user-select: none;
  cursor: default;
  color: #606266;
  background-color: #ecf5ff;
}

.drag-and-drop-box .container-list .container .element-list::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}

.drag-and-drop-box .container-list .container .element-list::-webkit-scrollbar-track {
  background: #e3e3e3;
}

.drag-and-drop-box .container-list .container .element-list::-webkit-scrollbar-thumb {
  background: #757575;
  border-radius: 50px;
}

.drag-and-drop-box .container-list .container .element-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}


</style>