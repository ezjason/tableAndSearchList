import {
  validatenull
} from '@/util/validate'
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  const getColorStr = (params) => {
    let {
      color,
      label
    } = params
    return `<span style="color: ${color};">${label}</span>`
  }
  let result = ''
  if (validatenull(dic)) return value
  if (typeof (value) === 'string' || typeof (value) === 'number' || typeof (value) === 'boolean') {
    let index = 0
    index = findArray(dic, value)
    if (index !== -1) {
      if (typeof (dic[index].color) === 'string') {
        const str = getColorStr({
          color: dic[index].color,
          label: dic[index].label
        })
        result = str
      } else {
        result = (dic[index].label)
      }
    } else {
      result = value
    }
  } else if (value instanceof Array && dic[0].children) {
    let index = 0
    let count = 0
    while (count < value.length) {
      index = findArray(dic, value[count])
      if (!validatenull(dic[index])) {
        result = result + dic[index].label + '/'
        dic = dic[index].children
      }
      count++
    }
    if (result.length > 0) {
      result = result.substr(0, result.length - 1)
    }
  } else if (value instanceof Array) {
    result = []
    let index = 0
    value.forEach(ele => {
      index = findArray(dic, ele)
      if (index !== -1) {
        if (typeof (dic[index].color) === 'string') {
          const str = getColorStr({
            color: dic[index].color,
            label: dic[index].label
          })
          result.push(str)
        } else {
          result.push(dic[index].label)
        }
      } else {
        result.push(ele)
      }
    })
    result = result.toString()
  }
  return result
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value === value) {
      return i
    }
  }
  return -1
}
/**
 * 获取字典
 */
export const setDic = (dicData, DIC) => {
  // if(DIC){
  //   switch (dicData){
  //     case "AGING":
  //       if(DIC[0]["label"]!="全部"){
  //         DIC.unshift({
  //           "label":"全部",
  //           "value":""
  //         })
  //       }
  //     break;
  //     case "CENTERNAME":
  //     if(DIC[0]["label"]!="全部"){
  //       DIC.unshift({
  //         "label":"全部",
  //         "value":""
  //       })
  //     }
  //     break;
  //     case "BORROWTYPE":
  //     if(DIC[0]["label"]!="全部"){
  //       DIC.unshift({
  //         "label":"全部",
  //         "value":""
  //       })
  //     }
  //     break;
  //     case "STATUS":
  //     console.log(DIC[0])
  //     if(DIC[0]["label"]!="全部"){
  //       DIC.unshift({
  //         "label":"全部",
  //         "value":""
  //       })
  //     }
  //     break;
  //     case "COLLECTIONSTATUS":
  //     if(DIC[0]["label"]!="全部"){
  //       DIC.unshift({
  //         "label":"全部",
  //         "value":""
  //       })
  //     }
  //     break; 
  //     case "CASESTATUS":
  //     if(DIC[0]["label"]!="全部"){
  //       DIC.unshift({
  //         "label":"全部",
  //         "value":""
  //       })
  //     }
  //     break;
  //   }
  //   console.log(dicData,DIC) 
  //   return (typeof (dicData) === 'string') ? DIC : dicData
  // }else{
    return (typeof (dicData) === 'string') ? DIC : dicData
  // }
  
}
/**
 * 设置px
 */
export const setPx = (val, defval) => {
  if (validatenull(val)) {
    val = defval
  }
  val = val + ''
  if (val.indexOf('%') === -1) {
    val = val + 'px'
  }
  return val
}

/**
 * 表格初始化值
 */

export const formInitVal = (list) => {
  let tableForm = {}
  let searchForm = {}
  list.forEach(ele => {
    if (
      ele.type === 'checkbox' ||
      ele.type === 'cascader' ||
      (ele.type === 'select' && ele.multiple)
    ) {
      tableForm[ele.prop] = []
      if (ele.search) searchForm[ele.prop] = []
    } else if (ele.type === 'number') {
      tableForm[ele.prop] = 0
      if (ele.search) {
        searchForm[ele.prop] = 0
      }
    } else {
      tableForm[ele.prop] = ''
      if (ele.search) {
        searchForm[ele.prop] = ''
      }
    }
    if (!validatenull(ele.valueDefault)) tableForm[ele.prop] = ele.valueDefault
  })
  return {
    tableForm,
    searchForm
  }
}

/**
 * 搜索框获取动态组件
 */
export const getSearchType = (type) => {
  if (type === 'select' || type === 'radio' || type === 'checkbox') {
    return 'unicomSelect'
  } else if (type === 'time') {
    return 'unicomTime'
  } else if (type === 'date' || type === 'datetime' || type === 'datetimerange' || type === 'daterange') {
    return 'unicomDate'
  } else if (type === 'cascader') {
    return 'unicomCascader'
  } else if (type === 'number') {
    return 'unicomInputNumber'
  } else {
    return 'unicomInput'
  }
}

/**
 * 动态获取组件
 */
export const getComponent = (type) => {
  if (type === 'select') {
    return 'unicomSelect'
  } else if (type === 'radio') {
    return 'unicomRadio'
  } else if (type === 'checkbox') {
    return 'unicomCheckbox'
  } else if (type === 'time') {
    return 'unicomTime'
  } else if (type === 'date' || type === 'datetime' || type === 'datetimerange' || type === 'daterange') {
    return 'datetimerange'
  } else if (type === 'cascader') {
    return 'unicomCascader'
  } else if (type === 'number') {
    return 'unicomInputNumber'
  } else if (type === 'ueditor') {
    return 'unicomUeditor'
  } else if (type === 'password') {
    return 'unicomInput'
  } else if (type === 'switch') {
    return 'unicomSwitch'
  } else {
    return 'unicomInput'
  }
}
