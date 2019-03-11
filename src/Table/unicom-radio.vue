<template>
  <el-radio-group v-model="text"
                  @change="handleChange"
                  :disabled="disabled">
    <el-radio v-for="(item,index) in dic"
              :label="item[valueKey]"
              :border="border"
              :key="index">{{item[labelKey]}}</el-radio>
  </el-radio-group>
</template>

<script>
import unicomCompoents from './mixins/unicom-compoents.js'
export default {
  name: 'unicomRadio',
  mixins: [unicomCompoents()],
  data () {
    return {}
  },
  props: {
    value: {}
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
