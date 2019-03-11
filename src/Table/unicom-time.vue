<template>
  <el-time-picker v-model="text"
                  type="date"
                  :size="size"
                  :format="format"
                  :value-format="valueFormat"
                  :placeholder="placeholder?placeholder:`请输入${label}`"
                  @change="handleChange"
                  :disabled="disabled"> </el-time-picker>
</template>

<script>
import unicomCompoents from './mixins/unicom-compoents.js'
export default {
  name: 'unicomTime',
  mixins: [unicomCompoents()],
  data () {
    return {}
  },
  props: {
    value: {
      required: true
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

<style scoped>
</style>
