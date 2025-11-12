<template>
  <div class="user-management">
    <el-card shadow="never">
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <el-form :model="queryParams" inline>
          <el-form-item>
            <el-input
                v-model="queryParams.userName"
                placeholder="搜索用户名/邮箱/手机号"
                prefix-icon="Search"
                style="width: 200px;"
                @change="getPageList"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 120px;">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="actions">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
          <el-button :disabled="!selectedRows.length" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </div>
      </div>

      <!-- 用户表格 -->
      <el-table
          :data="userList"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          style="width: 100%"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="displayName" label="展示名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="150" />
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="CreatedAt" label="创建时间" width="180">
          <template #default="{row}">
            {{ formatDate(row.CreatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>

<!--              &lt;!&ndash; 使用更协调的下拉菜单 &ndash;&gt;-->
<!--              <el-dropdown-->
<!--                  @command="handleCommand"-->
<!--                  trigger="click"-->
<!--                  class="more-dropdown"-->
<!--              >-->
<!--                <el-button size="small" type="primary">-->
<!--                  更多<el-icon class="el-icon&#45;&#45;right"><arrow-down /></el-icon>-->
<!--                </el-button>-->
<!--                <template #dropdown>-->
<!--                  <el-dropdown-menu>-->
<!--                    <el-dropdown-item :command="{type: 'resetPwd', row}">-->
<!--                      <Icon icon="ep:key" /> 重置密码-->
<!--                    </el-dropdown-item>-->
<!--                    <el-dropdown-item :command="{type: 'assignRole', row}">-->
<!--                      <Icon icon="ep:circle-check" /> 分配角色-->
<!--                    </el-dropdown-item>-->
<!--                  </el-dropdown-menu>-->
<!--                </template>-->
<!--              </el-dropdown>-->
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
            :current-page="queryParams.pageNum"
            :page-size="queryParams.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户编辑对话框 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
        :close-on-click-modal="false"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="展示名" prop="displayName">
          <el-input v-model="formData.displayName" placeholder="请输入展示名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isCreate">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
              v-model="formData.status"
              :active-value="1"
              :inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted ,computed} from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {Plus, Delete} from '@element-plus/icons-vue'
import type {User} from "@/api/user/types.ts";
// import {Icon} from "@/components/Icon";
import {UserApi} from "@/api/user";

const loading = ref(false)
const userList = ref<User[]>([])
const selectedRows = ref<User[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const isCreate = ref(false)
const formRef = ref<FormInstance>()

const queryParams = reactive({
  userName: '',
  status: '',
  pageNum: 1,
  pageSize: 10
})

const formData = reactive({
  username: '',
  displayName: '',
  email: '',
  phone: '',
  password: '',
  status: 1
})

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
  ],
  displayName: [
    { required: true, message: '请输入展示名', trigger: 'blur' },
    { max: 128, message: '长度不能超过 128 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => {
  return isCreate.value ? '新增用户' : '编辑用户'
})

onMounted(() => {
  getPageList()
})
// 获取用户列表
const getPageList = async () => {
  loading.value = true
  try {
    console.log("请求参数：",queryParams)
    const res = await UserApi.getUserPage(queryParams);
    userList.value = res.data
    total.value = res.total
    console.log(userList.value)
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.pageNum = 1
  getPageList()
}

const handleReset = () => {
  queryParams.userName = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  getPageList()
}


const handleSelectionChange = (selection: User[]) => {
  selectedRows.value = selection
}
// 修改用户状态
const handleStatusChange = async (user: User) => {
  try {
    console.log("修改用户状态：",user)
    await UserApi.updateUserStatus(user.status)
    ElMessage.success(`用户 ${user.status ? '启用' : '禁用'}成功`)
    await getPageList()
  } catch (error) {
    user.status = user.status ? 0 : 1 // 恢复状态
    ElMessage.error('操作失败')
  }
}

const handleCreate = () => {
  isCreate.value = true
  Object.assign(formData, {
    username: '',
    displayName: '',
    email: '',
    phone: '',
    password: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (user: User) => {
  isCreate.value = false
  Object.assign(formData, {
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
    password: '',
    status: user.status
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(isCreate.value ? '创建成功' : '更新成功')
    dialogVisible.value = false
    await getPageList()
  } catch (error) {
    // 验证失败
  }
}

const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(`确定删除用户 "${user.username}" 吗？`, '提示', {
      type: 'warning'
    })
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    ElMessage.success('删除成功')
    await getPageList()
  } catch (error) {
    // 取消删除
  }
}

const handleBatchDelete = async () => {
  if (!selectedRows.value.length) return

  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 个用户吗？`, '提示', {
      type: 'warning'
    })
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    ElMessage.success('批量删除成功')
    await getPageList()
  } catch (error) {
    // 取消删除
  }
}

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  getPageList()
}

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page
  getPageList()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.user-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.actions {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-select {
  width: 120px;
}
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .actions {
    justify-content: flex-start;
  }
}
</style>
