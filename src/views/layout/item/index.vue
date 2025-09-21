<template @click="getPageList">
  <h2>申报项目管理</h2>
  <el-form :inline="true" :model="pageParamsForm">
    <el-form-item label="项目名称:">
      <el-input placeholder="请输入项目名称" v-model="pageParamsForm.name"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" plain @click="getPageList">查询</el-button>
      <el-button type="primary" size="default" plain @click="openDialog('create')">新增</el-button>
    </el-form-item>
    <el-table :data="tableData.rows" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"/>
      <el-table-column prop="name" label="项目名称" width="180"/>
      <el-table-column prop="budget" label="项目预算" width="180"/>
      <el-table-column label="状态" width="120">
        <template #default="{row}">
          <el-tag type="info" v-show="row.state==0">待审批</el-tag>
          <el-tag type="primary" v-show="row.state==1">待受理</el-tag>
          <el-tag type="warning" v-show="row.state==2">已开始</el-tag>
          <el-tag type="success" v-show="row.state==3">已完成</el-tag>
          <el-tag type="danger" v-show="row.state==4">已驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="implementationPlan" label="实施方案" width="180"/>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column prop="createBy" label="申请人" width="80"/>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="{row}">
          <el-button type="primary" link size="small" v-if="row">审批</el-button>
          <el-button type="warning" link size="small" @click="openDialog('update',row.id)">修改</el-button>
          <el-button type="warning" link size="small" @click="deleteProject(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-pagination
      v-model:current-page="tableData.pageNum"
      v-model:page-size="tableData.pageSize"
      :page-sizes="[1, 5, 10, 20]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />

  <el-dialog
      v-model="dialogFormVisible"
      :title="title" width="500">
    <el-form
        :model="formData"
        :rules="formRules"
        label-width="100px"
    >
      <el-form-item prop="name" label="项目名称">
        <el-input v-model="formData.name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item prop="budget" label="项目预算">
        <el-input v-model="formData.budget" placeholder="请输入项目预算"></el-input>
      </el-form-item>
      <el-form-item prop="implementationPlan" label="实施方案">
        <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            action="http://localhost:8080/api/v1/file/upload"
            multiple
            :limit="1"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
        >
          <el-button type="primary" @click="">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传单个文件</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :disabled="formLoading">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>

import type {AssistProjectRecordVO, AssistProjectVO, PageParams} from "@/api/item/types.ts";
import {AssistProjectApi} from "@/api/item";
import {ref} from "vue";
import {ElNotification, type UploadFile, type UploadFiles} from "element-plus";
import type {LoginUser} from "@/api/login/type.ts";
import {useConfirm} from "@/components/useConfirm.ts";

const fileUploadUrl = ref<string>('http://localhost:8080/file/upload');
const pageParamsForm = ref<PageParams>({
  pageNum: 1,
  pageSize: 10,
  name: ''
})
const tableData = ref<AssistProjectRecordVO>({
  pageNum: undefined,
  pageSize: undefined,
  total: undefined,
  rows: []
})
const formData = ref<AssistProjectVO>({
  id: undefined,
  name: '',
  budget: '',
  state: undefined,
  implementationPlan: '',
  userId:''
})
const fileList = ref<UploadFile[]>([])
const user = ref<LoginUser>();
// 获取分页列表事件
const getPageList = async () => {
  const res = await AssistProjectApi.getPageList(pageParamsForm.value);
  tableData.value.rows = res.data;
  tableData.value.pageNum = res.pageNum;
  tableData.value.total = res.total;
  tableData.value.pageSize = res.pageSize;
  console.log(res.data);
}
// 上传文件回调接口
const handleUploadSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  formData.value.implementationPlan = response.data.url;
  console.log(response.data.url);
  ElNotification.success({message: "上传成功"})
}
// 移除文件
const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  formData.value.implementationPlan = '';
  console.log("移除文件成功{}", formData.value.implementationPlan);
}

const formRules = ref({
  id: [{required: false}],
  name: [{required: true, message: "项目名称不能为空"}],
  budget: [{required: true, message: "项目预算不能为空"}],
  implementationPlan: [{required: true, message: "实施方案不能为空"}]
})
// 新增/修改项目
const submitForm = async () => {
  formData.value.userId = user.value?.userId;
  if (formType.value == 'create') {
    const res = await AssistProjectApi.addAssistProject(formData.value);
    console.log(res);
    ElNotification.success({message: "新增成功"})
  }
  if (formType.value == 'update') {
    await AssistProjectApi.updateAssistProject(formData.value);
    ElNotification.success({message: "修改成功"})
  }
  formLoading.value = true;
  dialogFormVisible.value = false;
  await getPageList();
}
// 打开弹窗
const openDialog = async (type: string, id?: number) => {
  formType.value = type;
  resetForm();
  fileList.value = []
  title.value = "新增项目";
  if (type == 'update' && id) {
    formLoading.value = true
    try {
      formData.value = await AssistProjectApi.getAssistProjectDetail(id);
      if (formData.value.implementationPlan) {
        fileList.value = [{
          name: formData.value.implementationPlan.split('/').pop() || '实施方案文件',
          response: {url: formData.value.implementationPlan},
          status: 'success',
          uid: Date.now(),
          percentage: 100
        }];
      }
      title.value = "修改项目";
    } finally {
      formLoading.value = false
    }
  }
  dialogFormVisible.value = true
}
// 删除项目
const deleteProject = async (id: number) => {
  // 二次确认对话框
  const {confirm} = useConfirm();
  try {
    const userConfirmed = await confirm(
        '确定要删除这个项目吗？删除后不可恢复！',
        '删除确认'
    );
    if (userConfirmed) {
      await AssistProjectApi.deleteAssistProject(id);
      ElNotification.success({message: "删除成功"});
      await getPageList();
    }
  } catch (error) {
    ElNotification.error({
      title: '错误',
      message: '删除项目失败',
      duration: 3000
    });
  }
}
// 获取用户信息
const getUser = () => {
  user.value = JSON.parse(sessionStorage.getItem('user') || '{}')
}
// 重置表单
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    budget: undefined,
    state: undefined,
    implementationPlan: undefined
  }
}
// 一页中的数据量改变事件
const handleSizeChange = (val: number) => {
  pageParamsForm.value.pageSize = val;
  getPageList();
}

// 修改页码
const handleCurrentChange = (val: number) => {
  pageParamsForm.value.pageNum = val;
  getPageList();
}
// 对话框
const dialogFormVisible = ref<boolean>(false);
const formLoading = ref<boolean>(false);
const title = ref<string>("新增申报项目");
const formType = ref<string>('');
getPageList()
getUser()
</script>
<style scoped>

</style>