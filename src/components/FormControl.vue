<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@/stores/main'
import FormControlIcon from '@/components/FormControlIcon.vue'
import { mdiCalendarMonth } from '@mdi/js'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  name: {
    type: String,
    default: null
  },
  id: {
    type: String,
    default: null
  },
  autocomplete: {
    type: String,
    default: null
  },
  maxlength: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  inputmode: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  options: {
    type: Array,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  required: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean
})

const emit = defineEmits(['update:modelValue', 'setRef'])

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const inputElClass = computed(() => {
  const base = [
    'px-3 py-0 max-w-full focus:ring-1 transition-all duration-300  outline-none border-gray-700 rounded-lg w-full text-sm',
    'dark:placeholder-gray-400',
    computedType.value === 'textarea' ? 'h-24' : 'h-8',
    props.borderless ? 'border-0' : 'border',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800'
  ]

  if (props.icon) {
    base.push('pl-10')
  }

  return base
})

const computedType = computed(() => (props.options ? 'select' : props.type))

const controlIconH = computed(() => (props.type === 'textarea' ? 'h-full' : 'h-8'))

const mainStore = useMainStore()

const selectEl = ref(null)

const textareaEl = ref(null)

const dateEl = ref(null)

const inputEl = ref(null)

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value)
  } else if (textareaEl.value) {
    emit('setRef', textareaEl.value)
  } else if (dateEl.value) {
    emit('setRef', dateEl.value)
  } else {
    emit('setRef', inputEl.value)
  }
})

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      inputEl.value.focus()
    } else if (e.key === 'Escape') {
      inputEl.value.blur()
    }
  }

  onMounted(() => {
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook)
      mainStore.isFieldFocusRegistered = true
    } else {
      // console.error('Duplicate field focus event')
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook)
    mainStore.isFieldFocusRegistered = false
  })
}
</script>

<style scoped>
.datePickerCustomCalender {
  font-size: 0.8rem;
}
.datePickerCustomCell {
  width: 30px;
  height: 20px;
  font-size: 0.8rem;
}

.datePickerCustomMenu {
  font-size: 0.8rem;
}

.datePickerCustom {
  padding-top: 0;
  padding-bottom: 0;
  max-width: 100%;
  width: 100%;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  font-size: 0.875rem;
  background-color: white;
  transition: all 300ms;
  outline: none;
}
.datePickerCustom::placeholder {
  color: #6b7280;
}
.datePickerCustom:hover {
  border: 1px solid #374151 !important;
}
.datePickerCustomMenu:hover ~ .datePickerCustom,
.datePickerCustomMenu:focus-within ~ .datePickerCustom {
  border-color: #3b82f6 !important;
}
.datePickerCustom:focus-within,
.dp__input_focus {
  border: 1px solid #3b82f6 !important;
  box-shadow: 0 0 0 1px #3b82f6; /* Efek seperti ring */
}
</style>
<template>
  <div class="relative">
    <textarea
      v-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :required="required"
    />

    <VueDatePicker
      v-else-if="computedType === 'date'"
      :ui="{
        input: 'datePickerCustom',
        calender: 'datePickerCustomCalendar',
        calendarCell: 'datePickerCustomCell',
        menu: 'datePickerCustomMenu'
      }"
      v-model="computedValue"
      format="yyyy/dd/MM"
      :enable-time-picker="false"
      :placeholder="placeholder"
    >
      <template #input-icon>
        <BaseIcon
          :path="mdiCalendarMonth"
          w="w-10"
          h="h-10"
          class="pointer-events-none text-gray-500 dark:text-slate-400 mr-5"
        />
      </template>
    </VueDatePicker>
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :type="computedType"
      :class="inputElClass"
    />
    <FormControlIcon v-if="icon" :icon="icon" :h="controlIconH" />
  </div>
</template>
