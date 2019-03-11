<template>
  <el-input-number v-model="text"
                   @change="handleChange"
                   :precision="precision"
                   :size="size"
                   :min="minRows"
                   :max="maxRows"
                   :controls-position="controlsPosition"
                   :label="placeholder?placeholder:`请输入${label}`"
                   :disabled="disabled"></el-input-number>
</template>

<script>
import unicomCompoents from './mixins/unicom-compoents.js'
export default {
  name: 'unicomInputNumber',
  mixins: [unicomCompoents()],
  data () {
    return {}
  },
  props: {
    value: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    controlsPosition: {
      type: String,
      default: 'right'
    },
    precision: {
      type: Number,
      default: 0
    },
    minRows: {
      type: Number,
      default: -Infinity
    },
    maxRows: {
      type: Number,
      default: Infinity
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
