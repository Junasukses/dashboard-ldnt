<template>
  <div
    class="flex flex-col place-items-center justify-center w-full px-0 rounded relative"
    :class="classes + (label && !params ? ' mt-6 <md:mt-7' : '') + (isFocus ? ' focus' : '')"
  >
    <textarea
      v-if="type === 'textarea'"
      :value="valueModel"
      :name="Math.random() - false"
      v-bind="(params && params.bind) || bind"
      autocomplete="new-password"
      :id="idInput"
      class="w-full h-full bg-white py-2.5 h-8 min-h-8 overflow-hidden md:text-xs transition-all duration-200 <md:max-h-12 rounded input-target resize-none outline-none border focus:border-blue-600 focus:py-1.5 focus:!overflow-auto focus:min-h-16"
      :class="{
        '!bg-gray-100': bind.readonly,
        'pr-10': check && !params,
        'pl-10': Boolean(faIcon),
        'pl-2.2': !Boolean(faIcon),
        'pr-3': !check || params,
        'border-red-600': errorText
      }"
      :placeholder="placeholder"
      @focus="$emit('focus', true), (isFocus = true)"
      @blur="isFocus = false"
      @input="onInput"
      @change="onInput"
    />
    <date-picker
      v-else-if="(!store.isMobile && type === 'date') || (params && params.type === 'Date')"
      ref="inputDate"
      :range="dateRange"
      :format="!dateRange ? 'DD/MM/YYYY' : null"
      value-type="format"
      :value="valueModel"
      :clearable="true"
      :placeholder="placeholder"
      :class="{
        invalid: errorText,
        inline: params || bind.isInline
      }"
      v-bind="(params && params.bind) || bind"
      @close="isFocus = false"
      @open="isFocus = true"
      @input="onInput"
      @change="onInput"
    >
      <template #input>
        <input
          :id="idInput"
          :placeholder="placeholder"
          :value="valueModel"
          ref="input"
          :class="{
            '!bg-gray-100': bind.readonly,
            'pr-10': check && !params,
            'pl-10': Boolean(faIcon),
            'pl-2.2': !Boolean(faIcon),
            'pr-3': !check || params,
            '!border-red-500': errorText,
            'cursor-pointer': type === 'range'
          }"
          class="md:max-h-8 <md:max-h-10 w-full bg-white md:text-xs py-2.5 rounded input-target outline-none border focus:!border-blue-600 focus:shadow-md focus:bg-white transition-all duration-300"
        />
      </template>
    </date-picker>
    <input
      v-else
      :id="idInput"
      ref="input"
      :value="valueModel"
      :name="Math.random() - false"
      autocomplete="new-password"
      :type="dynamicType"
      :maxlength="maxLength"
      :placeholder="placeholder"
      v-bind="(params && params.bind) || bind"
      class="md:max-h-8 <md:max-h-10 w-full bg-white md:text-xs py-2.5 rounded input-target outline-none border focus:!border-blue-600 focus:shadow-md focus:bg-white transition-all duration-300"
      :class="{
        '!bg-gray-100': bind.readonly,
        'pr-10': check && !params,
        'pl-10': Boolean(faIcon),
        'pl-2': !Boolean(faIcon),
        'pr-3': !check || params,
        '!border-red-500': errorText,
        'cursor-pointer': type === 'range'
      }"
      @input="onInput"
      @change="onInput"
      @focus="$emit('focus', true), (isFocus = true)"
      @blur="isFocus = false"
    />
    <icon
      v-if="faIcon || isPasswordShow"
      :fa="isPasswordShow ? 'unlock-alt' : faIcon"
      :class="
        'absolute left-2 fa-fw ' +
        (isFocus ? '!text-blue-500' : 'text-gray-600') +
        (isFocus ? ' animated animate-head-shake ' : '')
      "
    />

    <icon
      v-if="type === 'password'"
      :title="isPasswordShow ? 'Hide' : 'Show Password'"
      :fa="isPasswordShow ? 'eye-slash' : 'eye'"
      class="absolute right-6 cursor-pointer hover:text-gray-900 fa-fw text-gray-600"
      @mouseup="togglePassword"
    />

    <icon
      v-if="errorText"
      :title="errorText"
      fa="exclamation-circle"
      class="absolute right-2 fa-sm fa-fw text-red-400"
    />
    <icon
      v-else-if="check && !params"
      fa="check"
      class="absolute right-2 text-green-400"
      :class="{
        hidden: type === 'range'
      }"
    />
    <div
      v-show="isFocus"
      v-if="hints && hints.length > 0"
      :class="{
        'top-9/10': dynamicType !== 'date',
        'bottom-9/10': dynamicType === 'date'
      }"
      class="absolute z-5 w-full -left-4 px-4 animated animate-zoom-in animate-duration-100"
    >
      <ul class="bg-white border p-1.5 shadow-md">
        <li
          v-for="hint in hints"
          :key="'hint-' + hint"
          class="flex flex-row px-2 gap-3 place-items-center"
        >
          <icon
            :class="errorText ? '!text-red-400' : '!text-yellow-500'"
            :fa="errorText ? 'exclamation' : 'info'"
            style="zoom: 90%"
          />
          <span class="text-gray-500 text-xs">{{ hint }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useStore } from '@/stores/app'
