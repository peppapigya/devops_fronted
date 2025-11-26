<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 左侧部门树 -->
      <el-col :span="4" :xs="24">
        <el-card shadow="never" class="dept-card">
          <div class="head-container">
            <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="tree-container">
            <el-tree
              ref="deptTreeRef"
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 右侧用户数据 -->
      <el-col :span="20" :xs="24">
        <el-card shadow="never" class="table-card">
          <!-- 搜索表单 -->
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号码"
                clearable
                style="width: 240px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="用户状态"
                clearable
                style="width: 240px"
              >
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                v-model="dateRange"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
              <el-button icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 操作工具栏 -->
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleCreate"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="Upload"
                @click="handleImport"
              >导入</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                plain
                icon="Download"
                @click="handleExport"
              >导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @query-table="getPageList" />
          </el-row>

          <!-- 表格 -->
          <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="用户编号" align="center" prop="ID" width="100" />
            <el-table-column label="用户名称" align="center" prop="username" :show-overflow-tooltip="true" />
            <el-table-column label="用户昵称" align="center" prop="nickname" :show-overflow-tooltip="true" />
            <el-table-column label="部门" align="center" prop="dept_name" :show-overflow-tooltip="true">
               <template #default="{row}">
                 {{ row.dept_name || '-' }}
               </template>
            </el-table-column>
            <el-table-column label="手机号码" align="center" prop="mobile" width="120" />
            <el-table-column label="状态" align="center" prop="status">
              <template #default="{row}">
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChange(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="CreatedAt" width="160">
              <template #default="{row}">
                <span>{{ formatDate(row.CreatedAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
              <template #default="{row}">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleEdit(row)"
                >修改</el-button>
                <el-dropdown @command="(command) => handleCommand(command, row)" trigger="click">
                  <el-button link type="primary" icon="DArrowRight">
                    更多
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="handleDelete" icon="Delete">删除用户</el-dropdown-item>
                      <el-dropdown-item command="handleResetPwd" icon="Key">重置密码</el-dropdown-item>
                      <el-dropdown-item command="handleAuthRole" icon="CircleCheck">分配角色</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
             <el-pagination
                v-model:current-page="queryParams.pageNum"
                v-model:page-size="queryParams.pageSize"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户编辑对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="dept_id">
               <el-tree-select
                v-model="form.dept_id"
                :data="deptOptions"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                value-key="id"
                placeholder="请选择归属部门"
                check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称" maxlength="30" :disabled="!isCreate" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="password" v-if="isCreate">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
                <el-option label="未知" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="岗位">
              <el-select v-model="form.post_ids" multiple placeholder="请选择岗位">
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.status === 0"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { Search, Plus, Upload, Download, Refresh, Edit, Delete, Key, CircleCheck, DArrowRight } from '@element-plus/icons-vue';
import { UserApi } from '@/api/user';
import { DeptApi } from '@/api/dept';
import type { User, DeptOption, PostOption } from '@/api/user/types';

const deptName = ref('');
const deptOptions = ref<any[]>([]);
const deptTreeRef = ref<InstanceType<typeof ElTree>>();
const userList = ref<User[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<number[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const dateRange = ref<any>([]);
const postOptions = ref<PostOption[]>([
  { id: 1, name: '董事长', code: 'ceo' },
  { id: 2, name: '项目经理', code: 'se' },
  { id: 3, name: '人力资源', code: 'hr' },
  { id: 4, name: '普通员工', code: 'staff' }
]);
const isCreate = ref(true);

const data = reactive({
  form: {
    username: '',
    nickname: '',
    dept_id: undefined,
    mobile: '',
    email: '',
    password: '',
    sex: 0,
    status: 1,
    post_ids: [],
    remark: ''
  } as any,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    mobile: undefined,
    status: undefined,
    dept_id: undefined
  },
  rules: {
    username: [
      { required: true, message: "用户名称不能为空", trigger: "blur" },
      { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }
    ],
    nickname: [
      { required: true, message: "用户昵称不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "用户密码不能为空", trigger: "blur" },
      { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }
    ],
    email: [
      { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }
    ],
    mobile: [
      { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);
const defaultProps = {
  children: 'children',
  label: 'name'
};

/** 过滤部门 */
watch(deptName, (val) => {
  deptTreeRef.value!.filter(val);
});

/** 节点单击事件 */
function handleNodeClick(data: any) {
  queryParams.value.dept_id = data.id;
  handleSearch();
}

/** 筛选节点 */
function filterNode(value: string, data: any) {
  if (!value) return true;
  return data.name.includes(value);
}

/** 查询部门下拉树结构 */
async function getDeptTree() {
  try {
    const response = await DeptApi.tree();
    deptOptions.value = response.data;
  } catch (error) {
    console.error('获取部门树失败:', error);
  }
}

/** 查询用户列表 */
async function getPageList() {
  loading.value = true;
  try {
    const res = await UserApi.getUserPage(queryParams.value);
    userList.value = res.data;
    total.value = res.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

/** 搜索按钮操作 */
function handleSearch() {
  queryParams.value.pageNum = 1;
  getPageList();
}

/** 重置按钮操作 */
function handleReset() {
  dateRange.value = [];
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    mobile: undefined,
    status: undefined,
    dept_id: undefined
  };
  handleSearch();
}

/** 多选框选中数据 */
function handleSelectionChange(selection: User[]) {
  ids.value = selection.map(item => item.ID);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleCreate() {
  reset();
  isCreate.value = true;
  open.value = true;
  title.value = "添加用户";
}

/** 修改按钮操作 */
function handleEdit(row: any) {
  reset();
  isCreate.value = false;
  const userId = row.ID || ids.value[0];
  // 模拟获取详情
  form.value = {
    ...row,
    dept_id: row.dept_id || (deptOptions.value[0]?.children?.[0]?.id), // 默认选中一个部门演示
    post_ids: row.post_ids || []
  };
  open.value = true;
  title.value = "修改用户";
}

/** 提交按钮 */
async function submitForm() {
  // @ts-ignore
  const valid = await data.userRef?.validate().catch(() => false);
  if (valid) {
    if (form.value.ID) {
      await UserApi.updateUserInfo(form.value);
      ElMessage.success("修改成功");
    } else {
      await UserApi.createUser(form.value);
      ElMessage.success("新增成功");
    }
    open.value = false;
    getPageList();
  }
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 重置表单 */
function reset() {
  form.value = {
    username: '',
    nickname: '',
    dept_id: undefined,
    mobile: '',
    email: '',
    password: '',
    sex: 0,
    status: 1,
    post_ids: [],
    remark: ''
  };
}

/** 删除按钮操作 */
function handleDelete(row: any) {
  const userIds = row.ID ? [row.ID] : ids.value;
  ElMessageBox.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await UserApi.deleteUserById(userIds);
    getPageList();
    ElMessage.success("删除成功");
  }).catch(() => {});
}

/** 用户状态修改 */
async function handleStatusChange(row: any) {
  let text = row.status === 1 ? "启用" : "停用";
  try {
    await ElMessageBox.confirm('确认要"' + text + '""' + row.username + '"用户吗？', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    await UserApi.updateUserStatus(row.status);
    ElMessage.success(text + "成功");
  } catch {
    row.status = row.status === 1 ? 0 : 1;
  }
}

/** 更多操作触发 */
function handleCommand(command: string, row: any) {
  switch (command) {
    case "handleDelete":
      handleDelete(row);
      break;
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
}

/** 重置密码 */
function handleResetPwd(row: any) {
  ElMessageBox.prompt('请输入"' + row.username + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: "用户密码长度必须介于 5 和 20 之间"
  }).then(async ({ value }) => {
    // 模拟重置密码API
    ElMessage.success("修改成功，新密码是：" + value);
  }).catch(() => {});
}

/** 分配角色 */
function handleAuthRole(row: any) {
  ElMessage.info("点击了分配角色: " + row.username);
}

/** 导入 */
function handleImport() {
  ElMessage.info("点击了导入按钮");
}

/** 导出 */
function handleExport() {
  ElMessage.success("导出成功");
}

function handleSizeChange(val: number) {
  queryParams.value.pageSize = val;
  getPageList();
}

function handleCurrentChange(val: number) {
  queryParams.value.pageNum = val;
  getPageList();
}

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

onMounted(() => {
  getDeptTree();
  getPageList();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f8f8f9;
  min-height: calc(100vh - 84px);
}

.dept-card {
  height: calc(100vh - 124px);
  overflow-y: auto;
}

.table-card {
  min-height: calc(100vh - 124px);
}

.mb8 {
  margin-bottom: 8px;
}

.tree-container {
  margin-top: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #f0f7ff;
  color: #409eff;
  font-weight: bold;
}

:deep(.el-table th) {
  background-color: #f8f8f9;
  color: #515a6e;
  font-weight: 600;
}

:deep(.el-button--link) {
  padding: 4px 8px;
  height: auto;
}
</style>
