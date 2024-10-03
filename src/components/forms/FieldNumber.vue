<template>
  <div
    class="flex flex-col place-items-center justify-center w-full px-0 rounded relative"
    :class="classes + (label && !params ? ' mt-6 <md:mt-7' : '')"
  >
    <input v-model.lazy="number" hidden step="any" type="number" />
    <input
      :id="idInput"
      ref="input"
      :autofocus="autofocus ? 'autofocus' : false"
      :value="valueModel"
      :name="Math.random() - false"
      autocomplete="new-password"
      type="tel"
      :placeholder="placeholder"
      v-bind="bind"
      class="md:max-h-8 <md:max-h-10 w-full bg-white md:text-xs py-2.5 rounded input-target outline-none border focus:!border-blue-600 focus:shadow-md focus:bg-white transition-all duration-300"
      :class="{
        'text-right': valueModel !== null && valueModel.length > 0,
        '!bg-gray-100': bind.readonly,
        'pl-10': Boolean(faIcon),
        'pl-2.2': !Boolean(faIcon),
        '!border-red-500': errorText
      }"
      @keydown="numberKeydown"
      @keyup="numberKeyup"
      @input="onInput"
      @change="onInput"
      @focus="$emit('focus', true), (isFocus = true)"
      @blur="(isFocus = false), onBlurNumber()"
    />
    <icon
      v-if="faIcon"
      :fa="faIcon"
      :class="
        'absolute -left-1 fa-fw ' +
        (isFocus ? '!text-blue-500' : 'text-gray-600') +
        (isFocus ? ' animated animate-head-shake ' : '')
      "
    />

    <icon
      v-if="errorText"
      :title="errorText"
      fa="exclamation-circle"
      class="absolute left-0 fa-sm fa-fw text-red-400"
    />
    <icon v-else-if="check && !params" fa="check" class="absolute left-0 text-green-400" />
    <div
      v-show="isFocus"
      v-if="hints.length > 0"
      class="absolute z-5 top-[33px] w-full -left-4 px-4 animated animate-zoom-in animate-duration-100"
    >
      <ul class="bg-white border border-yellow-500 rounded p-1.5 shadow-sm">
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

    <label
      v-show="(label && valueModel !== null && valueModel.length > 0) || labeled"
      class="text-xs z-4 font-semibold animated animate-zoom-in animate-duration-100 absolute bottom-full -left-3 text-gray-600"
      :for="placeholder || label"
      :class="{
        'text-blue-600': isFocus
      }"
      >{{ label === 'placeholder' ? placeholder : label }}
      <Popper v-if="info" hover arrow placement="right" class="popper-field" :content="info">
        <icon fa="info-circle" class="fa-md ml-1 fa-fw text-gray-200 hover:text-gray-600" />
      </Popper>
      <slot name="label"></slot>
    </label>
  </div>
