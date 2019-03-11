<template>
  <div>
    <el-input :size="size"
              :clearable="clearable"
              v-model="text"
              :type="typeParam"
              :autosize="{ minRows: minRows, maxRows: maxRows}"
              :placeholder="placeholder?placeholder:`请输入${label}`"
              @change="handleChange(text,limitType)"
              @focus="handleClick(true)"
              @blur="handleClick(false)"
              @input.native="handleKeyup(text,limitType)"
              :disabled="disabled"></el-input>
  </div>
</template>

<script>
import unicomCompoents from './mixins/unicom-compoents.js'
export default {
  name: 'unicomInput',
  mixins: [unicomCompoents()],
  data () {
    return {}
  },
  props: {
    restaurants: {
      type: Array
    },
    value: {
      type: [String],
      default: ''
    },
    minRows: {
      type: String,
      default: '3'
    },
    maxRows: {
      type: String,
      default: '4'
    }
  },
  watch: {},
  computed: {
    typeParam: function () {
      if (this.type === 'textarea') {
        return 'textarea'
      } else if (this.type === 'password') {
        return 'password'
      } else {
        return 'text'
      }
    }
  },
  created () { },
  mounted () { },
  methods: {
    handleChange (value, limitType) {
      this.$emit('input', value, limitType)
    },
    handleClick (value) {
      this.$emit('handleClick', value)
    },
    handleKeyup (text, limitType) {
      this.$emit('handleText', text, limitType)
    }
  }
}
</script>

<style>
</style>
