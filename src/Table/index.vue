<template>
  <div class='basic-container unicom-table'>
    <el-card class="inquire-header"
             v-if="vaildData(option.searchFlag,true)">
      <div class="unicom-header">
        <div class="left">
          <el-form :model="searchForm"
                   :inline="true"
                   ref="searchForm">
            <!-- 循环列搜索框 -->
            <el-form-item :label="column.label"
                          :prop="column.prop"
                          v-for="(column,index) in option.codlumn"
                          :key="index"
                          :label-width="option.labelWidth"
                          v-if="column.search&&formVisible(index)">
              <component :size="option.searchSize"
                         :multiple="column.multiple"
                         :is="getSearchType(column.type)"
                         :ref="column.prop"
                         :restaurants="restaurants"
                         v-model="searchForm[column.prop]"
                         @handleText="handleText"
                         :limitType="column.prop"
                         @handleClick="handleClick(column)"
                         :value-format="column.valueFormat"
                         :type="column.type"
                         :disabled="vaildData(column.Disabled,false)"
                         :placeholder="column.label"
                         :dic="setDic(column.dicData,DIC[column.dicData])"></component>
            </el-form-item>
          </el-form>
        </div>
        <template v-if="formWidth">
          <div class="center">
            <span class="unfold"
                  v-if="vaildData(option.unfold,false)&&formWidth"
                  @click="formWidth = false">
              展开
              <i class="el-icon-arrow-down"></i>
            </span>
          </div>
          <div class="right" style="width: 426px;">
            <div style="width: 100%;">
              <el-button type="primary"
                         @click="searchChnage"
                         icon="el-icon-search"
                         :size="option.searchSize">查 询</el-button>
              <el-button @click="searchReset"
                         icon="el-icon-delete"
                         :size="option.searchSize">重 置</el-button>
            </div>
            <br/>
            <div style="width: 100%;">
              <slot name="seacrch_button" >
              </slot>
              <slot name="export_button" >
                <el-button
                  v-if="export_market_case_data_list"
                  icon="el-icon-download"
                  @click="exportsBtn"
                >导出</el-button>
              </slot>
            </div>

          </div>
        </template>
      </div>
      <div class="unicom-bottom"
           v-if="!formWidth">
        <el-button type="primary"
                   @click="searchChnage"
                   icon="el-icon-search"
                   :size="option.searchSize">查 询</el-button>
        <el-button @click="searchReset"
                   icon="el-icon-delete"
                   :size="option.searchSize">重 置</el-button>

        <slot name="seacrch_button">
        </slot>
        <slot name="export_button" >
          <el-button
            v-if="export_market_case_data_list"
            icon="el-icon-download"
            @click="exportsBtn"
          >导出</el-button>
        </slot>
        <span class="unfold"
              style="float: right;color: #ff4e31;font-size: 13px;cursor: pointer;"
              v-if="!formWidth&&!this.option.mine"
              @click="formWidth = true">
              收缩
              <i class="el-icon-arrow-up"></i>
        </span>
      </div>
    </el-card>
    <el-card :style="'margin-top:'+ ( option.headerBottom ?  + option.headerBottom  : 0 ) + 'px'">
      <!-- 表格功能列 -->
      <div class="unicom-menu">
        <div class="unicom-munu">
          <div class="unicom-menu_left">
            <el-button type="primary"
                       @click="handleAdd"
                       icon="el-icon-plus"
                       v-if="vaildData(option.addBtn,true)">新 增</el-button>
            <el-button type="primary"
                       v-if="market_case_assign"
                       @click="handleAssigning">分 配</el-button>
            <slot name="menuLeft">

            </slot>
          </div>
          <div class="unicom-menu_right">
            <slot name="unicomRight"></slot>
            <el-button icon="el-icon-refresh"
                       circle
                       size="small"
                       @click="refreshChange"
                       v-if="vaildData(option.refreshBtn,false)"></el-button>
            <el-button icon="el-icon-menu"
                       circle
                       size="small"
                       @click="showClomnuBox=true"
                       v-if="vaildData(option.showClomnuBtn,false)"></el-button>
          </div>
        </div>
      </div>
      <!--表格 -->
      <el-table v-loading="tableLoading"
                :data="data"
                tooltip-effect="dark"
                :max-height="option.maxHeight"
                :stripe="option.stripe"
                :show-header="option.showHeader"
                :default-sort="option.defaultSort"
                @row-click="rowClick"
                @row-dblclick="rowDblclick"
                :height="option.height=='auto'?480:option.height"
                :width="setPx(option.width,'100%')"
                ref="table"
                :border="option.border"
                @selection-change="selectionChange"
                :row-class-name="rowClassName"
                highlight-current-row
                class="cm-table">
        <!-- 选择框 -->
        <template v-if="option.selection">
          <el-table-column type="selection"
                           :selectable="selectable"
                           width="50"
                           fixed="left"
                           align="center">
          </el-table-column>
        </template>
        <!-- 序号 -->
        <template v-if="option.index">
          <el-table-column :label="vaildData(option.indexLabel,'#')"
                           type="index"
                           width="40"
                           :index="indexMethod"
                           fixed="left"
                           align="center">
          </el-table-column>
        </template>
        <!-- 循环列 -->
        <!--:show-overflow-tooltip="column.overHidden"-->
        <el-table-column v-if="showClomnuIndex.indexOf(index)!=-1"
                         v-for="(column,index) in option.column"
                         :prop="column.prop"
                         :key="column.prop"
                         :show-overflow-tooltip="column.overHidden"
                         :min-width="column.minWidth"
                         :sortable="column.sortable"
                         :align="vaildData(column.align,option.align)"
                         :header-align="vaildData(column.headerAlign,option.headerAlign)"
                         :width="column.width"
                         :label="column.label"
                         :fixed="column.fixed">
          <template slot-scope="scope">
            <slot :row="scope.row"
                  :dic="setDic(column.dicData,DIC[column.dicData])"
                  :name="column.prop"
                  v-if="column.solt"></slot>
            <template v-else>
              <span v-html="detail(scope.row,column)"
                    v-if="column.type"></span>
              <span v-else>
                {{scope.row[column.prop] !== 0 && !scope.row[column.prop] &&!validatenull(column.valueDefault) ?
                column.valueDefaul :scope.row[column.prop]}}
                </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         v-if="vaildData(option.menu,true)"
                         :label="option.lastColumn?option.lastColumn:'操作'"
                         :align="option.menuAlign"
                         :header-align="option.menuHeaderAlign"
                         :width="vaildData(option.menuWidth,240)">
          <template slot-scope="scope">
            <template v-if="vaildData(option.menu,true)">
              <el-tooltip class="item"
                          effect="dark"
                          content="编 辑"
                          placement="top">
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click.stop="handleEdit(scope.row,scope.$index)"
                           v-if="vaildData(option.editBtn,true)"></el-button>
              </el-tooltip>
              <el-tooltip class="item"
                          effect="dark"
                          content="删 除"
                          placement="top">
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click.stop="handleDel(scope.row,scope.$index)"
                           v-if="vaildData(option.delBtn,true)"></el-button>
              </el-tooltip>
            </template>
            <slot :row="scope.row"
                  name="menu"
                  :index="scope.$index"></slot>
          </template>
        </el-table-column>
      </el-table>
      <!--表格分页按钮 -->
      <el-pagination v-if="vaildData(option.page,true)"
                     class="unicom-pagination pull-right"
                     :current-page.sync="page.currentPage"
                     :background="vaildData(option.pageBackground,true)"
                     :page-size="page.pageSize"
                     @size-change="sizeChange"
                     @current-change="currentChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total"></el-pagination>
      <!-- 表单 -->
      <el-dialog lock-scroll
                 :fullscreen="vaildData(option.formFullscreen,false)"
                 :modal-append-to-body="false"
                 class="unicom-table-dialog"
                 :append-to-body="true"
                 :title="boxType==0?'新增':'编辑'"
                 :visible.sync="boxVisible"
                 :width="vaildData(option.formWidth,'50%')"
                 :before-close="hide">
        <el-form ref="tableForm"
                 class="unciom-form"
                 :model="tableForm"
                 :inline="vaildData(option.inline,false)"
                 :label-position="option.labelPosition"
                 :label-width="setPx(option.labelWidth,80)"
                 :rules="tableFormRules">
          <el-row :gutter="20"
                  :span="24">
            <template v-for="(column,index) in option.column">
              <el-col :span="column.span || 12"
                      :key="index"
                      v-if="boxType==0?vaildData(column.addVisdiplay,true):vaildData(column.editVisdiplay,true)">
                <el-form-item :style="{height:setPx(column.formHeight,'auto')}"
                              :label="column.label"
                              :prop="column.prop"
                              :label-width="setPx(column.labelWidth,option.labelWidth || 120)">
                  <slot :value="tableForm[column.prop]"
                        :column="column"
                        :dic="setDic(column.dicData,DIC[column.dicData])"
                        :name="column.prop+'Form'"
                        v-if="column.formsolt"></slot>
                  <component :is="getComponent(column.type)"
                             v-else
                             v-model="tableForm[column.prop]"
                             :props="column.props || option.props"
                             :precision="column.precision"
                             :multiple="column.multiple"
                             :height="setPx(column.formHeight,'auto')"
                             :size="column.size"
                             :clearable="column.clearable"
                             :type="column.type"
                             :minRows="column.minRows"
                             :maxRows="column.maxRows"
                             :step="column.step"
                             :controls-position="column.controlsPosition"
                             :expand-trigger="column.expandTrigger"
                             :show-all-levels="column.showAllLevels"
                             :filterable="column.filterable"
                             :separator="column.separator"
                             :border="column.border"
                             :min="column.min"
                             :max="column.max"
                             :label="column.label"
                             :placeholder="column.placeholder"
                             :dic="setDic(column.dicData,DIC[column.dicData])"
                             :disabled="boxType==0?vaildData(column.addDisabled,false):vaildData(column.editDisabled,false)"
                             :format="column.format"
                             :value-format="column.valueFormat"></component>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="handleUpdate"
                     v-if="boxType==1">修 改</el-button>
          <el-button type="primary"
                     @click="handleSave"
                     v-else>新 增</el-button>
          <el-button @click="hide">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog lock-scroll
                 :modal-append-to-body="false"
                 :append-to-body="true"
                 title="多选"
                 :visible.sync="showClomnuBox">
        <el-checkbox-group v-model="showClomnuIndex">
          <el-row :span="24">
            <el-col :span="6"
                    v-for="(item,index) in showClomnuList"
                    :key="index">
              <el-checkbox :label="item.index">{{item.label}}</el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-dialog>
    </el-card>
    <el-card v-if="vaildData(option.selected,true)"
             class="selected">
      <span class="message">
        <i class="el-icon-warning"></i>已选择{{tableSelect.length}}项 </span>
      <span class="clear"
            @click="handleClearSelected">清空</span>
    </el-card>
    <el-dialog :title="option.textMap"
               v-if="dialogDeptVisible"
               :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree"
               :data="treeDeptData"
               :default-checked-keys="checkedKeys"
               check-strictly
               node-key="id"
               highlight-current
               ref="deptTree"
               @node-click="getNodeData"
               :props="defaultProps"
               :filter-node-method="filterNode"
               default-expand-all>
      </el-tree>
    </el-dialog>
  </div>
