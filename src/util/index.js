/**
 * Created by jiachenpan on 16/11/18.
 */

// import Layout from '@/page/index/'

// 输出年月日 时分秒
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 转化内容
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
// export function RouterDataTranslate(data, id = 'menuId', pid = 'parentId') {
//   let res = []
//   for (let i = 0; i < data.length; i++) {
//     let temp
//     if (data[i].parentId === null || data[i].parentId === 0) {
//       temp = {
//         'path': '/' + data[i].url,
//         'name': data[i].url,
//         'meta': {
//           'icon': data[i].icon,
//           'title': data[i].name
//         },
//         'title': data[i].name,
//         'menuId': data[i].menuId,
//         'parentId': data[i].parentId,
//         'component': Layout,
//         'redirect': 'home'
//       }
//     } else {
//       temp = {
//         'path': data[i].url.split('/').pop(),
//         'name': data[i].url.split('/').pop(),
//         'menuId': data[i].menuId,
//         'parentId': data[i].parentId,
//         'title': data[i].name,
//         'component': () =>
//           import(`@/views/${data[i].url}/index`),
//         meta: {
//           'icon': data[i].icon,
//           'title': data[i].name
//         }
//       }
//     }
//     res.push(temp)
//   }
//   return res
// }

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'menuId', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

// 转换时间戳
export const format = (now, fmt = 'yyyy-MM-dd') => {
  if (typeof now === 'string') {
    now = now.replace(/-/g, '/')
  }
  now = new Date(now)
  const o = {
    'M+': now.getMonth() + 1, // 月份
    'd+': now.getDate(), // 日
    'h+': now.getHours(), // 小时
    'm+': now.getMinutes(), // 分
    's+': now.getSeconds(), // 秒
    'q+': Math.floor((now.getMonth() + 3) / 3), // 季度
    'S': now.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, String(o[k]).padStart(RegExp.$1.length, 0))
    }
  }
  return fmt
}

// 条件框添加条件
export const setoption = (data = [], lable = 'lable', value = 'value') => {
  let res = []
  if ( data.length > 0) {
    data.forEach(item => {
      item['label'] = item[lable]
      item['value'] = item[value]
      res.push(item)
    })
  }
  return res
}
