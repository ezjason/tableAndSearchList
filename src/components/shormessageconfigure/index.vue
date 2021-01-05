<template>
  <div class="super">
    <unicom-tbale :data="tableData"
                  :page="page"
                  ref="super"
                  :table-loading="tableLoading"
                  :before-open="boxhandleOpen"
                  :option="tableOption"
                  @refresh-change="handlerefreshChange"
                  @current-change="handleCurrentChange"
                  @search-change="handleSearchChange"
                  @size-change="handelSizechange"
                  @selection-change="handleSelectionChange"
                  :before-close="boxhandleClose"
                  @row-save="handleSave"
                  @row-update="handleUpdate"
                  @row-del="handleDel"
                  @valchange="handlechangeVal">
      <template slot="menuLeft">
        <el-button type="success" @click="add(1)">按钮</el-button>
      </template>
      <template slot="menu"
                slot-scope="scope">
        <el-tooltip class="item"
                    effect="dark"
                    :open-delay="1"
                    content="修改"
                    placement="top">
          <el-button type="success"
                     @click="add(scope.row,scope.$index)"
                     size="mini">修改</el-button>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    :open-delay="1"
                    :content="scope.row.enabled==1?'停用':'启用'"
                    placement="top">
          <el-button :type="scope.row.enabled==1?'danger':'warning'"
                     @click="handleStart(scope.row,scope.$index)"
                     size="mini">{{scope.row.enabled==1?'停用':'启用'}}</el-button>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    :open-delay="1"
                    content="删除"
                    placement="top">
          <el-button type="info"
            @click="handleDelete(scope.row,scope.$index)"
            size="mini">删除</el-button>
        </el-tooltip>
      </template>
    </unicom-tbale>
    <el-dialog :title="addType"
               :width="'398px'"
               :visible.sync="allotVisible">
      <el-form :model="allot"
               ref="allot"
               :rules="allotRules"
               label-width="120px"
               :label-position="'right'">
        <el-form-item prop="name"
                      label="名称：">
          <el-input v-model="allot.name" placeholder="名称" maxlength="20" :disabled="edit"></el-input>
        </el-form-item>
        <el-form-item prop="type"
                      label="类型：">
          <el-select v-model="allot.type"
                     :disabled="edit"
                     placeholder="请选择类型">
            <el-option v-for="(item,index) in allotList"
                       :key="index"
                       :label="item.borrowTypeName"
                       :value="item.borrowType">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="minovertime"
                      label="逾期：">
          <el-input v-model="allot.minovertime" placeholder="最小逾期天数" maxlength="10" @keyup.native="numberVal(allot.minovertime,1)"></el-input>
        </el-form-item>
        <el-form-item prop="maxovertime"
                      label="">
        <el-input v-model="allot.maxovertime" placeholder="最大逾期天数" maxlength="10" @keyup.native="numberVal(allot.minovertime,2)"></el-input>
      </el-form-item>
        <el-form-item prop="textarea"
                      label="模板：">
          <el-input type="textarea" v-model="allot.textarea" placeholder="模板" :disabled="edit" :autosize="{ minRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleHideAllot">保存</el-button>
         <el-button
                    @click="allotVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import unicomTbale from '@/Table/index'
import { validatenull } from '@/util/validate.js'
import tableOption from './data/option'
// import {  getCaseDataListPage, getCenterTree, getFindAllBorrowTypeList, getFindAllCaseAgingList,
//   getCenterChildDept, apiFindCaseAssignCenterRecord, apiCaseAssignToCenterByIds, apiRetractCaseDataPoolByIds, getCenterChild} from '@/api/data'
// import {apiFindCaseBackReasonList} from '@/api/task'
// import {ApiAllBorrowTypeList,ApiSaveBorrowTypeList,ApiStopBorrowTypeList,ApiDelBorrowTypeList,ApiStartBorrowTypeList,ApiHuixianBorrowTypeList,ApiUpdateBorrowTypeList} from '@/api/message'

