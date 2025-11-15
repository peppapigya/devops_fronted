import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, Delete, Link, Search, Plus, Monitor } from '@element-plus/icons-vue';
import { HostsApi } from '@/api/hosts/index';
import BeautifiedMetricsView from '@/components/BeautifiedMetrics.vue'; // 新增导入
const hosts = ref([]);
const loading = ref(false);
const total = ref(0);
const pageParam = ref({
    pageSize: 10,
    pageNumber: 1,
    keyword: ''
});
function resetQuery() {
    pageParam.value.pageSize = 10;
    pageParam.value.pageNumber = 1;
    pageParam.value.keyword = '';
    loadHosts();
}
const inspectResult = ref('');
const testResult = ref('');
// 表单弹窗
const dialogVisible = ref(false);
const saving = ref(false);
const formRef = ref();
const form = reactive({
    id: 0,
    hostName: '',
    address: '',
    hostPort: 22,
    username: '',
    hostPassword: '',
    remark: '',
});
const formRules = {
    hostName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址或 IP', trigger: 'blur' }],
    hostPort: [{ required: true, message: '请输入端口', trigger: 'change' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
};
function resetForm() {
    form.id = 0;
    form.hostName = '';
    form.address = '';
    form.hostPort = 22;
    form.username = '';
    form.hostPassword = '';
    form.remark = '';
}
function openCreate() {
    resetForm();
    dialogVisible.value = true;
}
function openEdit(h) {
    form.id = h.id;
    form.hostName = h.hostName;
    form.address = h.address;
    form.hostPort = h.hostPort;
    form.username = h.username;
    form.hostPassword = '';
    form.remark = h.remark || '';
    dialogVisible.value = true;
}
function formatDate(dt) {
    if (!dt)
        return '';
    const d = new Date(dt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}
const inspectObj = ref(null);
const inspectDialogVisible = ref(false);
async function loadHosts() {
    loading.value = true;
    try {
        const res = await HostsApi.list(pageParam.value);
        hosts.value = res.data;
        total.value = res.total;
        pageParam.value.pageSize = res.pageSize;
        pageParam.value.pageNumber = res.pageNumber;
    }
    catch (e) {
        ElMessage.error(e.message || '加载失败');
    }
    finally {
        loading.value = false;
    }
}
function onPageChange(page) {
    pageParam.value.pageNumber = page;
    loadHosts();
}
function onPageSizeChange(size) {
    pageParam.value.pageSize = size;
    loadHosts();
}
async function saveHost() {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (!valid)
            return;
        saving.value = true;
        try {
            const payload = {
                id: form.id,
                hostName: form.hostName.trim(),
                address: form.address.trim(),
                hostPort: form.hostPort || 22,
                username: form.username.trim(),
                hostPassword: form.hostPassword || '',
                remark: (form.remark || '').trim(),
            };
            if (form.id) {
                await HostsApi.update(payload);
                ElMessage.success('更新成功');
            }
            else {
                await HostsApi.create(payload);
                ElMessage.success('添加成功');
            }
            dialogVisible.value = false;
            resetForm();
            await loadHosts();
        }
        catch (e) {
            ElMessage.error(e.message || '保存失败');
        }
        finally {
            saving.value = false;
        }
    });
}
async function onDelete(id) {
    try {
        await ElMessageBox.confirm('确认删除该主机？', '提示', { type: 'warning' });
        await HostsApi.remove(id);
        ElMessage.success('删除成功');
        await loadHosts();
    }
    catch {
    }
}
async function onTest(id) {
    testResult.value = '';
    try {
        const txt = await HostsApi.test(id);
        ElMessage.success('连接正常');
        testResult.value = typeof txt === 'string' ? txt : JSON.stringify(txt);
    }
    catch (e) {
        ElMessage.error('测试失败');
        testResult.value = `测试失败：${e?.message || '未知错误'}`;
    }
}
async function onInspect(id) {
    inspectResult.value = '';
    try {
        const data = await HostsApi.inspect(id);
        ElMessage.success('巡检完成');
        inspectResult.value = JSON.stringify(data, null, 2);
        inspectObj.value = data;
        console.log("data:", data);
        inspectDialogVisible.value = true;
    }
    catch (e) {
        ElMessage.error('巡检失败');
        inspectResult.value = `巡检失败：${e?.message || '未知错误'}`;
        inspectObj.value = null;
    }
}
onMounted(loadHosts);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hosts-page" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "toolbar" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "toolbar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-left" },
});
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    inline: (true),
    model: (__VLS_ctx.pageParam),
    ...{ class: "filter-form" },
}));
const __VLS_6 = __VLS_5({
    inline: (true),
    model: (__VLS_ctx.pageParam),
    ...{ class: "filter-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "关键词",
}));
const __VLS_10 = __VLS_9({
    label: "关键词",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.pageParam.keyword),
    clearable: true,
    placeholder: "名称 / IP / 用户名",
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.pageParam.keyword),
    clearable: true,
    placeholder: "名称 / IP / 用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onKeyup: (__VLS_ctx.loadHosts)
};
var __VLS_15;
var __VLS_11;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.loadHosts)
};
__VLS_27.slots.default;
var __VLS_27;
const __VLS_32 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_35.slots.default;
var __VLS_35;
var __VLS_23;
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_43.slots.default;
var __VLS_43;
var __VLS_3;
const __VLS_48 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    shadow: "never",
    ...{ class: "table-card" },
}));
const __VLS_50 = __VLS_49({
    shadow: "never",
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    data: (__VLS_ctx.hosts),
    border: true,
    stripe: true,
    ...{ style: {} },
    emptyText: "暂无数据",
}));
const __VLS_54 = __VLS_53({
    data: (__VLS_ctx.hosts),
    border: true,
    stripe: true,
    ...{ style: {} },
    emptyText: "暂无数据",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_55.slots.default;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "hostName",
    label: "名称",
    minWidth: "160",
}));
const __VLS_58 = __VLS_57({
    prop: "hostName",
    label: "名称",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "address",
    label: "地址/IP",
    minWidth: "180",
}));
const __VLS_62 = __VLS_61({
    prop: "address",
    label: "地址/IP",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "hostPort",
    label: "端口",
    width: "100",
}));
const __VLS_66 = __VLS_65({
    prop: "hostPort",
    label: "端口",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "username",
    label: "用户名",
    minWidth: "140",
}));
const __VLS_70 = __VLS_69({
    prop: "username",
    label: "用户名",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "remark",
    label: "备注",
    minWidth: "220",
    showOverflowTooltip: true,
}));
const __VLS_74 = __VLS_73({
    prop: "remark",
    label: "备注",
    minWidth: "220",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "创建时间",
    minWidth: "180",
}));
const __VLS_78 = __VLS_77({
    label: "创建时间",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.created_at));
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "操作",
    width: "360",
    fixed: "right",
}));
const __VLS_82 = __VLS_81({
    label: "操作",
    width: "360",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.Edit),
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.Edit),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_87.slots.default;
    var __VLS_87;
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        icon: (__VLS_ctx.Link),
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        icon: (__VLS_ctx.Link),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onTest(row.id);
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        size: "small",
        type: "warning",
        icon: (__VLS_ctx.Monitor),
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        size: "small",
        type: "warning",
        icon: (__VLS_ctx.Monitor),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onInspect(row.id);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        icon: (__VLS_ctx.Delete),
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        icon: (__VLS_ctx.Delete),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onDelete(row.id);
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
}
var __VLS_83;
var __VLS_55;
const __VLS_116 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    pageSize: (__VLS_ctx.pageParam.pageSize),
    currentPage: (__VLS_ctx.pageParam.pageNumber),
}));
const __VLS_118 = __VLS_117({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    pageSize: (__VLS_ctx.pageParam.pageSize),
    currentPage: (__VLS_ctx.pageParam.pageNumber),
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_120;
let __VLS_121;
let __VLS_122;
const __VLS_123 = {
    onSizeChange: (__VLS_ctx.onPageSizeChange)
};
const __VLS_124 = {
    onCurrentChange: (__VLS_ctx.onPageChange)
};
var __VLS_119;
var __VLS_51;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "result-grid" },
});
if (__VLS_ctx.testResult) {
    const __VLS_125 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
        ...{ class: "result-card" },
        shadow: "never",
    }));
    const __VLS_127 = __VLS_126({
        ...{ class: "result-card" },
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    __VLS_128.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_128.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_129 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_131 = __VLS_130({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        let __VLS_133;
        let __VLS_134;
        let __VLS_135;
        const __VLS_136 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.testResult))
                    return;
                __VLS_ctx.testResult = '';
            }
        };
        __VLS_132.slots.default;
        var __VLS_132;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "result-pre" },
    });
    (__VLS_ctx.testResult);
    var __VLS_128;
}
if (__VLS_ctx.inspectResult) {
    const __VLS_137 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
        ...{ class: "result-card" },
        shadow: "never",
    }));
    const __VLS_139 = __VLS_138({
        ...{ class: "result-card" },
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    __VLS_140.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_140.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        if (__VLS_ctx.inspectObj) {
            const __VLS_141 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
            }));
            const __VLS_143 = __VLS_142({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_142));
            let __VLS_145;
            let __VLS_146;
            let __VLS_147;
            const __VLS_148 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.inspectResult))
                        return;
                    if (!(__VLS_ctx.inspectObj))
                        return;
                    __VLS_ctx.inspectDialogVisible = true;
                }
            };
            __VLS_144.slots.default;
            var __VLS_144;
        }
        const __VLS_149 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_151 = __VLS_150({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        let __VLS_153;
        let __VLS_154;
        let __VLS_155;
        const __VLS_156 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.inspectResult))
                    return;
                __VLS_ctx.inspectResult = '';
            }
        };
        __VLS_152.slots.default;
        var __VLS_152;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "result-pre" },
    });
    (__VLS_ctx.inspectResult);
    var __VLS_140;
}
const __VLS_157 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    modelValue: (__VLS_ctx.inspectDialogVisible),
    title: "巡检详情",
    width: "900px",
    destroyOnClose: true,
}));
const __VLS_159 = __VLS_158({
    modelValue: (__VLS_ctx.inspectDialogVisible),
    title: "巡检详情",
    width: "900px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
__VLS_160.slots.default;
if (__VLS_ctx.inspectObj) {
    /** @type {[typeof BeautifiedMetricsView, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(BeautifiedMetricsView, new BeautifiedMetricsView({
        data: (__VLS_ctx.inspectObj),
    }));
    const __VLS_162 = __VLS_161({
        data: (__VLS_ctx.inspectObj),
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
}
{
    const { footer: __VLS_thisSlot } = __VLS_160.slots;
    const __VLS_164 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        ...{ 'onClick': {} },
    }));
    const __VLS_166 = __VLS_165({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    let __VLS_168;
    let __VLS_169;
    let __VLS_170;
    const __VLS_171 = {
        onClick: (...[$event]) => {
            __VLS_ctx.inspectDialogVisible = false;
        }
    };
    __VLS_167.slots.default;
    var __VLS_167;
}
var __VLS_160;
const __VLS_172 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.form.id ? '编辑主机' : '新增主机'),
    width: "520px",
    destroyOnClose: true,
}));
const __VLS_174 = __VLS_173({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.form.id ? '编辑主机' : '新增主机'),
    width: "520px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}));
const __VLS_178 = __VLS_177({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_180 = {};
__VLS_179.slots.default;
const __VLS_182 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
    label: "名称",
    prop: "hostName",
}));
const __VLS_184 = __VLS_183({
    label: "名称",
    prop: "hostName",
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
__VLS_185.slots.default;
const __VLS_186 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
    modelValue: (__VLS_ctx.form.hostName),
    placeholder: "例如：生产-DB01",
}));
const __VLS_188 = __VLS_187({
    modelValue: (__VLS_ctx.form.hostName),
    placeholder: "例如：生产-DB01",
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
var __VLS_185;
const __VLS_190 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
    label: "地址/IP",
    prop: "address",
}));
const __VLS_192 = __VLS_191({
    label: "地址/IP",
    prop: "address",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
__VLS_193.slots.default;
const __VLS_194 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
    modelValue: (__VLS_ctx.form.address),
    placeholder: "例如：192.168.1.10",
}));
const __VLS_196 = __VLS_195({
    modelValue: (__VLS_ctx.form.address),
    placeholder: "例如：192.168.1.10",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
var __VLS_193;
const __VLS_198 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    label: "端口",
    prop: "hostPort",
}));
const __VLS_200 = __VLS_199({
    label: "端口",
    prop: "hostPort",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_201.slots.default;
const __VLS_202 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    modelValue: (__VLS_ctx.form.hostPort),
    min: (1),
    max: (65535),
    step: (1),
    controlsPosition: "right",
}));
const __VLS_204 = __VLS_203({
    modelValue: (__VLS_ctx.form.hostPort),
    min: (1),
    max: (65535),
    step: (1),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
var __VLS_201;
const __VLS_206 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
    label: "用户名",
    prop: "username",
}));
const __VLS_208 = __VLS_207({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
__VLS_209.slots.default;
const __VLS_210 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "例如：root",
}));
const __VLS_212 = __VLS_211({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "例如：root",
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
var __VLS_209;
const __VLS_214 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
    label: "密码",
}));
const __VLS_216 = __VLS_215({
    label: "密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
__VLS_217.slots.default;
const __VLS_218 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
    modelValue: (__VLS_ctx.form.hostPassword),
    type: "hostPassword",
    placeholder: "SSH 密码（可选）",
    'show-hostPassword': true,
}));
const __VLS_220 = __VLS_219({
    modelValue: (__VLS_ctx.form.hostPassword),
    type: "hostPassword",
    placeholder: "SSH 密码（可选）",
    'show-hostPassword': true,
}, ...__VLS_functionalComponentArgsRest(__VLS_219));
var __VLS_217;
const __VLS_222 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({
    label: "备注",
}));
const __VLS_224 = __VLS_223({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
__VLS_225.slots.default;
const __VLS_226 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    maxlength: "500",
    showWordLimit: true,
    placeholder: "可填写用途、环境、说明",
}));
const __VLS_228 = __VLS_227({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    maxlength: "500",
    showWordLimit: true,
    placeholder: "可填写用途、环境、说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
var __VLS_225;
const __VLS_230 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({}));
const __VLS_232 = __VLS_231({}, ...__VLS_functionalComponentArgsRest(__VLS_231));
__VLS_233.slots.default;
const __VLS_234 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({
    title: "提示：密码仅用于后端建立 SSH 连接，示例以明文存储于 SQLite，生产建议加密或使用秘钥登录。",
    type: "info",
    closable: (false),
    showIcon: true,
}));
const __VLS_236 = __VLS_235({
    title: "提示：密码仅用于后端建立 SSH 连接，示例以明文存储于 SQLite，生产建议加密或使用秘钥登录。",
    type: "info",
    closable: (false),
    showIcon: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_235));
var __VLS_233;
var __VLS_179;
{
    const { footer: __VLS_thisSlot } = __VLS_175.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_238 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
        ...{ 'onClick': {} },
    }));
    const __VLS_240 = __VLS_239({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    let __VLS_242;
    let __VLS_243;
    let __VLS_244;
    const __VLS_245 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_241.slots.default;
    var __VLS_241;
    const __VLS_246 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_248 = __VLS_247({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    let __VLS_250;
    let __VLS_251;
    let __VLS_252;
    const __VLS_253 = {
        onClick: (__VLS_ctx.saveHost)
    };
    __VLS_249.slots.default;
    var __VLS_249;
}
var __VLS_175;
/** @type {__VLS_StyleScopedClasses['hosts-page']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-left']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-form']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['result-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['result-pre']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['result-pre']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_181 = __VLS_180;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Edit: Edit,
            Delete: Delete,
            Link: Link,
            Search: Search,
            Plus: Plus,
            Monitor: Monitor,
            BeautifiedMetricsView: BeautifiedMetricsView,
            hosts: hosts,
            loading: loading,
            total: total,
            pageParam: pageParam,
            resetQuery: resetQuery,
            inspectResult: inspectResult,
            testResult: testResult,
            dialogVisible: dialogVisible,
            saving: saving,
            formRef: formRef,
            form: form,
            formRules: formRules,
            openCreate: openCreate,
            openEdit: openEdit,
            formatDate: formatDate,
            inspectObj: inspectObj,
            inspectDialogVisible: inspectDialogVisible,
            loadHosts: loadHosts,
            onPageChange: onPageChange,
            onPageSizeChange: onPageSizeChange,
            saveHost: saveHost,
            onDelete: onDelete,
            onTest: onTest,
            onInspect: onInspect,
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