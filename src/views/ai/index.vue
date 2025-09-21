<script setup lang="ts">
import {emojiList} from "@/utils/emojis";
import {nextTick, onMounted, reactive, ref} from "vue";
import {ElScrollbar} from "element-plus";
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
// 自定义高亮规则
import 'highlight.js/styles/panda-syntax-light.css'

const initHighlight = () => {
  hljs.configure({
    languages: ['javascript', 'python', 'java'],
    ignoreUnescapedHTML: true
  })
}

// 在组合式函数中调用
onMounted(() => {
  initHighlight()
  hljs.highlightAll()
})

const msg = reactive<any>({
  fromId:'me',
  message:'',
})

const msgList = ref<Array<any>>([{
  formId:'ai',
  message: '您可以询问我所有关东西部协助的问题~ 😊'
}])

const socket = ref<any>({})
const emojiFlag = ref<boolean>(false)


const sendMsg = async ()=>{

  msgList.value.push({...msg})
  const  eventSource = new EventSource('http://localhost:8080/api/v1/ai/chat?message='+msg.message);
  msgList.value.push({
    formId: 'ai',
    message: ''
  })
  msg.message = ''
  eventSource.onmessage = (event) => {
    console.log(event.data)
    msgList.value[msgList.value.length-1].message += event.data
    nextTick(()=>{
      scrollbarRef.value!.setScrollTop(items.value?.scrollHeight || 0)
    })
  };
  eventSource.onerror = (error) => {
    eventSource.close();
  };

}
const useMarkdownParser = (initialContent:string) => {
  const md = ref(new MarkdownIt({
    html: true,
    highlight: (code, lang) => {
      return hljs.highlightAuto(code).value
    }
  }))
  const parsedContent = ref('')

  const parseContent = (content:string) => {
    return   md.value.render(content)
  }

  onMounted(() => {
    hljs.highlightAll() // 初始化代码高亮
  })

  return { parsedContent, parseContent }
}

// 组件实现
const { parsedContent, parseContent } = useMarkdownParser()

const value = ref<number>(0)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const items = ref<HTMLDivElement>()

const scroll = ({ scrollTop }:any) => {
  console.log(items.value?.scrollHeight,scrollTop)
  value.value = scrollTop
}

const popoverRef = ref<any>()

</script>

