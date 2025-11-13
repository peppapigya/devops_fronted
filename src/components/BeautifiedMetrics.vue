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
          <div class="progress-row-3">
            <div class="progress-item">
              <div>1 分钟</div>
              <el-progress
                :percentage="loadToPercent(data?.cpu?.load_average?.['1min'], data?.cpu?.cores)"
                :status="progressStatus(loadToPercent(data?.cpu?.load_average?.['1min'], data?.cpu?.cores))"
                :text-inside="true"
                :show-text="true"
                :stroke-width="12"
                :format="formatPct"
              />
            </div>
            <div class="progress-item">
              <div>5 分钟</div>
              <el-progress
                :percentage="loadToPercent(data?.cpu?.load_average?.['5min'], data?.cpu?.cores)"
                :status="progressStatus(loadToPercent(data?.cpu?.load_average?.['5min'], data?.cpu?.cores))"
                :text-inside="true"
                :show-text="true"
                :stroke-width="12"
                :format="formatPct"
              />
            </div>
            <div class="progress-item">
              <div>15 分钟</div>
              <el-progress
                :percentage="loadToPercent(data?.cpu?.load_average?.['15min'], data?.cpu?.cores)"
                :status="progressStatus(loadToPercent(data?.cpu?.load_average?.['15min'], data?.cpu?.cores))"
                :text-inside="true"
                :show-text="true"
                :stroke-width="12"
                :format="formatPct"
              />
            </div>
          </div>
          <div class="section-title">CPU 使用率</div>
          <div class="progress-row-2">
            <div class="progress-item">
              <div>用户态</div>
              <el-progress
               :percentage="pct(data?.cpu?.usage?.user)"
               :status="progressStatus(pct(data?.cpu?.usage?.user))"
               :text-inside="true"
               :show-text="true"
               :stroke-width="12"
               :format="formatPct"
              />
            </div>
            <div class="progress-item">
              <div>内核态</div>
              <el-progress
               :percentage="pct(data?.cpu?.usage?.system)"
               :status="progressStatus(pct(data?.cpu?.usage?.system))"
               :text-inside="true"
               :show-text="true"
               :stroke-width="12"
               :format="formatPct"
              />
            </div>
            <div class="progress-item">
              <div>空闲</div>
              <el-progress
               :percentage="pct(data?.cpu?.usage?.idle)"
               :text-inside="true"
               :show-text="true"
               :stroke-width="12"
               :format="formatPct"
              />
            </div>
            <div class="progress-item">
              <div>I/O 等待</div>
              <el-progress
               :percentage="pct(data?.cpu?.usage?.wait)"
               :status="progressStatus(pct(data?.cpu?.usage?.wait))"
               :text-inside="true"
               :show-text="true"
               :stroke-width="12"
               :format="formatPct"
              />
            </div>
          </div>
        </el-tab-pane>
  
        <el-tab-pane label="内存">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="总内存">{{ formatBytes(data?.memory?.total) }}</el-descriptions-item>
            <el-descriptions-item label="已用">{{ formatBytes(data?.memory?.used) }}</el-descriptions-item>
            <el-descriptions-item label="可用">{{ formatBytes(data?.memory?.available) }}</el-descriptions-item>
            <el-descriptions-item label="使用率">
              <el-progress
                :percentage="pct(data?.memory?.usage_percent)"
                :status="progressStatus(pct(data?.memory?.usage_percent))"
                :text-inside="true"
                :show-text="true"
                :stroke-width="12"
                :format="formatPct"
              />
            </el-descriptions-item>
            <el-descriptions-item label="Swap 总">{{ formatBytes(data?.memory?.swap_total) }}</el-descriptions-item>
            <el-descriptions-item label="Swap 已用">{{ formatBytes(data?.memory?.swap_used) }}</el-descriptions-item>
            <el-descriptions-item label="Swap 空闲">{{ formatBytes(data?.memory?.swap_free) }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
  
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
                  <el-progress
                    :percentage="pct(row.usage_percent)"
                    :status="progressStatus(pct(row.usage_percent))"
                    :text-inside="true"
                    :show-text="true"
                    :stroke-width="12"
                    :format="formatPct"
                  />
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
                  <el-progress
                    :percentage="pct(row.cpu_percent)"
                    :status="progressStatus(pct(row.cpu_percent))"
                    :text-inside="true"
                    :show-text="true"
                    :stroke-width="12"
                    :format="formatPct"
                  />
                </template>
              </el-table-column>
              <el-table-column label="内存%" width="140">
                <template #default="{ row }">
                  <el-progress
                    :percentage="pct(row.memory_percent)"
                    :status="progressStatus(pct(row.memory_percent))"
                    :text-inside="true"
                    :show-text="true"
                    :stroke-width="12"
                    :format="formatPct"
                  />
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
  
  const { data } = defineProps<{ data: any }>()
  
  
  function pct(v: number | undefined): number {
    if (v == null || v < 0) return 0
    return Math.min(100, Number(v.toFixed(1)))
  }
  
  function loadToPercent(v: number | undefined, cores?: number): number {
    if (v == null || v < 0) return 0
    const c = cores && cores > 0 ? cores : 1
    return Math.min(100, Number(((v / c) * 100).toFixed(1)))
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
  
  function formatPct(p: number): string {
    const v = typeof p === 'number' && isFinite(p) ? p : 0
    return `${v.toFixed(1)}%`
  }
  
  function formatBytes(value: unknown): string {
    if (typeof value === 'string') {
      const n = Number(value)
      if (!isFinite(n)) return value
      value = n
    }
    if (typeof value !== 'number' || !isFinite(value) || value < 0) {
      return `${value ?? '-'}`
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    let idx = 0
    let num = value
    while (num >= 1024 && idx < units.length - 1) {
      num /= 1024
      idx++
    }
    const fixed = num >= 100 ? 0 : 1
    return `${num.toFixed(fixed)} ${units[idx]}`
  }
  </script>
  
  <style scoped>
  .metrics-view { display: flex; flex-direction: column; gap: 12px; }
  .block { margin-bottom: 12px; }
  .section-title { font-weight: 600; margin: 8px 0; }
  .progress-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .progress-row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .progress-row-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .progress-item { display: flex; flex-direction: column; gap: 6px; }
  .progress-item :deep(.el-progress) { width: 100%; }

  .progress-item :deep(.el-progress--text-inside .el-progress-bar__inner),
  .scroll-pane :deep(.el-progress--text-inside .el-progress-bar__inner) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0px;
  }

  .progress-item :deep(.el-progress--text-inside .el-progress-bar__innerText),
  .scroll-pane :deep(.el-progress--text-inside .el-progress-bar__innerText) {
    color: #000 !important;
    font-weight: 600;
    position: relative;
    top: -2px; 
    text-align: left;
  }

  :deep(.el-progress--text-inside .el-progress-bar__innerText) {
    color: #000 !important;
    font-weight: 600;
    position: relative;
    top: -2px;
    text-align: left;
  }

  :deep(.el-progress--text-inside .el-progress-bar__inner) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 6px;
  }

  .scroll-pane {
    max-height: 360px;
    overflow-y: auto;
    padding-right: 4px;
  }
  .mr8 { margin-right: 8px; }
  .mb8 { margin-bottom: 8px; }
  </style>