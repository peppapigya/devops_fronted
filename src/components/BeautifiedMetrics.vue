<template>
    <div class="metrics-view">
      <el-descriptions :column="3" border class="block">
        <el-descriptions-item label="状态">
          <el-tag :type="statusTagType(data?.summary?.health)">{{ data?.summary?.health || data?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="主机名">{{ data?.hostname }}</el-descriptions-item>
        <el-descriptions-item label="时间戳">{{ data?.timestamp }}</el-descriptions-item>
      </el-descriptions>
  
      <el-tabs class="block">
        <el-tab-pane label="系统">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="OS">{{ data?.system?.os }}</el-descriptions-item>
            <el-descriptions-item label="内核">{{ data?.system?.kernel }}</el-descriptions-item>
            <el-descriptions-item label="架构">{{ data?.system?.architecture }}</el-descriptions-item>
            <el-descriptions-item label="Uptime">{{ data?.system?.uptime }}</el-descriptions-item>
            <el-descriptions-item label="登录用户数">{{ data?.system?.users }}</el-descriptions-item>
          </el-descriptions>
          <div class="alerts" v-if="(data?.summary?.alerts || []).length">
            <div class="section-title">告警</div>
            <el-alert
              v-for="(a, i) in data.summary.alerts"
              :key="i"
              :title="a"
              type="warning"
              show-icon
              class="mb8"
            />
          </div>
          <div class="reco" v-if="(data?.summary?.recommendations || []).length">
            <div class="section-title">建议</div>
            <el-tag v-for="(r, i) in data.summary.recommendations" :key="i" type="success" class="mr8 mb8">{{ r }}</el-tag>
          </div>
        </el-tab-pane>
  
        <el-tab-pane label="CPU">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="型号">{{ data?.cpu?.model }}</el-descriptions-item>
            <el-descriptions-item label="核心">{{ data?.cpu?.cores }}</el-descriptions-item>
            <el-descriptions-item label="线程">{{ data?.cpu?.threads }}</el-descriptions-item>
            <el-descriptions-item label="频率">{{ data?.cpu?.frequency }}</el-descriptions-item>
            <el-descriptions-item label="缓存">{{ data?.cpu?.cache }}</el-descriptions-item>
          </el-descriptions>
          <div class="section-title">负载</div>
          <div class="progress-row">
            <div class="progress-item">
              <div>1 分钟</div>
              <!-- 修改：数字开头的键用下标访问 -->
              <el-progress :percentage="toPercent(data?.cpu?.load_average?.['1min'])" :status="progressStatus(toPercent(data?.cpu?.load_average?.['1min']))" />
            </div>
            <div class="progress-item">
              <div>5 分钟</div>
              <el-progress :percentage="toPercent(data?.cpu?.load_average?.['5min'])" :status="progressStatus(toPercent(data?.cpu?.load_average?.['5min']))" />
            </div>
            <div class="progress-item">
              <div>15 分钟</div>
              <el-progress :percentage="toPercent(data?.cpu?.load_average?.['15min'])" :status="progressStatus(toPercent(data?.cpu?.load_average?.['15min']))" />
            </div>
          </div>
          <div class="section-title">CPU 使用率</div>
          <div class="progress-row">
            <div class="progress-item">
              <div>User</div>
              <el-progress :percentage="roundNum(data?.cpu?.usage?.user)" :status="progressStatus(roundNum(data?.cpu?.usage?.user))" />
            </div>
            <div class="progress-item">
              <div>System</div>
              <el-progress :percentage="roundNum(data?.cpu?.usage?.system)" :status="progressStatus(roundNum(data?.cpu?.usage?.system))" />
            </div>
            <div class="progress-item">
              <div>Idle</div>
              <el-progress :percentage="roundNum(data?.cpu?.usage?.idle)" />
            </div>
            <div class="progress-item">
              <div>IO Wait</div>
              <el-progress :percentage="roundNum(data?.cpu?.usage?.wait)" :status="progressStatus(roundNum(data?.cpu?.usage?.wait))" />
            </div>
          </div>
        </el-tab-pane>
  
        <el-tab-pane label="内存">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="总内存">{{ data?.memory?.total }}</el-descriptions-item>
            <el-descriptions-item label="已用">{{ data?.memory?.used }}</el-descriptions-item>
            <el-descriptions-item label="可用">{{ data?.memory?.available }}</el-descriptions-item>
            <el-descriptions-item label="使用率">
              <el-progress :percentage="roundNum(data?.memory?.usage_percent)" :status="progressStatus(roundNum(data?.memory?.usage_percent))" />
            </el-descriptions-item>
            <el-descriptions-item label="Swap 总">{{ data?.memory?.swap_total }}</el-descriptions-item>
            <el-descriptions-item label="Swap 已用">{{ data?.memory?.swap_used }}</el-descriptions-item>
            <el-descriptions-item label="Swap 空闲">{{ data?.memory?.swap_free }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
  
        <!-- 磁盘：新增滚动容器 -->
        <el-tab-pane label="磁盘">
          <div class="scroll-pane">
            <el-table :data="data?.disk || []" border stripe style="width: 100%">
              <el-table-column prop="filesystem" label="文件系统" min-width="160" />
              <el-table-column prop="mounted_on" label="挂载点" min-width="160" />
              <el-table-column prop="size" label="容量" min-width="120" />
              <el-table-column prop="used" label="已用" min-width="120" />
              <el-table-column prop="available" label="可用" min-width="120" />
              <el-table-column label="使用率" min-width="200">
                <template #default="{ row }">
                  <el-progress :percentage="row.usage_percent || 0" :status="progressStatus(row.usage_percent || 0)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
  
        <!-- 网络：新增滚动容器 -->
        <el-tab-pane label="网络">
          <div class="scroll-pane">
            <div class="section-title">连接统计</div>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="总连接">{{ data?.network?.connections?.total }}</el-descriptions-item>
              <el-descriptions-item label="监听">{{ data?.network?.connections?.listening }}</el-descriptions-item>
              <el-descriptions-item label="已建立">{{ data?.network?.connections?.established }}</el-descriptions-item>
            </el-descriptions>
            <div class="section-title">接口</div>
            <el-table :data="data?.network?.interfaces || []" border stripe>
              <el-table-column prop="name" label="名称" min-width="140" />
              <el-table-column label="IPv4" min-width="200">
                <template #default="{ row }">
                  <el-tag v-for="(ip, i) in row.ipv4 || []" :key="i" class="mr8">{{ ip }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="IPv6" min-width="200">
                <template #default="{ row }">
                  <el-tag v-for="(ip, i) in row.ipv6 || []" :key="i" class="mr8">{{ ip }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="类型" min-width="100" />
            </el-table>
          </div>
        </el-tab-pane>
  
        <!-- 进程：新增滚动容器 -->
        <el-tab-pane label="进程">
          <div class="scroll-pane">
            <el-descriptions :column="5" border>
              <el-descriptions-item label="总数">{{ data?.processes?.total }}</el-descriptions-item>
              <el-descriptions-item label="运行">{{ data?.processes?.running }}</el-descriptions-item>
              <el-descriptions-item label="睡眠">{{ data?.processes?.sleeping }}</el-descriptions-item>
              <el-descriptions-item label="停止">{{ data?.processes?.stopped }}</el-descriptions-item>
              <el-descriptions-item label="僵尸">{{ data?.processes?.zombie }}</el-descriptions-item>
            </el-descriptions>
            <div class="section-title">Top 进程</div>
            <el-table :data="data?.processes?.top_processes || []" border stripe>
              <el-table-column prop="pid" label="PID" width="90" />
              <el-table-column prop="name" label="名称" min-width="160" />
              <el-table-column prop="user" label="用户" min-width="140" />
              <el-table-column label="CPU%" width="140">
                <template #default="{ row }">
                  <el-progress :percentage="roundNum(row.cpu_percent)" :status="progressStatus(roundNum(row.cpu_percent))" />
                </template>
              </el-table-column>
              <el-table-column label="内存%" width="140">
                <template #default="{ row }">
                  <el-progress :percentage="roundNum(row.memory_percent)" :status="progressStatus(roundNum(row.memory_percent))" />
                </template>
              </el-table-column>
              <el-table-column prop="memory_usage" label="内存占用" min-width="140" />
              <el-table-column prop="state" label="状态" width="110" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // 接受后端返回的 BeautifiedMetrics 对象
  const { data } = defineProps<{ data: any }>()
  
  // 将负载值粗略映射到百分比展示（这里把负载当做百分比，取 0~100 范围）
  function toPercent(v: number | undefined): number {
    if (!v || v < 0) return 0
    const p = v > 100 ? 100 : v
    return Math.round(p)
  }
  
  function roundNum(v: number | undefined): number {
    if (!v || v < 0) return 0
    return Number(v.toFixed(1))
  }
  
  function progressStatus(p: number): 'success' | 'warning' | 'exception' | undefined {
    if (p >= 85) return 'exception'
    if (p >= 70) return 'warning'
    return 'success'
  }
  
  function statusTagType(health?: string): 'success' | 'info' | 'warning' | 'danger' {
    const h = (health || '').toLowerCase()
    if (h.includes('ok') || h.includes('healthy') || h.includes('normal')) return 'success'
    if (h.includes('warn')) return 'warning'
    if (h.includes('critical') || h.includes('error')) return 'danger'
    return 'info'
  }
  </script>
  
  <style scoped>
  .metrics-view { display: flex; flex-direction: column; gap: 12px; }
  .block { margin-bottom: 12px; }
  .section-title { font-weight: 600; margin: 8px 0; }
  .progress-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .progress-item { display: flex; flex-direction: column; gap: 6px; }
  
  /* 新增：滚动容器样式（磁盘/网络/进程） */
  .scroll-pane {
    max-height: 360px;         /* 可按需要调整高度 */
    overflow-y: auto;
    padding-right: 4px;        /* 给滚动条留一点内边距 */
  }

  .mr8 { margin-right: 8px; }
  .mb8 { margin-bottom: 8px; }
  </style>