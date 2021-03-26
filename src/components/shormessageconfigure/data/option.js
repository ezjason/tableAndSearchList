import {
  DIC
} from './dic'
import {
  format
} from '@/util'
export default {
  index: false,
  border: false,
  expand: true,
  unfold: true,
  stripe: false,
  selection: false,
  menuWidth: 250,
  menuAlign: 'center',
  headerBottom: 20,
  indexLabel: '序号',
  editBtn: false,
  addBtn: false,
  delBtn: false,
  align: 'center',
  height: 'auto',
  selected: false,
  formWidth: '500px',
  treeDeptData: [],
  textMap: '选择部门',
  dicData: DIC,
  codlumn: [{
    label: '输入框',
    prop: 'smsName',
    search: true
  },{
    label: '下拉框',
    prop: 'borrowType',
    type: 'select',
    dicData: 'CASETYPE',
    search: true
  },{
    label: '日期',
    prop: 'date',
    type: 'daterange',
    dicData: 'data',
    search: true
  }],
  column: [
    {
      label: '编号',
      prop: 'id',
      sortable: false,
      addVisdiplay: true,
      editVisdiplay: true,
      span: 24,
      fixed: true,
      // width: 50
    }, {
      label: '名称',
      prop: 'smsName',
      addVisdiplay: true,
      type: 'select',
      span: 24,
      fixed: true,
      // width: 80
    }, {
      label: '模板',
      prop: 'smsTemplate',
      overHidden:true,//超出文本处理
      sortable: false,
      valueDefault: '',
      addVisdiplay: false,
      editVisdiplay: false,
      type: 'string',
      fixed: true,
    },
    {
      label: '逾期',
      addVisdiplay: false,
      editVisdiplay: false,
      // prop: 'overdueDayMin',
      sortable: false,
      valueDefault: '',
      type: 'string',
      // width: 100,
      formatter: (row, value) => {
        // console.log(row)
        let str = row.overdueDayMin + '-' + row.overdueDayMax
        return str
      }
    }, {
      label: '类型',
      prop: 'borrowTypeName',
      sortable: false,
      solt:true,
      valueDefault: '',
      span: 24,
      type:'string'
      // width: 60

    },  {
      label: '状态',
      prop: 'enabled',
      sortable: false,
      valueDefault: '',
      span: 24,
      type:'string',
      formatter: (row, value) => {
        return value==1?'启用':'停用'
      }
    }, {
      label: '操作时间',
      prop: 'updateTime',
      sortable: false,
      valueDefault: '',
      span: 24,
      format: 'YYYY-MM-DD hh:mm:ss',
      type: 'date',
      // width: 80

    },{
      label: '操作人',
      prop: 'operatorUserName',
      sortable: false,
      valueDefault: '',
      // width: 80,
      type: 'select',
      dicData: 'STATUS',
      formatter: (row, reslut) => {
        return row.operatorUserName
      }
    }
  ]
}