import 'vue-datepicker-next/locale/id.es'

export default {
  emits: ['input', 'update:value', 'update:errorText', 'change', 'focus'],
  components: {
    DatePicker
  },
  setup() {
    const store = useStore()
    return {
      store
    }
  },
  props: {
    bind: {
      type: Object,
      default() {
        return {}
      }
    },
    params: {
      type: Object,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default: 'text'
    },
    faIcon: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    errorText: {
      type: String,
      default: ''
    },
    maxLength: {
      type: [String, Number],
      default: 100
    },
    value: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: 'placeholder'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    check: {
      type: Boolean,
      default: true
    },
    labeled: {
      type: Boolean,
      default: false
    },
    classes: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    hints: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    dateRange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valueModel: null,
      isFocus: false,
      isPasswordShow: false
    }
  },
  computed: {
    dynamicType() {
      return this.isPasswordShow ? 'text' : (this.params && this.params.type) || this.type
    },
    idInput() {
      return this.placeholder || Math.random() - false
    }
  },
  watch: {
    value(v) {
      this.valueModel = v
    }
  },
  created() {
    this.valueModel = this.value
    if (this.params) {
      this.$emit('update:value', this.params.value)
      this.valueModel = this.params.value
    }
  },

  mounted() {
    if (this.params) {
      this.$nextTick(() => {
        if (this.params.type && this.params.type === 'Date') {
          this.$refs.inputDate.openPopup()
          return
        }
        this.$refs.input.select()
        this.$refs.input.focus()
      })
    } else {
      if (this.autofocus) {
        setTimeout(() => {
          this.$refs.input ? this.$refs.input.focus() : null
        }, 400)
      }
    }
  },
  methods: {
    togglePassword() {
      if (this.isPasswordShow) {
        this.isPasswordShow = false
      } else {
        this.isPasswordShow = true
      }
    },
    getValue() {
      return this.valueModel
    },
    setValue(value) {
      this.$emit('update:value', value)
      this.valueModel = this.value
    },
    onInput(e) {
      let value = e
      if (e && e.target) {
        const formattedVal = this.getValue(e.target.value)
        if (e.type === 'change' && this.params && typeof this.params.input === 'function') {
          const result = this.params.input(formattedVal, this.params)
          if (result === false) {
            e.preventDefault()
            return false
          }
        }
        value = e.target.value
      }
      this.valueModel = value
      this.$emit('update:errorText', '')
      this.$emit('update:value', value)
      this.$emit('input', value)

      if (this.params && this.params.type && this.params.type === 'Date') {
        this.$refs.inputDate.$el.getElementsByTagName('input')[0].focus()
      }

      if (e.type === 'change') {
        this.$emit('change', value)
      }
    }
  }
}
</script>
<style>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

input[type='range'] {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.mx-datepicker {
  @apply w-full relative !border-transparent;
}

.mx-input:disabled,
.mx-input.disabled {
  @apply !text-gray-600;
}

.mx-input {
  @apply h-full md:text-xs w-full outline-none py-2.5 md:max-h-[8.5rem] pl-10 pr-10 border 
    focus:border-blue-600 focus:shadow-md transition-all duration-300;
  border-radius: 0.375rem;
}

.mx-icon-calendar {
  @apply right-6;
}

.mx-icon-clear {
  @apply right-6;
}

.mx-datepicker.invalid > div > input {
  @apply border-red-600;
}

.mx-datepicker.inline > div > input {
  @apply pr-1 pl-2;
}

.mx-datepicker.inline > div > .mx-icon-calendar {
  @apply right-1;
}

.mx-datepicker.inline > div > .mx-icon-clear {
  @apply right-1;
}
</style>
