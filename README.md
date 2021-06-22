# tableAndSearchList
搜索框 表格组件封装
赶紧看到就直接download下来
```
npm i
```
下载完依赖后就可以
 ```
 npm run dev
 ```
 这么简单的操作还不试一下

### 这个是实例图片：
![image](https://github.com/jason-hhc/tableAndSearchList/blob/master/image/tableAndSearch.png)


#### 介绍---使用手册   
[我的个人github地址](https://github.com/ezjason/tableAndSearchList)

配置化表单表格组件

#  1. 表单部分

![输入图片说明](https://images.gitee.com/uploads/images/2021/0621/181809_fce19cb0_7587245.png "屏幕截图.png")

 # 所需配置的 search 字段 #
```
        label:'',                // 表单头名
        type: 'select',         //对应组件类型 select   daterange cascader  默认是input
        placeholder: '',        // 提示标签名
        props:'',               // 接收参数名
        dicData:''             // 接收选项名 (select 类型必填)
        defaultTime:'['00:00:00', '23:59:59']' // 格式化时间的起始点 默认['00:00:00', '23:59:59']，单日期需要设定该值为‘date’,      对应的值会是'00:00:00'作为起点
        filterable: true      //筛选项，搜索
        remote:true          //搭配filterable字段实现远程搜索
        unit：''   // 设置后缀单位，适用input ，select选项
        multiple:true // 设置多选项
        separator：'-'  // 设置daterange的中间符号（参考elementui文档）
```

# 参考实例 #
![输入图片说明](https://images.gitee.com/uploads/images/2021/0621/185846_b0d971f5_7587245.png "屏幕截图.png")



## 表单自定义部分 ##
![输入图片说明](https://images.gitee.com/uploads/images/2021/0621/185940_b209e0c9_7587245.png "屏幕截图.png")

###### 附上代码片段 ######
```
<template slot="custom">
   <div class="box">
    <el-button type="primary" @click="addCustomer" authName="add"> 新增客户</el-button>
    <el-button type="primary" @click="editCustomer" authName="editOwner"> 修改归属人</el-button>
   </div>
</template>
```
![输入图片说明](https://images.gitee.com/uploads/images/2021/0622/100244_61efb344_7587245.png "屏幕截图.png")


 > 同理的，也支持搜索，重置位置部分的自定义填充，对应的slot名为export_button，表格操作列slot名为menuoption，可以参照上述的写法


# 2.表格部分
![输入图片说明](https://images.gitee.com/uploads/images/2021/0622/105535_f103b2cc_7587245.png "屏幕截图.png")
 # 所需配置的 tableColumn 字段 #
```
label:'',                // 表单头名
props:'',               // 接收参数名
width: 200,         //自定义固定表头宽度
align:'center',    //对齐方式
sortable: '',  // 排序类型  custom自定义后端排序   true 前端排序规则
valueDefault: '——' // 默认空位占位符
showOverflowTooltip:true.  // boolean   是否开启两行文本超出省略
custom:true //开启自定义字段(配合filter使用)
filter(key,row):自定义字段  params:  key:本身的值   row:数据行
format: 'YYYY-MM-DD hh:mm:ss',  // 时间格式化格式
solt:true   设置字段自定义html slot 名为对应的props值
dicData：''  对应的下拉选项字段 接收选项名 
```

# 3.option常规配置部分
 ```
lastColumn:'自定义操作栏标题'  
menu:true       //  是否显示操作栏
selection:true //列表是否选择款

```
# 4.props传值
```
defaultValue:[Object, Boolean, Array]
    示例： object ===》    {key:对应的props字段，vulue:对应设置的值 }
          Array ===》    [{key:对应的props字段，vulue:对应设置的值 }]
isNeedPagination  分页控制  默认显示
formVisible:是否需要筛选项
rowClassName:自定义背景颜色 类名为warning-row
data:[] // 数据源
page:{
    total: 0 || '0', // 总页数
    currentPage: 0, // 当前页数
    pageSize: 10, // 每页显示多少条
    background: true, // 背景颜色
    
}
layout:'total, sizes, prev, pager, next, jumper' // 分页布局
resetVisible:true.  // 重置按钮的控制显隐
rowClassName：false.  // 自定义背景class名，暂定固定为‘warning-row’
```
# 5.事件部分
```
search-change（form）   // 查询事件. 接收参数 form 对应的表格参数
sort-change(e)    // 表格排序  接收参数 e 对应的e对象
handleSelectionChange（ele）    // 表格选择事件 接收参数 ele 对应的表格选项数据
change（value, limitType）   // 表单选择事件 接收参数 value：值, limitType：对应的选项props
input（value, limitType） // 表单输入事件 接收参数 value：值, limitType：对应的选项props
handleText（value, limitType） // 表单键盘键输入事件 接收参数 value：值, limitType：对应的选项props
selectFouce（value, limitType）  // 表单选择项focus事件 接收参数 value：值, limitType：对应的选项props
remoteMethod(value, limitType)// 表单选择项远程搜索事件 接收参数 value：值, limitType：对应的选项props
```





        
