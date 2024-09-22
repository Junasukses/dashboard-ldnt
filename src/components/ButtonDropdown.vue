<template>
  <div v-click-outside="onClickOutside" class="relative">
    <button
      class="rounded-full p-1 hover:(shadow-sm bg-white bg-opacity-25) focus:outline-none"
      @click="onClick"
    >{{prop.text}}
      <Icon v-if="prop.icon" :fa="prop.icon" />
      <Icon v-if="prop.arrow" fa="chevron-down" />
    </button>
    <ul
      v-show="isActive"
      @click="onClickOutside"
      class="absolute !text-sm top-full mt-3 -right-2 z-50 bg-white min-w-35 border rounded-sm shadow-sm border animated animate-zoom-in !animate-duration-200"
    >
      <slot />
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";

const prop = defineProps({
  icon: {
    type: String,
    default: "user",
  },
  text: {
    type: String,
    default: "",
  },
  arrow: {
    type: Boolean,
    default(){
      return true
    },
  },
});
const isActive = ref(false);

function onClickOutside() {
  isActive.value = false;
}
function onClick() {
  isActive.value = !isActive.value;
}

defineExpose({isActive, prop});
</script>
