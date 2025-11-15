import { emojiList } from "@/utils/emojis";
import { nextTick, onMounted, reactive, ref } from "vue";
import { ElScrollbar } from "element-plus";
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
// 自定义高亮规则
import 'highlight.js/styles/panda-syntax-light.css';
const initHighlight = () => {
    hljs.configure({
        languages: ['javascript', 'python', 'java'],
        ignoreUnescapedHTML: true
    });
};
// 在组合式函数中调用
onMounted(() => {
    initHighlight();
    hljs.highlightAll();
});
const msg = reactive({
    fromId: 'me',
    message: '',
});
const msgList = ref([{
        formId: 'ai',
        message: '您可以询问我所有关东西部协助的问题~ 😊'
    }]);
const socket = ref({});
const emojiFlag = ref(false);
const sendMsg = async () => {
    msgList.value.push({ ...msg });
    const eventSource = new EventSource('http://localhost:8080/api/v1/ai/chat?message=' + msg.message);
    msgList.value.push({
        formId: 'ai',
        message: ''
    });
    msg.message = '';
    eventSource.onmessage = (event) => {
        console.log(event.data);
        msgList.value[msgList.value.length - 1].message += event.data;
        nextTick(() => {
            scrollbarRef.value.setScrollTop(items.value?.scrollHeight || 0);
        });
    };
    eventSource.onerror = (error) => {
        eventSource.close();
    };
};
const useMarkdownParser = (initialContent) => {
    const md = ref(new MarkdownIt({
        html: true,
        highlight: (code, lang) => {
            return hljs.highlightAuto(code).value;
        }
    }));
    const parsedContent = ref('');
    const parseContent = (content) => {
        return md.value.render(content);
    };
    onMounted(() => {
        hljs.highlightAll(); // 初始化代码高亮
    });
    return { parsedContent, parseContent };
};
// 组件实现
const { parsedContent, parseContent } = useMarkdownParser();
const value = ref(0);
const scrollbarRef = ref();
const items = ref();
const scroll = ({ scrollTop }) => {
    console.log(items.value?.scrollHeight, scrollTop);
    value.value = scrollTop;
};
const popoverRef = ref();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['chat-partner']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-partner']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-partner']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-partner']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-partner']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-partner']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-partner']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['emoji']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-text']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-self']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-self']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-text']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-text']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ style: {} },
    bodyStyle: "display: flex;align-items: center; justify-content: space-between;padding:7px 10px",
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
    bodyStyle: "display: flex;align-items: center; justify-content: space-between;padding:7px 10px",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: "text",
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (...[$event]) => {
        __VLS_ctx.socket.close();
    }
};
__VLS_7.slots.default;
const __VLS_12 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.CloseBold;
/** @type {[typeof __VLS_components.CloseBold, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_15;
var __VLS_7;
var __VLS_3;
const __VLS_20 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ style: {} },
    bodyStyle: "padding:0px;height:100%",
}));
const __VLS_22 = __VLS_21({
    ...{ style: {} },
    bodyStyle: "padding:0px;height:100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElScrollbar;
/** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onScroll': {} },
    height: "100%",
    ...{ style: {} },
    ref: "scrollbarRef",
    always: true,
}));
const __VLS_26 = __VLS_25({
    ...{ 'onScroll': {} },
    height: "100%",
    ...{ style: {} },
    ref: "scrollbarRef",
    always: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onScroll: (__VLS_ctx.scroll)
};
/** @type {typeof __VLS_ctx.scrollbarRef} */ ;
var __VLS_32 = {};
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "items",
});
/** @type {typeof __VLS_ctx.items} */ ;
for (const [m, index] of __VLS_getVForSourceType((__VLS_ctx.msgList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ({ msg: true, 'msg-self': m.fromId == 'me' }) },
    });
    if (m.fromId != 'me') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-img" },
        });
        const __VLS_34 = {}.ElAvatar;
        /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
            src: ('https://img1.baidu.com/it/u=199283956,1140565848&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'),
            alt: "",
            shape: "square",
        }));
        const __VLS_36 = __VLS_35({
            src: ('https://img1.baidu.com/it/u=199283956,1140565848&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'),
            alt: "",
            shape: "square",
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "msg-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    if (m.fromId == 'me') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        (m.message);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "markdown-viewer markdown-body" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.parseContent(m.message)) }, null, null);
    }
}
var __VLS_27;
var __VLS_23;
const __VLS_38 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    ...{ style: {} },
}));
const __VLS_40 = __VLS_39({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
const __VLS_42 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    ...{ 'onKeyup': {} },
    type: "textarea",
    rows: (4),
    resize: "none",
    modelValue: (__VLS_ctx.msg.message),
}));
const __VLS_44 = __VLS_43({
    ...{ 'onKeyup': {} },
    type: "textarea",
    rows: (4),
    resize: "none",
    modelValue: (__VLS_ctx.msg.message),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_46;
let __VLS_47;
let __VLS_48;
const __VLS_49 = {
    onKeyup: (__VLS_ctx.sendMsg)
};
var __VLS_45;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
const __VLS_50 = {}.ElPopover;
/** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    ref: "popoverRef",
    placement: "top",
    width: (305),
    trigger: "click",
}));
const __VLS_52 = __VLS_51({
    ref: "popoverRef",
    placement: "top",
    width: (305),
    trigger: "click",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
/** @type {typeof __VLS_ctx.popoverRef} */ ;
var __VLS_54 = {};
__VLS_53.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
const __VLS_56 = {}.ElScrollbar;
/** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    height: "160px",
}));
const __VLS_58 = __VLS_57({
    height: "160px",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
for (const [e] of __VLS_getVForSourceType((__VLS_ctx.emojiList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.msg.message += e, __VLS_ctx.popoverRef.hide();
            } },
        ...{ class: "emoji" },
    });
    (e);
}
var __VLS_59;
{
    const { reference: __VLS_thisSlot } = __VLS_53.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.emojiFlag = !__VLS_ctx.emojiFlag;
            } },
        ...{ style: {} },
        t: "1716363492417",
        ...{ class: "icon" },
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        'p-id': "10637",
        width: "500",
        height: "500",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M288.92672 400.45568c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m334.60224 0c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m-111.5392 362.4704c-78.05952 0-156.13952-39.08096-200.75008-100.3776-16.77312-22.31296-27.84256-50.15552-39.08096-72.45824-5.53472-16.77312 5.5296-33.4592 16.77312-39.08096 16.77312-5.53472 27.84256 5.53472 33.46432 16.768 5.53472 22.30784 16.77312 39.08608 27.84256 55.77728 44.61568 55.76704 100.38272 83.69664 161.664 83.69664 61.30176 0 122.7008-27.84256 156.16-78.07488 11.15136-16.77824 22.30784-38.99904 27.84256-55.77728 5.62176-16.768 22.30784-22.30272 33.4592-16.768 16.768 5.53472 22.30784 22.30272 16.768 33.4592-5.61152 27.84256-22.2976 50.14528-39.08096 72.45824-38.912 61.37856-116.98176 100.3776-195.06176 100.3776z m0 194.51392C268.4928 957.44 66.56 755.52256 66.56 511.99488 66.56 268.48256 268.4928 66.56 511.98976 66.56 755.50208 66.56 957.44 268.48256 957.44 511.99488 957.44 755.52256 755.50208 957.44 511.98976 957.44z m0-831.45728c-213.78048 0-386.00192 172.21632-386.00192 386.01216 0 213.8112 172.22144 386.0224 386.00192 386.0224 213.80096 0 386.0224-172.2112 386.0224-386.0224 0-213.79584-172.22144-386.01216-386.0224-386.01216z",
        fill: "#6c8bf8",
        'p-id': "10638",
    });
}
var __VLS_53;
const __VLS_60 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    ...{ style: {} },
    type: "primary",
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    ...{ style: {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (__VLS_ctx.sendMsg)
};
__VLS_63.slots.default;
var __VLS_63;
var __VLS_41;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['msg']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-self']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-img']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-text']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['emoji']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
// @ts-ignore
var __VLS_33 = __VLS_32, __VLS_55 = __VLS_54;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emojiList: emojiList,
            ElScrollbar: ElScrollbar,
            msg: msg,
            msgList: msgList,
            socket: socket,
            emojiFlag: emojiFlag,
            sendMsg: sendMsg,
            parseContent: parseContent,
            scrollbarRef: scrollbarRef,
            items: items,
            scroll: scroll,
            popoverRef: popoverRef,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map