</template>
<script>
import { validatenull } from '@/util/validate.js'
import mixins from './mixins'
// import moment from 'moment'
// import { debug } from 'util';
export default {
  mixins: [mixins()],
  page: {
    type: Object,
    default () {
      return {
        // total: 0, // 总页数
        // currentPage: 0, // 当前页数
        // pageSize: 10, // 每页显示多少条
        // background: true // 背景颜色
      }
    }
  },
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    },
    restaurants: {
      type: Array
    },
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableList: {
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    beforeOpen: Function,
    beforeClose: Function,
    rowClassName: Function,
    page: {
      type: Object,
      default () {
        return {
          total: 0, // 总页数
          currentPage: 0, // 当前页数
          pageSize: 10, // 每页显示多少条
          background: true // 背景颜色
        }
      }
    },
    export_market_case_data_list:{
      type: Boolean,
      default: false
    },
    market_case_assign:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultForm: {
        tableForm: {},
        searchForm: {}
      },
      searchForm: {
      },
      boxVisible: false,
      boxType: 0,
      showClomnuIndex: [],
      showClomnuBox: false,
      showClomnuList: [],
      tableForm: {},
      tableFormRules: {},
      tableIndex: -1,
      tableSelect: [],
      outsideHeight: 0,
      dialogDeptVisible: false,
      checkedKeys: [],
      formWidth: this.option.expand,
      formIndex: 0,
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeDeptData: []
    }
  },
  created () {
    this.showClomnuInit()
  },
  mounted () {
    this.$nextTick(() => {
      let width = document.querySelector('.unicom-header .left').offsetWidth
      this.formIndex = Math.floor(width / 280)
      let allheight = 0

      if (this.vaildData(this.option.selected, true)) {
        allheight = allheight + 120
      }

      if (this.vaildData(this.option.searchFlag, true)) {
        allheight = allheight + 350
      }
      try {
        let height = document.querySelector('.outside-search').offsetHeight
        this.outsideHeight = allheight + height + 40
      } catch (e) {
        this.outsideHeight = allheight + 0
      }
      try {
        let caseheight = document.querySelector('.case-message').offsetHeight
        this.outsideHeight = this.outsideHeight + caseheight + 50
      } catch (e) {
        this.outsideHeight = this.outsideHeight + 0
      }
    })
  },
  watch: {
    page: {
      handle (val, oldVal) {
        console.log(val, oldVal)
      },
      deep: true
    }
  },
  computed: {
    searchFlag: function () {
      return !validatenull(this.searchForm)
    }
  },
  methods: {
    selectable (row, index) {
      if (this.option.selectable) {
        return this.$parent[selectable](row, index)
      } else {
        return true
      }
    },
    formVisible: function (index) {
      if (!this.vaildData(this.option.unfold, false)) {
        return true
      }
      if (this.formWidth) {
        return this.formIndex > index
      } else {
        return !this.formWidth
      }
      return true
    },
    detail (row, column) {
      let result = row[column.prop]
      if (column.type) {
        if (
          (column.type === 'date' ||
            column.type === 'time' ||
            column.type === 'daterange' ||
            column.type === 'datetime') &&
          column.format
        ) {
          if(result) {
            const format = column.format
              .replace('DD', 'dd')
              .replace('YYYY', 'yyyy')
            // result = moment(result).format(format)
            result = this.$format(new Date(result),format)
          } else {
            result = ''
          }
        }
        if (column.dicData) {
          result = this.findByvalue(
            typeof column.dicData === 'string'
              ? this.DIC[column.dicData]
              : column.dicData,
            result
          )
        }
      }
      if(result !== 0 && !result && !validatenull(column.valueDefault)) {
        result = column.valueDefault
      }
      if (column.formatter && typeof column.formatter === 'function') {
        result = column.formatter(row, result)
      }
      return result
    },
    indexMethod (index) {
      return (index + 1) + ((this.page.currentPage - 1) * this.page.pageSize)
    },
    // 表单初始化
    formInit () {
      this.defaultForm = this.formInitVal(this.option.column)
      this.tableForm = Object.assign({}, this.defaultForm.tableForm)
      this.searchForm = Object.assign({}, this.defaultForm.searchForm)
    },
    // 搜索回调
    searchChnage () {
      let searchForm = this.searchForm
      for (let item in searchForm) {
        if (searchForm[item] !== 0 && !searchForm[item]) {
          delete searchForm[item]
        }
      }
      this.$emit('search-change', this.searchForm)
    },
    // 选择回调
    selectionChange (val) {
      this.tableSelect = val
      this.$emit('selection-change', val)
    },
    // 行双击
    rowDblclick (row, event) {
      this.$emit('row-dblclick', row, event)
    },
    // 行单机
    rowClick (row, event, column) {
      this.$emit('row-click', row, event, column)
    },
    // 搜索清空
    searchReset () {
      this.treeDeptData = []
      this.$parent.handleTreeDate && this.$parent.handleTreeDate()
      this.$parent.handleGetCenterChildDept && this.$parent.handleGetCenterChildDept()
      // this.$refs.deptName && ( this.$refs.deptName[0].value = '')
      this.$refs['searchForm'].resetFields()
      this.searchForm = {}
    },
    // 页大小回调
    sizeChange (val) {
      this.$emit('size-change', val)
    },
    // 页码回调
    currentChange (val, form) {
      this.$emit('current-change', val, this.searchForm)
    },
    // 刷新
    refreshChange () {
      this.$emit('refresh-change', this.page)
    },
    // 初始化
    showClomnuInit: function () {
      this.option.column.forEach((ele, index) => {
        let obj = {
          label: ele.label,
          index: index
        }
        if (validatenull(ele.hide)) {
          this.showClomnuIndex.push(index)
        }
        this.showClomnuList.push(Object.assign({}, obj))
      })
    },
    // 校验开关
    vaildData (val, dafult) {
      if (typeof val === 'boolean') {
        return val
      }
      return !validatenull(val) ? val : dafult
    },
    // 新增事件
    handleAdd () {
      this.boxType = 0
      this.tableForm = Object.assign({}, this.defaultForm.tableForm)
      this.show()
    },
    // 编辑
    handleEdit (row, index) {
      this.tableForm = Object.assign({}, row)
      this.tableIndex = index
      this.boxType = 1
      this.show()
    },
    // 删除
    handleDel (row, index) {
      this.$emit('row-del', row, index)
    },
    rulesInit () {
      this.tableFormRules = {}
      this.option.column.forEach(ele => {
        if (ele.rules) this.tableFormRules[ele.prop] = ele.rules
      })
    },
    // 编辑
    rowEdit (row, index) {
      this.tableForm = Object.assign({}, row)
      this.tableIndex = index
      this.boxType = 1
      this.show()
    },
    // 删除
    rowDel (row, index) {
      this.$emit('row-del', row, index)
    },
    // 保存
    handleSave () {
      this.$refs['tableForm'].validate(valid => {
        if (valid) {
          this.$emit('row-save', Object.assign({}, this.tableForm), this.hide)
        }
      })
    },
    // 清空选中按钮
    handleClearSelected () {
      this.$refs.table.clearSelection()
      this.tableSelect = []
    },
    // 更新
    handleUpdate () {
      this.$refs['tableForm'].validate(valid => {
        if (valid) {
          const index = this.tableIndex
          this.$emit(
            'row-update',
            Object.assign({}, this.tableForm),
            index,
            this.hide
          )
        }
      })
    },
    // 显示弹窗
    show (cancel) {
      const callack = () => {
        if (cancel !== true) {
          this.boxVisible = true
        }
      }
      if (typeof this.beforeOpen === 'function') this.beforeOpen(callack)
      else callack()
    },
    // 隐藏表单
    hide (cancel) {
      const callack = () => {
        if (cancel !== false) {
          this.$nextTick(() => {
            // 对表单进行重置，字段移除校验结果，值重置为初始值
            this.$refs['tableForm'].resetFields()
          })
          this.boxVisible = false
        }
      }
      if (typeof this.beforeClose === 'function') this.beforeClose(callack)
      else callack()
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData (data) {
      this.dialogDeptVisible = false;
      this.searchForm.deptId = data.id;
      this.searchForm.deptName = data.name;
    },
    handleClick (row) {
      if (row.tree) {
        this.dialogDeptVisible = true
      }
    },
    valchange (value, limitType) {
      this.$emit("valchange", value, limitType)
    },
    handleText (val, type) {
      this.$nextTick(() => {
        switch (type) {
          case 'userPhone':
            this.$nextTick(() => {
              this.$refs.userPhone[0].text = this.$refs.userPhone[0].text.replace(/\D/g, '')
              if (val.length > 11) {
                let res = val.slice(0, 11)
                if (/^1[345678]\d{9}$/.test(res)) {
                  this.$nextTick(() => {
                    this.$refs.userPhone[0].text = res
                  })
                } else {
                  this.$refs.userPhone[0].text = ''
                  this.$message.error("号码格式有误请重新输入！")
                }
              }
            })
            break;
          case 'contactPhone':
            this.$nextTick(() => {
              this.$refs.contactPhone[0].text = this.$refs.contactPhone[0].text.replace(/\D/g, '')
              if (val.length > 11) {
                let res = val.slice(0, 11)
                if (/^1[345678]\d{9}$/.test(res)) {
                  this.$nextTick(() => {
                    this.$refs.contactPhone[0].text = res
                  })
                } else {
                  this.$refs.contactPhone[0].text = ''
                  this.$message.error("号码格式有误请重新输入！")
                }
              }
            })
            break;
          case "phone":
            this.$nextTick(() => {
              this.$refs.phone[0].text = this.$refs.phone[0].text.replace(/\D/g, '')
              if (val.length > 11) {
                let res = val.slice(0, 11)
                if (/^1[345678]\d{9}$/.test(res)) {
                  this.$nextTick(() => {
                    this.$refs.phone[0].text = res
                  })
                } else {
                  this.$refs.phone[0].text = ''
                  this.$message.error("号码格式有误请重新输入！")
                }
              }
            })
            break;
          case 'caseId':
            this.$nextTick(() => {
              this.$refs.caseId[0].text = this.$refs.caseId[0].text.replace(/\D/g, '')
            })
            break;
          case 'overdueDayMin':
            this.$nextTick(() => {
              this.$refs.overdueDayMin[0].text = this.$refs.overdueDayMin[0].text.replace(/\D/g, '')
            })
            break;
          case 'overdueDayMax':
            if (!res) {
              this.$nextTick(() => {
                this.$refs.overdueDayMax[0].text = this.$refs.overdueDayMax[0].text.replace(/\D/g, '')
              })
            }
            break;
          case 'centerId':
            this.$nextTick(() => {
              this.$refs.deptName[0] = ''
              delete this.searchForm.deptName
              this.$emit("valchange", val, type)
            })
            break;
        }
      })
    },
    exportsBtn(){
      let searchForm = this.searchForm
      for (let item in searchForm) {
        if (searchForm[item] !== 0 && !searchForm[item]) {
          delete searchForm[item]
        }
      }
      this.$emit('exportEvent', this.searchForm)
    },
    handleAssigning(){
      this.$emit('handleAssigning', this.searchForm)
    },
    //初始化时间段的默认值，当天时间段
    searchFormFun(){
      if(this.option.callTime){
        let start = new Date().getFullYear() + '-'+ (new Date().getMonth()+1) + '-' + new Date().getDate()+ ' 00:00:00'
        let end = new Date().getFullYear() + '-'+ (new Date().getMonth()+1) + '-' + new Date().getDate()+' 23:59:59'
        this.$set( this.searchForm,'callTime', [ start, end])
        console.log(this.searchForm)
      }

    }
  }
}
</script>
<style lang="less">
.unicom-table-dialog {
  .el-checkbox-group {
    display: flex;
    flex-flow: wrap;
    .el-checkbox {
      // flex: 1;
      margin-left: 10px;
    }
  }
  .el-dialog__footer {
    border-top: 1px solid#E5E9EF;
    padding: 10px 20px;
  }
  .el-button--primary {
    background-image: linear-gradient(-90deg, #ff4645 0%, #ff6000 100%);
    border: 0px;
    border-radius: 2px;
  }
}
.unicom-table {
  .el-button--primary {
    background-image: linear-gradient(-90deg, #ff4645 0%, #ff6000 100%);
    border: 0px;
    border-radius: 2px;
  }
  .el-table__fixed {
    height: 97.6% !important;
  }
  .el-table__fixed-right {
    height: 97.6% !important;
  }

  .el-table td {
    border: 0px;
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    background-image: linear-gradient(-90deg, #ff4645 0%, #ff6000 100%);
    border-radius: 5px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px #ededed;
    border-radius: 0;
    background: #ededed;
  }

  .el-pager {
    .number {
      border-radius: 15px !important;
      background: #ffffff !important;
      color: #7e8e9f !important;
      box-shadow: 0 2px 6px 0 rgba(139, 157, 175, 0.1);
    }
    .active {
      border: 1px solid #ff4645;
      // border-image: -webkit-linear-gradient(#ff4645, #ff6000) 30 30;
      // border-image: -moz-linear-gradient(#ff4645, #ff6000) 30 30;
      // border-image: linear-gradient(#ff4645, #ff6000) 30 30;
    }
  }

  .cm-table {
    margin: auto;
    .el-button {
      [class^="icon-"] {
        font-size: 12px !important;
        color: #c5ccd6;
      }
      i:hover {
        color: #040000;
      }
    }
  }
  .inquire-header {
    min-height: 78px;
    .el-card__body {
      padding: 0 0 0 0px;
    }
    .unicom-header {
      display: flex;
      flex-flow: row;
      .left {
        padding: 10px;
        flex: auto;
        display: flex;
        align-items: center;
        .el-form {
          display: flex;
          align-items: center;
          flex-flow: wrap;
          .el-form-item {
            margin: 5px;
            max-width: 600px;
            .el-form-item__content {
              .el-date-editor {
                width: 310px !important;
              }
              .el-date-editor--date {
                min-width: 180px;
              }
              .el-input {
                width: 180px !important;
              }
            }
          }
        }
      }
      .center {
        min-width: 49px;
        padding-top: 30px;
        .unfold {
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #ff4e31;
          letter-spacing: 0;
          cursor: pointer;
          i {
            transform: scale(0.8);
          }
        }
      }
      .right {
        min-width: 426px;
        min-height: 78px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-left: 1px solid #d8d8d8;
      }
      & > .el-button {
        padding: 12px 25px;
      }
    }
  }
  .unicom-bottom {
    border-top: 1px solid #edeff3;
    padding: 20px;
  }
  .unicom-container {
    margin: 0 auto;
    width: 99%;
  }
  .unicom-pagination {
    margin-top: 15px;
    padding: 10px 20px;
  }
  .unicom-form {
    padding: 0 8px;
  }

  .unicom-menu {
    position: relative;
    width: 100%;
    min-height: 40px;
    height: auto;
    overflow: hidden;
    margin-bottom: 12px;
    .unicom-menu_left,
    .unicom-menu_right {
      position: absolute;
      height: auto;
      overflow: hidden;
    }
    .unicom-menu_left {
      left: 0;
    }
    .unicom-menu_right {
      right: 0;
      .el-button {
        margin-left: 5px;
      }
    }
  }
  .unicom--overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  .selected {
    .message {
      i {
        color: #ff4645;
      }
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #475669;
      letter-spacing: 0.81px;
    }
    .clear {
      margin-left: 10px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ff4c35;
      letter-spacing: 0.81px;
      cursor: pointer;
    }
  }
}
</style>
