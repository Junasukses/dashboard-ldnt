<template>
  <div class="relative colfilter flex items-center group">
    <select
      v-if="params.filterParams?.options"
      :value="filterText"
      @focus="() => (isFocus = true)"
      @blur="() => (isFocus = false)"
      @input="(e) => (filterText = e.target.value)"
      @change="updateFilter"
      class="pl-1 appearance-none cursor-pointer bg-gray-50 py-1 rounded-sm border w-full hover:(bg-white) focus:(shadow-md border-blue-400 bg-white placeholder-transparent) outline-none transition-all duration-200 placeholder-transparent"
    >
      <option v-if="filterText" value="" title="click to clear"></option>
      <option
        class="cursor-pointer"
        v-for="dt in params.filterParams.options"
        :key="key + '-opt-' + dt"
        :value="dt"
      >
        {{ dt }}
      </option>
    </select>

    <date-picker
      v-else-if="params.filterParams?.range"
      :class="{
        'not-empty': filterText
      }"
      class="absolute py-1 rounded-sm hover:(bg-white)"
      :value="filterText ? filterText.split('~') : null"
      @focus="() => (isFocus = true)"
      @blur="() => (isFocus = false)"
      @update:value="
        (val) => {
          filterText = Array.isArray(val) ? (val[0] ? val[0] + '~' + val[1] : null) : val
        }
      "
      type="date"
      value-type="format"
      format="DD/MM/YYYY"
      range
      @change="updateFilter()"
      xshortcuts="shortcuts"
    >
      <template #icon-calendar></template>
      <template #icon-clear></template>
      <template #input>
        <input
          class="border-gray-300 font-normal px-1 cursor-pointer bg-gray-50 py-1.1 rounded-sm border w-full hover:bg-white focus:shadow-md focus:border-blue-400 focus:bg-white focus:placeholder-transparent outline-none transition-all duration-200 placeholder-transparent"
          :class="{
            '!bg-white': filterText,
            '!border-blue-400': filterText
          }"
          style="font-size: 11.5px"
          @focus="() => (isFocus = true)"
          @blur="() => (isFocus = false)"
          type="text"
          :title="'Filter ' + key"
          :value="filterText"
          @input="(e) => (filterText = e.target.value)"
          @change="updateFilter"
          @keydown.esc="
            (e) => {
              filterText = null
              e.preventDefault()
              updateFilter()
            }
          "
        />
      </template>
    </date-picker>

    <input
      v-else
      class="border-gray-300 font-normal px-1 bg-gray-50 py-1 rounded-sm border w-full hover:bg-white focus:shadow-md focus:border-blue-400 focus:bg-white focus:placeholder-transparent outline-none transition-all duration-200 placeholder-transparent"
      :class="{
        '!bg-white': filterText,
        '!border-blue-400': filterText
      }"
      style="font-size: 11.5px"
      @focus="() => (isFocus = true)"
      @blur="() => (isFocus = false)"
      type="text"
      :title="'Filter ' + key"
      :value="filterText"
      @input="(e) => (filterText = e.target.value)"
      @change="updateFilter"
      @keydown.esc="
        (e) => {
          filterText = null
          e.preventDefault()
          updateFilter()
        }
      "
    />

    <icon
      fa="filter"
      :size="
        'sm absolute text-gray-400 transition-all duration-500 ' +
        (isFocus || filterText ? 'right-1 !text-blue-400' : 'right-10/9 !left-1.5')
      "
    />
  </div>
</template>

<script>
import 'vue-datepicker-next/locale/id.es'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
export default {
  components: {
    DatePicker
  },
  computed: {
    key() {
      return this.params.column.colDef.headerName || this.params.column.colDef.field
    }
  },
  data() {
    return {
      filterText: null,
      isFocus: false,
      shortcuts: [
        {
          text: 'Today',
          onClick() {
            return [new Date(), new Date()]
          }
        }
      ]
    }
  },
  props: {
    params: {
      type: Object,
      default: null
    }
  },
  methods: {
    updateFilter() {
      if (this.params.staticGrid) {
        this.params.parentFilterInstance((instance) => {
          instance.onFloatingFilterChanged(this.params.column.colDef.field, this.filterText)
          //   instance.setModel({
          //     filterType: 'blah',
          //     type: this.params.filterKeY,
          //     filter: this.filterText,
          // });
        })
        return
      }
      const model = this.params.api.getFilterModel()
      model[this.params.column.colDef.field] = {
        prefix: 'filter_',
        filter: this.filterText
      }
      this.params.api.setFilterModel(model)

      // refresh rows based on the filter (not automatic to allow for batching multiple filters)
      // this.params.api.onFilterChanged();
    },
    getModel() {
      return this.filterText
        ? {
            prefix: 'filter_',
            filter: this.filterText
          }
        : null
    },
    setModel(model) {
      this.filterText = model?.filter
    },
    isFilterActive() {
      return false //this.filterText?true:false
    },
    onParentModelChanged(parentModel) {
      if (!parentModel) {
        this.filterText = ''
      } else {
        this.filterText = parentModel.filter
      }
    },
    doesFilterPass(params) {
      return true
    }
  }
}
</script>
<style>
.colfilter .mx-datepicker-range {
  @apply !py-0;
}
.colfilter .mx-datepicker-range {
  @apply !w-full;
}
.colfilter {
  @apply !min-h-[27px];
}
</style>
