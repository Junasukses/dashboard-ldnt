<template>
  <div>
    <button
      class="focus:( !outline-none) !text-xs rounded w-auto"
      @click="onClick"
    >      <slot />
    </button>

  <vue-final-modal v-model="isOpenPopup" attach="#app">
    <div
      v-if="isOpenPopup"
      class="top-0 left-0 w-screen h-screen !m-0 flex items-center justify-center animated animate-fade-in animate-duration-75"
    >
      <div
        class="absolute z-41 top-0 left-0 bg-dark-50 w-full h-full bg-opacity-50"
        @click.self="isOpenPopup = !isOpenPopup"
      />
      <div class="z-42 py-3 px-3 bg-white w-3/4 h-3/4 rounded relative">
        <TableApi
            ref="tableApiReference"
            :is-popup="true"
            :selectable="true"
            :select-multi="true"
            :api="props.api"
            :columns="props.columns"
            :scopes="props.scopes"
            :currentSelectedRows="selectedRows"
            custom-class="!h-full"
            @rowClick="onRowClicked"
        >
          <template #header>
            <slot name="header" />
            <div 
              @click="toggleSelected" 
              v-if="!props.overrideHeader && !isToggleSelectedRows && selectedRows.length>0" 
              class="mx-2 hover:(underline underline-blue-600 text-blue-600) cursor-pointer animated animate-flip-in-x animate-delay-150 select-none">
                <span v-if="selectedRows.length>0">Lihat Terpilih</span>
              </div>
            <div 
              @click="toggleSelected" 
              v-else-if="!props.overrideHeader && isToggleSelectedRows" 
              class="mx-2 hover:(underline underline-blue-600 text-blue-600) cursor-pointer animated animate-flip-in-x animate-delay-150 select-none">
                Kembali ke pilihan
              </div>
            <button v-if="!props.overrideHeader&&selectedRows.length"
              class="transition-all duration-200 bg-white text-blue-500 rounded py-1 px-2 select-none"
              :class="{
                'hover:(!bg-blue-500 text-white shadow-sm)':
                  selectedRows.length > 0,
                'hover:(!bg-gray-400)': selectedRows.length === 0,
              }"
              :disabled="selectedRows.length === 0"
              @click="onTambahkan"
            >
              Tambahkan ({{selectedRows.length}})
              <icon fa="arrow-circle-down" />
            </button>
          </template>
        </TableApi>
      </div>
    </div>
    </vue-final-modal>
  </div>
</template>
<script setup>
import { ref } from "vue";

const tableApiReference = ref(null);
const isOpenPopup = ref(false);
const isToggleSelectedRows = ref(false)
const selectedRows = ref([]);

const emit = defineEmits(["add"]);

const props = defineProps({
  api: {
    type: Object,
    default: () => {},
  },
  columns: {
    type: Array,
    default: () => [],
  },
  overrideHeader: {
    type: Boolean,
    default: false,
  },
  scopes: {
    type: Array,
    default: () => [],
  }
});


function onTambahkan() {
  emit("add", selectedRows.value);
  isOpenPopup.value = false;
  selectedRows.value = []
}

function onClick() {
  isOpenPopup.value = true;
  isToggleSelectedRows.value = false
}

function onRowClicked() {
  if (props.overrideHeader) return;
  selectedRows.value = tableApiReference.value.getSelectedRows();
}

function toggleSelected(){
  isToggleSelectedRows.value = !isToggleSelectedRows.value
  tableApiReference.value.toggleSelectedRows();
}
</script>