export default {
  components: {
    unicomTbale
  },
  name: 'SuperDataCenter',
  data () {
    return {
      deptId: null,//催收下拉的关联ID
      tableRow: [], // 选择 表格
      tableSearch: {}, // 表格搜索条件
      tableLoading: false,
      tableOption: tableOption, // 表格设置属性
      tableData: [{
        id:1,
        smsName:'jason',
        smsTemplate:'table',
        overdueDayMin:'2019-03-11 00:00:00',
        overdueDayMax:'2019-03-11 23:59:59',
        borrowTypeName:'类型',
        enabled:1,
        updateTime:new Date(),
        operatorUserName:'jason-hhc'
      }], // 表格数据
      option: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 100 // 每页显示多少条
      },
      allot: {
        name:'',
        type:'',
        message:'',
        minovertime:'',
        maxovertime:'',
        textarea:''
      },
      allotVisible: false,
      allotList: [],
      allotRules: {
        name: [
          {
            required: true,
            message: "请填写短信配置名称",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择案件类型",
            trigger: "change"
          }
        ],
        message: [
          {
            required: true,
            message: "请选择短信通道",
            trigger: "change"
          }
        ],
        minovertime: [
          {
            required: true,
            message: "请填写逾期范围",
            trigger: "blur"
          }
        ],
        maxovertime: [
          {
            required: true,
            message: "请填写逾期范围",
            trigger: "blur"
          }
        ],
        textarea:[
          {
            required: true,
            message: "请填写短信模板",
            trigger: "blur"
          }
        ],
      },
      addType:null,
      saveBtn:true,//新增 修改保存按钮
      edit:false,
      editId:null // 编辑的数据id
    }
  },

  created () {
  },
  mounted () {
    // this.handleList({})
  },
  methods: {
    handelSizechange (val) {
      this.page.pageSize = val
      this.handleList(this.tableSearch)
    },
    operationType (row, column, value) {
      switch (value) {
        case 0:
          return '分配'
        case 1:
          return '撤回'
        default:
          return '未知'
      }
    },
    operationDate (row, column, value) {
      return this.$format(new Date(value), 'yyyy-MM-dd hh:mm:ss')
    },
    handleList (form) {
      this.tableLoading = true
      let param = {
        page: this.page.currentPage,
        limit: this.page.pageSize
      }
      form = JSON.parse(JSON.stringify(form))
      if (!form.deptName) {
        delete form.deptId
      }
      delete form.createTime
      delete form.deptName
      param = Object.assign(param, form)
      // getCaseDataListPage(param)
      ApiAllBorrowTypeList(param)
        .then(res => {
          res = res.data
          if (res.code === 200) {
            this.tableData = res.data.records
            this.page = {
              total: res.data.total,
              currentPage: res.data.current,
              pageSize: res.data.size
            }
            this.tableLoading = false
          } else {
            this.$message(res.msg)
          }
        })
    },
    // 获取催收下拉列表
    handleGetCenterTree () {
      getCenterTree({}).then((res) => {
        this.$set(this.tableOption.dicData, 'CENTERNAME', this.$setoption(res.data, 'name', 'id'))
        this.allotList = this.$setoption(res.data, 'name', 'id')
        console.log('das', this.allotList)
      })
    },
    // 获取案件类型下拉列表
    handleGetFindAllBorrowTypeList () {
      getFindAllBorrowTypeList({}).then((res) => {
        if (res.data.code === 200) {
          this.$set(this.tableOption.dicData, 'CASETYPE', this.$setoption(res.data.data, 'borrowTypeName', 'borrowType'))
          this.allotList = res.data.data
          this.tableOption.column.forEach((item) => {
            if (item.prop === 'borrowType') {
              this.$set(item, 'formatter', (row, reslut) => {
                let option = res.data.data
                let data = option.filter((item) => {
                  return item.borrowType === row.borrowType
                })
                return data[0].borrowTypeName
              })
            }
          })
        } else {
          this.$message(res.data.msg)
        }
      })
    },
    // 获取借案件账龄下拉列表
    handleGetFindAllCaseAgingList () {
      getFindAllCaseAgingList({}).then((res) => {
        if (res.data.code === 200) {
          this.$set(this.tableOption.dicData, 'CASETYPE', this.$setoption(res.data.data, 'borrowTypeName', 'borrowType'))
        } else {
          this.$message(res.data.msg)
        }
      })
    },
    /**
    * @title 数据添加
    * @param row 为当前的数据
    * @param done 为表单关闭函数
    *
    **/
    handleSave (row, done) {
      this.tableData.push(Object.assign({}, row))
      done()
      setTimeout(() => {
        this.$notify({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
      })
    },
    /**
    * @title 数据删除
    * @param row 为当前的数据
    * @param index 为当前更新数据的行数
    *
    **/
    handleDel (row, index) {
      console.log(row, index)
      this.$confirm(`是否确认删除序号为${row.number}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tableData.splice(index, 1)
          this.$notify({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
    * @title 当前选中的数据
    * @param val 选中的值
    *
    **/
    handleSelectionChange (val) {
      this.tableRow = val
      // this.$notify({
      //   showClose: true,
      //   message: JSON.stringify(val),
      //   type: 'success'
      // })
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate (row, index, done) {
      this.tableData.splice(index, 1, Object.assign({}, row))
      done()
      setTimeout(() => {
        this.$notify({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
      })
    },
    // 删除数据
    handleRowDel () {
      if (validatenull(this.tableRow)) {
        this.$notify({
          showClose: true,
          message: '请选择一行要删除的数据',
          type: 'error'
        })
        return false
      } else if (this.tableRow.length > 1) {
        this.$notify({
          showClose: true,
          message: '请选择一行数据，不要选择多行',
          type: 'error'
        })
        return false
      }
      this.handleDel(this.tableRow[0], -1)
    },
    handleSearchCondition (form) {
      let patrn = /^[0-9]*$/
      if (form.overdueDayMin && !patrn.test(form.overdueDayMin)) {
        this.$message('最小逾期天数请输入数字')
        return false
      }
      if (form.overdueDayMax && !patrn.test(form.overdueDayMax)) {
        this.$message('最大逾期天数请输入数字')
        return false
      }
      if ((form.overdueDayMax && !form.overdueDayMin
      ) || (!form.overdueDayMax && form.overdueDayMin)) {
        this.$message('请填写最大逾期天数或最小逾期天数')
        return false
      }
      if (form.overdueDayMax < parseInt(form.overdueDayMin)) {
        this.$message('最大逾期天数要大于或等于最小逾期天数')
        return false
      }
      if (form.createTime) {
        form.weianDateMin = form.createTime[0]
        form.weianDateMax = form.createTime[1]
      }
      return true
    },
    //获取配置
    handleApiFindCaseBackReasonList () {
      let parmse = {
        type: 1
      }
      apiFindCaseBackReasonList(parmse).then(res => {
        res = res.data
        if (res.code === 200) {
          this.recallList = res.data
        } else {
          this.$message(res.msg)
        }
      })
    },
    /**
     * @title 搜索按钮回掉
     *
     **/
    handleSearchChange (form) {
      this.tableSearch = form
      if (this.handleSearchCondition(form)) {
        this.page.currentPage = 1
        this.handleList(this.tableSearch)
      }
    },
    /**
     * @title 页面改变值
     *
     **/
    handleCurrentChange (val) {
      console.log(val)
      this.page.currentPage = val
      this.handleList(this.tableSearch)
    },
    /**
    * @title 刷新数据
    *
    **/
    handlerefreshChange (page) {
      this.handleList(this.tableSearch)
      this.$notify({
        message: `刷新数据成功${JSON.stringify(page)}`,
        type: 'success'
      })
    },
    /**
     * @title 表单关闭处理
     * @param done
     */
    boxhandleOpen (show) {
      this.$notify({
        showClose: true,
        message: '表单打开前处理事件',
        type: 'success'
      })
      show()
    },
    boxhandleClose (done) {
      this.$notify({
        showClose: true,
        message: '表单关闭前处理事件',
        type: 'success'
      })
      done()
    },
    // 修改弹窗
    handleEdit (disable, row, index) {
      this.tableOption.column.forEach(item => {
        item.editDisabled = disable
      })
      this.disable = disable
      this.$refs.timetask.handleEdit(row, index)
    },
    // 显示分配记录
    handleDelete(row, index) {
      this.$alert('确认删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        callback: action => {
          if(action=='confirm'){
            let params = {
              id:row.id
            }
            ApiDelBorrowTypeList(params).then(res=>{
              console.log(res)
              if(res.data.code==200){
                this.handleSearchChange({})
                this.$message.success(res.data.msg)
              }else{
                this.$message(res.data.msg)
              }
            })
          }

        }
      });
    },
    // 分配
    handleAssigning () {
      if (this.tableRow.length <= 0) {
        this.$message('请选择分配案件')
        return false
      }
      let data = []
      this.tableRow.forEach(item => {
        if (item.caseStatus != 0) {
          data.push(item)
        }
      })
      if (data.length > 0) {
        this.$message('有选择不符合条件,已过滤')
        data.forEach((item) => {
          this.$refs.super.$refs.table.toggleRowSelection(item)
        })
        return false
      }
      this.allotVisible = true
      this.$nextTick(()=>{
        this.$refs['allot'].resetFields()
        this.allot = {}
      })
    },
    // 撤回
    handleErecall () {
      if (this.tableRow.length <= 0) {
        this.$message('请选择撤回案件')
        return false
      }
      let data = []
      this.tableRow.forEach(item => {
        if (item.caseStatus != 1 && item.caseStatus != 2) {
          data.push(item)
        }
      })
      if (data.length > 0) {
        this.$message('有选择不符合条件,已过滤')
        data.forEach((item) => {
          this.$refs.super.$refs.table.toggleRowSelection(item)
        })
        return false
      }
      this.recallVisible = true
      this.$nextTick(()=>{
        this.$refs['recall'].resetFields()
        this.recall = {}
      })
    },
    handleHideAllot () {
      let that = this;
      this.$refs.allot.validate((valid) => {
        if (valid) {
          if(parseInt(this.allot.minovertime)>parseInt(this.allot.maxovertime)){
            this.$message.error('最小逾期天数不能大于最大逾期天数，请重新填写！')
            return
          }
            let typename = this.allotList.filter(val=>{
              return that.allot.type == val.borrowType
            })[0]["borrowTypeName"]
            let params
          if(this.saveBtn){
            params = {
              smsName:this.allot.name,
              borrowType:this.allot.type,
              borrowTypeName:typename,
              overdueDayMin:this.allot.minovertime,
              overdueDayMax:this.allot.maxovertime,
              smsTemplate:this.allot.textarea
            }
            params = this.$qs.stringify(params)
            //新增
            ApiSaveBorrowTypeList(params).then(res=>{
              console.log(res)
              if(res.data.code==200){
                this.handleSearchChange({})
                this.allotVisible = false
                this.$message.success(res.data.msg)
              }else{
                this.$message(res.data.msg)
              }
            })
          }else{
            //修改
            params = {
              id:this.editId?this.editId:null,
              overdueDayMin:this.allot.minovertime,
              overdueDayMax:this.allot.maxovertime,
            }
            ApiUpdateBorrowTypeList(params).then(res=>{
              console.log(res)
              if(res.data.code==200){
                this.handleSearchChange({})
                this.allotVisible = false
                this.$message.success(res.data.msg)
              }else{
                this.$message(res.data.msg)
              }
            })

          }

        }
      })
    },
    // 查看案件详情
    handleShowCase (row, index) {
      this.$router.push({
        name: '案件详情',
        query: {
          'caseId': row.id
        }
      })
    },
    handlechangeVal (val, limitType) {
      this.deptId = val;
      if (limitType == "centerId") {
        this.handleGetCenterChild()
      }
    },
    //新增 / 修改
    add(type){
      this.addType = type==1? '新增配置':'修改配置'
      this.allotVisible = true
      // type==1?this.clearOption():'';
      type==1?this.saveBtn=true:this.saveBtn=false
      if(type!=1){
        this.clearOption()
       this.allot= {
            name:type.smsName,
            type:type.borrowType,
            minovertime:type.overdueDayMin,
            maxovertime:type.overdueDayMax,
            textarea:type.smsTemplate
        }
        this.edit = true
        this.editId = type.id
      }else{
        this.edit = false
        this.clearOption()
      }
    },
    //启用，禁用
    handleStart(row, index){
      let params;
      if(row.enabled==1){ //需要禁用
        params = {
          id:row.id
        }
        ApiStopBorrowTypeList(params).then(res=>{
          console.log(res)
          if(res.data.code==200){
            this.handleSearchChange({})
            this.$message.success(res.data.msg)
          }else{
            this.$message(res.data.msg)
          }
        })
      }else{ //需要启用
        params = {
          id:row.id,
          borrowType:row.borrowType
        }
        ApiStartBorrowTypeList(params).then(res=>{
          console.log(res)
          if(res.data.code==200){
            this.handleSearchChange({})
            this.$message.success(res.data.msg)
          }else{
            this.$message(res.data.msg)
          }
        })
      }
    },
    //清空弹窗选项
    clearOption(){
       this.allot = {
         name:'',
         type:'',
         minovertime:'',
         maxovertime:'',
         textarea:''
       }
      // this.$refs.allot&&this.$refs.allot.resetFields()
      this.$refs.allot&&this.$refs.allot.clearValidate()
    },
    numberVal(val,type){
      let rel = /^\d+$/g
      if(!rel.test(val)){
        type==1?this.allot.minovertime = '':this.allot.maxovertime = ''
        this.$message('请输入数字！')
      }
    }
  }
}
</script>
<style lang="less">
.super {
  .recorddialog {
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
  }
  .unicom-pagination {
    padding-top: 6px;
  }
}
</style>