<template>
  <div class="chat-container">
    <div  style="width: 100%;box-sizing: border-box;height:100%">
      <div   style="display: flex;flex-direction: column;height: 100%">
        <el-card  style="background-color: #42b883;margin-bottom: 10px" body-style="display: flex;align-items: center; justify-content: space-between;padding:7px 10px">
          <div></div>
          <div style="color:white">
            智慧助手
          </div>
          <el-button type="text"  @click="socket.close()">
            <el-icon style="color:white"><CloseBold /></el-icon>
          </el-button>
        </el-card>
        <el-card style="height: calc(100% - 235px)" body-style="padding:0px;height:100%" >
          <el-scrollbar height="100%" style="padding:15px;" ref="scrollbarRef"  always @scroll="scroll">
            <div ref="items">
              <div  :class="{msg:true,'msg-self':m.fromId == 'me' }"   v-for="(m,index) in msgList">
                <div class="msg-img" v-if="m.fromId!='me'">
                  <el-avatar :src="'https://img1.baidu.com/it/u=199283956,1140565848&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'" alt="" shape="square"></el-avatar>
                </div>
                <div class="msg-text">
                  <!--                  <div v-if="m.fromId!='me'" >智慧助手</div>-->
                  <p >
                    <div v-if="m.fromId=='me'">
                      {{ m.message }}
                    </div>
                    <div class="markdown-viewer markdown-body" v-html="parseContent(m.message)" v-else></div>
                  </p>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
        <el-card style="height: 170px;margin-top: 5px;">
          <el-input type="textarea" :rows="4" resize="none" v-model="msg.message" @keyup.enter="sendMsg"></el-input>
          <div style="display: flex;justify-content: space-between;margin-top: 10px">
            <div style="position: relative">
              <el-popover
                  ref="popoverRef"
                  placement="top"
                  :width="305"
                  trigger="click"
              >
                <div  style="height: 160px" >
                  <el-scrollbar height="160px">
                    <span  @click="msg.message+=e,popoverRef.hide()" class="emoji" v-for=" e  in emojiList"> {{ e }}</span>
                  </el-scrollbar>
                </div>
                <template #reference>
                  <svg @click="emojiFlag = !emojiFlag"  style="width: 25px;height: 25px"  t="1716363492417" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10637" width="500" height="500"><path d="M288.92672 400.45568c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m334.60224 0c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m-111.5392 362.4704c-78.05952 0-156.13952-39.08096-200.75008-100.3776-16.77312-22.31296-27.84256-50.15552-39.08096-72.45824-5.53472-16.77312 5.5296-33.4592 16.77312-39.08096 16.77312-5.53472 27.84256 5.53472 33.46432 16.768 5.53472 22.30784 16.77312 39.08608 27.84256 55.77728 44.61568 55.76704 100.38272 83.69664 161.664 83.69664 61.30176 0 122.7008-27.84256 156.16-78.07488 11.15136-16.77824 22.30784-38.99904 27.84256-55.77728 5.62176-16.768 22.30784-22.30272 33.4592-16.768 16.768 5.53472 22.30784 22.30272 16.768 33.4592-5.61152 27.84256-22.2976 50.14528-39.08096 72.45824-38.912 61.37856-116.98176 100.3776-195.06176 100.3776z m0 194.51392C268.4928 957.44 66.56 755.52256 66.56 511.99488 66.56 268.48256 268.4928 66.56 511.98976 66.56 755.50208 66.56 957.44 268.48256 957.44 511.99488 957.44 755.52256 755.50208 957.44 511.98976 957.44z m0-831.45728c-213.78048 0-386.00192 172.21632-386.00192 386.01216 0 213.8112 172.22144 386.0224 386.00192 386.0224 213.80096 0 386.0224-172.2112 386.0224-386.0224 0-213.79584-172.22144-386.01216-386.0224-386.01216z" fill="#6c8bf8" p-id="10638"></path></svg>
                </template>
              </el-popover>
              <!--              <div id="emojis" v-show="emojiFlag">-->
              <!--                <span  @click="msg.message+=e,emojiFlag=false" class="emoji" v-for=" e  in emojiList"> {{ e }}</span>-->
              <!--              </div>-->
              <!--              <svg @click="emojiFlag = !emojiFlag"  style="width: 25px;height: 25px"  t="1716363492417" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10637" width="500" height="500"><path d="M288.92672 400.45568c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m334.60224 0c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m-111.5392 362.4704c-78.05952 0-156.13952-39.08096-200.75008-100.3776-16.77312-22.31296-27.84256-50.15552-39.08096-72.45824-5.53472-16.77312 5.5296-33.4592 16.77312-39.08096 16.77312-5.53472 27.84256 5.53472 33.46432 16.768 5.53472 22.30784 16.77312 39.08608 27.84256 55.77728 44.61568 55.76704 100.38272 83.69664 161.664 83.69664 61.30176 0 122.7008-27.84256 156.16-78.07488 11.15136-16.77824 22.30784-38.99904 27.84256-55.77728 5.62176-16.768 22.30784-22.30272 33.4592-16.768 16.768 5.53472 22.30784 22.30272 16.768 33.4592-5.61152 27.84256-22.2976 50.14528-39.08096 72.45824-38.912 61.37856-116.98176 100.3776-195.06176 100.3776z m0 194.51392C268.4928 957.44 66.56 755.52256 66.56 511.99488 66.56 268.48256 268.4928 66.56 511.98976 66.56 755.50208 66.56 957.44 268.48256 957.44 511.99488 957.44 755.52256 755.50208 957.44 511.98976 957.44z m0-831.45728c-213.78048 0-386.00192 172.21632-386.00192 386.01216 0 213.8112 172.22144 386.0224 386.00192 386.0224 213.80096 0 386.0224-172.2112 386.0224-386.0224 0-213.79584-172.22144-386.01216-386.0224-386.01216z" fill="#6c8bf8" p-id="10638"></path></svg>-->
            </div>
            <el-button style="width: 80px;" type="primary" @click="sendMsg" >发送</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container{
  height: 100%;
}
.chat-partner{
  margin-top: 10px;
  width: 100%;
}
.chatting {
  background-color: whitesmoke;
}
.chat-partner .item{
  display: flex;
  padding: 20px 10px;
  align-items: center;
}
.chat-partner .item .el-avatar{
  width: 45px;
  height: 45px;
}
.chat-partner .item .text{
  padding-left: 10px;
  flex: 1;
}
.chat-partner .item .info{
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.chat-partner .item .text .name{
  font-size: 16px;
}
.chat-partner .item .text .message,.time{
  color: #999;
  font-size: 13px;
}
.chat-partner .item .text .message{
  display: flex;
  justify-content: space-between;
}
.chat-container{
  display: flex;
}

#emojis{
  /*
      内容超出时，增加滚动条
  */
  overflow-y: scroll;
  width: 140px;
  height: 110px;
  border-radius: 2px;
  background-color: white;
  box-shadow: 2px 2px 10px gray;
  position: absolute;
  top: -118px;
}
.emoji{
  /*
  设置行内式可以设置盒子模型
  */
  display: inline-block;
  padding: 2px;
  margin: 2px ;
  cursor: pointer;
}
.emoji:hover{
  background-color: #d2d2d2;
  border-radius: 2px;
}
/* 消息区 */
.msg{
  display: flex;
  margin: 10px 0;
}
.msg-img img{
  width: 35px;
  height: 35px;
}
.msg-text{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 10px;
  word-break: break-all;
  max-width: 65%;
}
.msg-text p{
  border-radius: 5px;
  padding: 10px;
  font-size: 12px;

}
/* 以下为自己发送的消息 */
.msg-self{
  /* 改变排列反向为 行排倒序  从右往左 */
  flex-direction: row-reverse;
}

.msg-self p{
  background-color: #42b883;
  color:white;
}

.msg-self .msg-text{
  align-items: flex-end;
}


.msg-text img{
  max-width: 50%;
  margin: 0 10px;
  float: right;

}

</style>
<style>
@import 'github-markdown-css';

</style>
