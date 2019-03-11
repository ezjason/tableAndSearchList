<template>
  <el-date-picker :type="type"
                  v-model="text"
                  :size="size"
                  :format="format"
                  :value-format="valueFormat"
                  :placeholder="placeholder?placeholder:`请输入${label}`"
                  @change="handleChange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :disabled="disabled"> </el-date-picker>
</template>

<script>
import unicomCompoents from './mixins/unicom-compoents.js'
export default {
  name: 'unicomDate',
  mixins: [unicomCompoents()],
  data () {
    return {
      text: ''
    }
  },
  props: {
    value: {
      // type: (String || Array),
      default: ''
    },
    type: {
      default: 'date'
    },
    valueFormat: {
      default: ''
    },
    format: {
      default: ''
    }
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {
    handleChange (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
</style>
