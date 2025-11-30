<template>
  <div class="editor-container">
    <div class="editor-wrapper">
      <!-- Line Numbers -->
      <div class="line-numbers" ref="lineNumbers">
        <div v-for="i in lineCount" :key="i" class="line-number">{{ i }}</div>
      </div>

      <!-- Editor Area -->
      <div class="editor-content">
        <!-- Highlight Overlay -->
        <div class="editor-overlay" ref="editorOverlay">
          <pre ref="highlightPre" class="highlight-pre"><code ref="highlightCode" :class="getHighlightClass"></code></pre>
        </div>

        <!-- Textarea -->
        <textarea
          ref="scriptEditor"
          :value="modelValue"
          class="script-editor"
          :placeholder="placeholder"
          spellcheck="false"
          @input="handleInput"
          @scroll="handleEditorScroll"
          @keydown="handleKeydown"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import hljs from 'highlight.js/lib/core'
import shell from 'highlight.js/lib/languages/shell'
import bash from 'highlight.js/lib/languages/bash'
import perl from 'highlight.js/lib/languages/perl'
import python from 'highlight.js/lib/languages/python'
import powershell from 'highlight.js/lib/languages/powershell'
import sql from 'highlight.js/lib/languages/sql'

// Register languages
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('perl', perl)
hljs.registerLanguage('python', python)
hljs.registerLanguage('powershell', powershell)
hljs.registerLanguage('sql', sql)

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'shell'
  },
  placeholder: {
    type: String,
    default: '请输入脚本内容'
  }
})

const emit = defineEmits(['update:modelValue'])

// Refs
const highlightPre = ref<HTMLElement>()
const highlightCode = ref<HTMLElement>()
const lineNumbers = ref<HTMLElement>()
const editorOverlay = ref<HTMLElement>()
const scriptEditor = ref<HTMLTextAreaElement>()

// State
let isComponentMounted = true
let highlightLock = false
let highlightTimeout: number | null = null

// Computed
const getHighlightClass = computed(() => `hljs language-${props.language}`)

const lineCount = computed(() => {
  const lines = props.modelValue.split('\n')
  return lines.length === 1 && lines[0] === '' ? 1 : lines.length
})

// Methods
const updateLineNumbers = () => {
  if (!isComponentMounted || !lineNumbers.value) return
  // Logic handled by v-for in template, but we might need to sync scroll
}

const initHighlight = async () => {
  if (highlightLock || !isComponentMounted) return
  await nextTick()
  if (!isComponentMounted || !highlightCode.value) return

  try {
    highlightLock = true
    highlightCode.value.className = `hljs language-${props.language}`
    const result = hljs.highlight(props.modelValue, { language: props.language })
    highlightCode.value.innerHTML = result.value
  } catch (error) {
    console.error('Highlight error:', error)
    highlightCode.value.textContent = props.modelValue
  } finally {
    highlightLock = false
  }
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  
  if (highlightTimeout) clearTimeout(highlightTimeout)
  highlightTimeout = window.setTimeout(() => {
    if (isComponentMounted) initHighlight()
  }, 50)
}

const handleEditorScroll = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  const scrollTop = target.scrollTop
  const scrollLeft = target.scrollLeft

  if (editorOverlay.value) {
    editorOverlay.value.scrollTop = scrollTop
    editorOverlay.value.scrollLeft = scrollLeft
  }
  if (lineNumbers.value) {
    lineNumbers.value.scrollTop = scrollTop
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    const target = e.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd
    const newValue = props.modelValue.substring(0, start) + '  ' + props.modelValue.substring(end)
    
    emit('update:modelValue', newValue)
    
    nextTick(() => {
      if (scriptEditor.value) {
        scriptEditor.value.selectionStart = scriptEditor.value.selectionEnd = start + 2
      }
    })
  }
}

// Watchers
watch(() => props.modelValue, () => {
  // If value changes externally, we might need to re-highlight
  // But usually handleInput handles it. 
  // We can add a check if needed, but for now let's rely on initHighlight being called on mount/change
  if (!highlightLock) {
     nextTick(initHighlight)
  }
})

watch(() => props.language, () => {
  nextTick(initHighlight)
})

// Lifecycle
onMounted(() => {
  isComponentMounted = true
  initHighlight()
})

onUnmounted(() => {
  isComponentMounted = false
  if (highlightTimeout) clearTimeout(highlightTimeout)
})
</script>

<style scoped>
.editor-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  background-color: #1e1e1e;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.editor-wrapper {
  position: relative;
  height: 400px;
  display: flex;
  overflow: hidden;
}

.line-numbers {
  width: 50px;
  background-color: #2d2d2d;
  color: #858585;
  font-size: 14px;
  line-height: 22.4px;
  padding: 16px 8px;
  text-align: right;
  user-select: none;
  overflow: hidden;
  border-right: 1px solid #3e3e42;
  flex-shrink: 0;
  box-sizing: border-box;
}

.line-number {
  height: 22.4px;
  line-height: 22.4px;
}

.editor-content {
  flex: 1;
  position: relative;
  overflow: auto;
  background-color: #1e1e1e;
  font-size: 14px;
  line-height: 22.4px;
}

.editor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.highlight-pre {
  margin: 0;
  padding: 16px;
  background: transparent;
  min-height: 100%;
  box-sizing: border-box;
  white-space: pre;
  word-break: normal;
  overflow: visible;
  color: #abb2bf;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.script-editor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  margin: 0;
  border: none;
  resize: none;
  background: transparent;
  color: transparent;
  caret-color: #ffffff;
  outline: none;
  z-index: 2;
  white-space: pre;
  overflow: auto;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: 0;
  word-spacing: 0;
  tab-size: 2;
}

.script-editor::placeholder {
  color: #6c757d;
  opacity: 0.6;
}
</style>