</template>
<script>
export default {
  emits: [
    'input',
    'update:value',
    'update:errorText',
    'change',
    'blur',
    'keyup',
    'keydown',
    'focus'
  ],
  props: {
    params: {
      type: Object,
      default() {
        return null
      }
    },
    bind: {
      type: Object,
      default() {
        return {}
      }
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
      type: Array,
      default() {
        return []
      }
    },
    decimals: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      valueModel: null,
      isFocus: false,
      number: 0
    }
  },
  computed: {
    idInput() {
      return this.placeholder || Math.random() - false
    }
  },
  watch: {
    number(v) {
      const value = v
      this.$emit('update:errorText', '')
      this.$emit('update:value', value)
      this.$emit('input', value)
    },
    value(v) {
      this.valueModel = v
      this.onBlurNumber()
    }
  },
  created() {
    this.valueModel = this.value
    if (this.params) {
      this.$emit('update:value', this.params.value)
      this.valueModel = this.params.value
    }
    this.onBlurNumber()
  },
  mounted() {
    if (this.params) {
      this.$nextTick(() => {
        try {
          this.$refs.input.select()
          this.$refs.input.focus()
        } catch (err) {
          //
        }
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
    onInput(e) {
      if (e && e.target) {
        const formattedVal = this.getValue(e.target.value)
        if (e.type === 'change' && this.params && typeof this.params.input === 'function') {
          const result = this.params.input(formattedVal, this.params)
          if (result === false) {
            e.preventDefault()
            return false
          }
        }

        this.valueModel = e.target.value
        this.number = this.getValue(e.target.value)

        if (e.type === 'change') {
          this.$emit('change', this.number)
        }
      }
    },
    getValue() {
      try {
        const val = parseFloat(this.valueModel.replace(/\./g, '').replace(/,/g, '.'))
        if (this.params && typeof this.params.change === 'function') {
          this.params.change(val, this.params)
        }
        return isNaN(val) ? null : val
      } catch (e) {
        return 0
      }
    },
    validate() {
      if (typeof this.min === 'number' && this.number < this.min) {
        this.$toast.error(`Nilai minimum harus ${this.min}`, {
          theme: 'bubble',
          position: 'bottom-right',
          duration: 1500
        })
        return false
      }
      if (typeof this.max === 'number' && this.number > this.max) {
        this.$toast.error(`Nilai maksimum harus ${this.max}`, {
          theme: 'bubble',
          position: 'bottom-right',
          duration: 1500
        })
        return false
      }
      if (typeof this.less === 'number' && this.number >= this.less) {
        this.$toast.error(`Nilai harus kurang dari ${this.max}`, {
          theme: 'bubble',
          position: 'bottom-right',
          duration: 1500
        })
        return false
      }
      if (typeof this.more === 'number' && this.number <= this.more) {
        this.$toast.error(`Nilai harus lebih dari ${this.more}`, {
          theme: 'bubble',
          position: 'bottom-right',
          duration: 1500
        })
        return false
      }
      return true
    },
    numberKeydown(event) {
      const value = event.target.value
      const key = event.key
      if (
        key === ',' &&
        (value === null || value.toString().length === 0 || value.toString().includes(','))
      ) {
        event.preventDefault()
        return false
      }
      if (key === '-' && value.includes('-')) {
        event.preventDefault()
        return false
      }
      if (
        !/^[0-9,-]{1,}$/.test(key) &&
        !['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab', 'Enter'].includes(key) &&
        !(event.ctrlKey === true && ['v', 'c', 'x', 'a'].includes(key))
      ) {
        event.preventDefault()
        return false
      }
      this.$emit('keydown', this.number)
    },
    numberKeyup(event) {
      const value = event.target.value
      const formattedVal = parseFloat(value.replace(/\./g, '').replace(/,/g, '.')).toLocaleString(
        'id',
        {
          minimumFractionDigits: value.split(',')[1] ? value.split(',')[1].length : 0
        }
      )
      if (formattedVal === 'NaN') {
        this.number = null
        return
      }
      event.target.value = value.endsWith(',') ? formattedVal + ',' : formattedVal
      const realNumber = parseFloat(value.replace(/\./g, '').replace(/,/g, '.'))
      if (!isNaN(realNumber)) {
        this.number = realNumber
      } else {
        this.number = null
      }
      this.$emit('keyup', this.number)
    },
    onBlurNumber() {
      const me = this
      if (me.valueModel !== null && me.valueModel !== '' && me.valueModel !== ',') {
        const rawValue = me.valueModel.toLocaleString('id')
        let val, decimal
        if (rawValue.includes(',')) {
          val = rawValue.split(',')[0].replace(/\./g, '').replace(/,/g, '.')
          decimal = rawValue.split(',')[1].length === 0 ? '00000' : rawValue.split(',')[1]
          decimal = decimal.slice(0, me.decimals)
        } else {
          val = rawValue.replace(/\./g, '').replace(/,/g, '.')
          decimal = '00'
        }
        const formattedVal = parseFloat(val).toLocaleString('id')
        me.valueModel =
          formattedVal + (rawValue.includes(',') && decimal.length > 0 ? `,${decimal}` : '')
        me.number = me.getValue()
      }
      this.$emit('blur', this.number)
    }
  }
}
</script>
