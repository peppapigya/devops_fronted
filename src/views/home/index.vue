<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409EFF;">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">126</div>
              <div class="stat-label">运行服务</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67C23A;">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">98.7%</div>
              <div class="stat-label">部署成功率</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #E6A23C;">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">58</div>
              <div class="stat-label">今日部署</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #F56C6C;">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">3</div>
              <div class="stat-label">异常服务</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>部署趋势</span>
              <el-select v-model="chartDateRange" size="small" style="width: 200px;">
                <el-option label="最近7天" value="7days" />
                <el-option label="最近30天" value="30days" />
                <el-option label="最近90天" value="90days" />
              </el-select>
            </div>
          </template>
          <div ref="deployChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>服务状态分布</span>
            </div>
          </template>
          <div ref="serviceChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-row :gutter="20" class="activity-row">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>最近部署活动</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentActivities" style="width: 100%">
            <el-table-column prop="project" label="项目" />
            <el-table-column prop="environment" label="环境">
              <template #default="{row}">
                <el-tag :type="getEnvType(row.environment)">{{ row.environment }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" />
            <el-table-column prop="status" label="状态">
              <template #default="{row}">
                <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>系统消息</span>
            </div>
          </template>
          <div class="message-list">
            <div v-for="(message, index) in systemMessages" :key="index" class="message-item">
              <div class="message-content">
                <div class="message-title">{{ message.title }}</div>
                <div class="message-desc">{{ message.description }}</div>
              </div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Monitor, SuccessFilled, Clock, Warning } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const chartDateRange = ref('7days')

// 模拟数据
const recentActivities = ref([
  { project: 'user-service', environment: 'prod', version: 'v1.2.3', status: '成功', time: '2分钟前' },
  { project: 'order-service', environment: 'test', version: 'v2.0.1', status: '进行中', time: '5分钟前' },
  { project: 'payment-service', environment: 'dev', version: 'v1.5.0', status: '失败', time: '10分钟前' },
  { project: 'auth-service', environment: 'prod', version: 'v1.0.5', status: '成功', time: '15分钟前' }
])

const systemMessages = ref([
  { title: '系统维护通知', description: '本周六凌晨2:00-4:00进行系统维护', time: '今天 09:30' },
  { title: '新功能上线', description: 'CI/CD流水线可视化功能已上线', time: '昨天 14:20' },
  { title: '安全更新', description: '请及时更新系统安全补丁', time: '前天 16:45' }
])

const getEnvType = (env: string) => {
  const envMap: { [key: string]: string } = {
    'prod': 'danger',
    'test': 'warning',
    'dev': 'success'
  }
  return envMap[env] || 'info'
}

const getStatusType = (status: string) => {
  const statusMap: { [key: string]: string } = {
    '成功': 'success',
    '进行中': 'warning',
    '失败': 'danger'
  }
  return statusMap[status] || 'info'
}

// ECharts图表
let deployChart: echarts.ECharts | null = null
let serviceChart: echarts.ECharts | null = null
const deployChartRef = ref<HTMLElement>()
const serviceChartRef = ref<HTMLElement>()

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  deployChart?.dispose()
  serviceChart?.dispose()
})

const handleResize = () => {
  deployChart?.resize()
  serviceChart?.resize()
}

const initCharts = () => {
  if (deployChartRef.value && serviceChartRef.value) {
    // 部署趋势图
    deployChart = echarts.init(deployChartRef.value)
    deployChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [
        { name: '部署次数', type: 'line', data: [12, 18, 15, 22, 19, 8, 11], smooth: true },
        { name: '成功次数', type: 'line', data: [11, 17, 14, 21, 18, 7, 10], smooth: true }
      ]
    })

    // 服务状态分布图
    serviceChart = echarts.init(serviceChartRef.value)
    serviceChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 10, top: 'center' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 85, name: '运行中' },
          { value: 10, name: '部署中' },
          { value: 3, name: '异常' },
          { value: 2, name: '已停止' }
        ]
      }]
    })
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-icon .el-icon {
  font-size: 24px;
  color: white;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.chart-row {
  margin-bottom: 20px;
}

.activity-row {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-list {
  max-height: 300px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.message-item:last-child {
  border-bottom: none;
}

.message-content {
  flex: 1;
  margin-right: 15px;
}

.message-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.message-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.message-time {
  font-size: 12px;
  color: #c0c4cc;
  white-space: nowrap;
}
</style>
