<template>
  <el-checkbox-group v-model="text"
                     @change="handleChange">
    <el-checkbox v-for="(item,index) in dic"
                 :label="item[valueKey]"
                 :border="border"
                 :min="min"
                 :max="max"
                 :key="index">{{item[labelKey]}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import unicomCompoents from './mixins/unicom-compoents.js'
export default {
  name: 'unicomCheckbox',
  mixins: [unicomCompoents()],
  data () {
    return {}
  },
  props: {
    value: {
      type: Array,
      default: () => []
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
