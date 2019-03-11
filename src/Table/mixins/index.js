import {
  validatenull
} from '@/util/validate.js'
import * as utils from '@/utils'
import unicomInput from '../unicom-input'
import unicomSelect from '../unicom-select'
import unicomRadio from '../unicom-radio'
import unicomCheckbox from '../unicom-checkbox'
import unicomCascader from '../unicom-cascader'
import unicomDate from '../unicom-date'
import unicomTime from '../unicom-time'
import unicomInputNumber from '../unicom-input-number'
import unicomUeditor from '../unicom-ueditor'
import unicomSwitch from '../unicom-switch'
export default function () {
  return {
    props: {
      option: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    components: {
      unicomInput,
      unicomSelect,
      unicomRadio,
      unicomCheckbox,
      unicomDate,
      unicomTime,
      unicomCascader,
      unicomInputNumber,
      unicomUeditor,
      unicomSwitch
    },
    watch: {
      value: {
        handler(n, o) {
          this.formVal()
        },
        deep: true
      },
      option: {
        handler(n, o) {
          this.init()
        },
        deep: true
      },
      tableForm: {
        handler(n, o) {
          this.$emit('input', this.tableForm)
        },
        deep: true
      },
      form: {
        handler(n, o) {
          this.$emit('input', this.form)
        },
        deep: true
      }
    },
    data() {
      return {
        DIC: {},
        dicList: [],
        dicCascaderList: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        // 初始化工具
        this.initFun()
        // 规则初始化
        this.rulesInit()
        // 初始化字典
        this.dicInit()
        // 初始化表单
        this.formInit()
      },
      dicInit() {
        this.option.column.forEach(ele => {
          if (!validatenull(ele.dicUrl) && ele.cascaderFirst) {
            this.dicCascaderList.push({
              dicUrl: ele.dicUrl,
              dicData: ele.dicData
            })
          } else if (validatenull(ele.dicUrl) && ele.dicData && typeof ele.dicData === 'string') {
            this.dicList.push(ele.dicData)
          }
        })
        this.GetDic().then(data => {
          this.DIC = data
        })
      },
      vaildData(val, dafult) {
        if (typeof val === 'boolean') {
          return val
        }
        return !validatenull(val) ? val : dafult
      },
      GetDicByType(href) {
        return new Promise((resolve, reject) => {
          this.$http.get(href).then(function (res) {
            // 降级处理
            const list = res.data
            if (!validatenull(list.data)) {
              resolve(list.data instanceof Array ? list.data : [])
            } else if (!validatenull(list)) {
              resolve(list instanceof Array ? list : [])
            } else {
              resolve([])
            }
          })
        })
      },
      GetDic() {
        return new Promise((resolve, reject) => {
          let result = []
          let dicData = {}
          let locaDic = this.option.dicData || []
          let list = this.dicList
          let cascaderList = this.dicCascaderList
          if (validatenull(list) && validatenull(cascaderList)) {
            return
          }
          list.forEach(ele => {
            result.push(new Promise((resolve, reject) => {
              if (validatenull(this.option.dicUrl)) {
                resolve(locaDic[ele])
              } else {
                this.GetDicByType(`${this.option.dicUrl}/${ele}`).then(function (res) {
                  resolve(res)
                })
              }
            }))
          })
          cascaderList.forEach(ele => {
            result.push(new Promise((resolve, reject) => {
              this.GetDicByType(ele.dicUrl, ele.dicData).then(function (res) {
                list.push(ele.dicData)
                resolve(res)
              })
            }))
          })
          Promise.all(result).then(data => {
            list.forEach((ele, index) => {
              dicData[ele] = data[index]
            })
            if (validatenull(this.option.dicUrl)) {
              dicData = Object.assign({}, dicData, locaDic)
            }
            resolve(dicData)
          })
        })
      },
      initFun() {
        Object.keys(utils).forEach(key => {
          this[key] = utils[key]
        })
      }
    }
  }
};
