<template>
  <div>
    <el-select v-model="text"
               :size="size"
               :multiple="multiple"
               :clearable="clearable"
               :placeholder="placeholder?placeholder:`请选择${label}`"
               @change="handleChange(text,limitType)"
               @input="handleText(text, limitType)"
               :disabled="disabled">
      <el-option v-for="(item,index) in dic"
                 :key="index"
                 :label="item[labelKey]"
                 :value="item[valueKey]">
      </el-option>
    </el-select>
  </div>

</template>

<script>
import unicomCompoents from './mixins/unicom-compoents.js'
export default {
  name: 'unicomSelect',
  mixins: [unicomCompoents()],
  data () {
    return {}
  },
  props: {
    value: {
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {
    handleChange (value, limitType) {
      this.$emit('input', value)
    },
    handleText (text, limitType) {
      this.$emit('handleText', text, limitType)
    },
  }
}
</script>

<style>
</style>
