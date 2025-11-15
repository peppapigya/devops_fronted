import { AssistProjectApi } from "@/api/item";
import { ref } from "vue";
import { ElNotification } from "element-plus";
import { useConfirm } from "@/components/useConfirm.ts";
const fileUploadUrl = ref('http://localhost:8080/file/upload');
const pageParamsForm = ref({
    pageNum: 1,
    pageSize: 10,
    name: ''
});
const tableData = ref({
    pageNum: undefined,
    pageSize: undefined,
    total: undefined,
    rows: []
});
const formData = ref({
    id: undefined,
    name: '',
    budget: '',
    state: undefined,
    implementationPlan: '',
    userId: ''
});
const fileList = ref([]);
const user = ref();
// 获取分页列表事件
const getPageList = async () => {
    const res = await AssistProjectApi.getPageList(pageParamsForm.value);
    tableData.value.rows = res.data;
    tableData.value.pageNum = res.pageNum;
    tableData.value.total = res.total;
    tableData.value.pageSize = res.pageSize;
    console.log(res.data);
};
// 上传文件回调接口
const handleUploadSuccess = (response, file, fileList) => {
    formData.value.implementationPlan = response.data.url;
    console.log(response.data.url);
    ElNotification.success({ message: "上传成功" });
};
// 移除文件
const handleRemove = (uploadFile, uploadFiles) => {
    formData.value.implementationPlan = '';
    console.log("移除文件成功{}", formData.value.implementationPlan);
};
const formRules = ref({
    id: [{ required: false }],
    name: [{ required: true, message: "项目名称不能为空" }],
    budget: [{ required: true, message: "项目预算不能为空" }],
    implementationPlan: [{ required: true, message: "实施方案不能为空" }]
});
// 新增/修改项目
const submitForm = async () => {
    formData.value.userId = user.value?.userId;
    if (formType.value == 'create') {
        const res = await AssistProjectApi.addAssistProject(formData.value);
        console.log(res);
        ElNotification.success({ message: "新增成功" });
    }
    if (formType.value == 'update') {
        await AssistProjectApi.updateAssistProject(formData.value);
        ElNotification.success({ message: "修改成功" });
    }
    formLoading.value = true;
    dialogFormVisible.value = false;
    await getPageList();
};
// 打开弹窗
const openDialog = async (type, id) => {
    formType.value = type;
    resetForm();
    fileList.value = [];
    title.value = "新增项目";
    if (type == 'update' && id) {
        formLoading.value = true;
        try {
            formData.value = await AssistProjectApi.getAssistProjectDetail(id);
            if (formData.value.implementationPlan) {
                fileList.value = [{
                        name: formData.value.implementationPlan.split('/').pop() || '实施方案文件',
                        response: { url: formData.value.implementationPlan },
                        status: 'success',
                        uid: Date.now(),
                        percentage: 100
                    }];
            }
            title.value = "修改项目";
        }
        finally {
            formLoading.value = false;
        }
    }
    dialogFormVisible.value = true;
};
// 删除项目
const deleteProject = async (id) => {
    // 二次确认对话框
    const { confirm } = useConfirm();
    try {
        const userConfirmed = await confirm('确定要删除这个项目吗？删除后不可恢复！', '删除确认');
        if (userConfirmed) {
            await AssistProjectApi.deleteAssistProject(id);
            ElNotification.success({ message: "删除成功" });
            await getPageList();
        }
    }
    catch (error) {
        ElNotification.error({
            title: '错误',
            message: '删除项目失败',
            duration: 3000
        });
    }
};
// 获取用户信息
const getUser = () => {
    user.value = JSON.parse(sessionStorage.getItem('user') || '{}');
};
// 重置表单
const resetForm = () => {
    formData.value = {
        id: undefined,
        name: undefined,
        budget: undefined,
        state: undefined,
        implementationPlan: undefined
    };
};
// 一页中的数据量改变事件
const handleSizeChange = (val) => {
    pageParamsForm.value.pageSize = val;
    getPageList();
};
// 修改页码
const handleCurrentChange = (val) => {
    pageParamsForm.value.pageNum = val;
    getPageList();
};
// 对话框
const dialogFormVisible = ref(false);
const formLoading = ref(false);
const title = ref("新增申报项目");
const formType = ref('');
getPageList();
getUser();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    inline: (true),
    model: (__VLS_ctx.pageParamsForm),
}));
const __VLS_2 = __VLS_1({
    inline: (true),
    model: (__VLS_ctx.pageParamsForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "项目名称:",
}));
const __VLS_6 = __VLS_5({
    label: "项目名称:",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    placeholder: "请输入项目名称",
    modelValue: (__VLS_ctx.pageParamsForm.name),
}));
const __VLS_10 = __VLS_9({
    placeholder: "请输入项目名称",
    modelValue: (__VLS_ctx.pageParamsForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
const __VLS_12 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "primary",
    size: "default",
    plain: true,
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    size: "default",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (__VLS_ctx.getPageList)
};
__VLS_19.slots.default;
var __VLS_19;
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "primary",
    size: "default",
    plain: true,
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "primary",
    size: "default",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (...[$event]) => {
        __VLS_ctx.openDialog('create');
    }
};
__VLS_27.slots.default;
var __VLS_27;
var __VLS_15;
const __VLS_32 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    data: (__VLS_ctx.tableData.rows),
    border: true,
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    data: (__VLS_ctx.tableData.rows),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    type: "index",
    label: "序号",
    width: "50",
}));
const __VLS_38 = __VLS_37({
    type: "index",
    label: "序号",
    width: "50",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "name",
    label: "项目名称",
    width: "180",
}));
const __VLS_42 = __VLS_41({
    prop: "name",
    label: "项目名称",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "budget",
    label: "项目预算",
    width: "180",
}));
const __VLS_46 = __VLS_45({
    prop: "budget",
    label: "项目预算",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "状态",
    width: "120",
}));
const __VLS_50 = __VLS_49({
    label: "状态",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        type: "info",
    }));
    const __VLS_54 = __VLS_53({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (row.state == 0) }, null, null);
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_56 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        type: "primary",
    }));
    const __VLS_58 = __VLS_57({
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (row.state == 1) }, null, null);
    __VLS_59.slots.default;
    var __VLS_59;
    const __VLS_60 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        type: "warning",
    }));
    const __VLS_62 = __VLS_61({
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (row.state == 2) }, null, null);
    __VLS_63.slots.default;
    var __VLS_63;
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        type: "success",
    }));
    const __VLS_66 = __VLS_65({
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (row.state == 3) }, null, null);
    __VLS_67.slots.default;
    var __VLS_67;
    const __VLS_68 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        type: "danger",
    }));
    const __VLS_70 = __VLS_69({
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (row.state == 4) }, null, null);
    __VLS_71.slots.default;
    var __VLS_71;
}
var __VLS_51;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "implementationPlan",
    label: "实施方案",
    width: "180",
}));
const __VLS_74 = __VLS_73({
    prop: "implementationPlan",
    label: "实施方案",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "createTime",
    label: "创建时间",
    width: "180",
}));
const __VLS_78 = __VLS_77({
    prop: "createTime",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "createBy",
    label: "申请人",
    width: "80",
}));
const __VLS_82 = __VLS_81({
    prop: "createBy",
    label: "申请人",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    fixed: "right",
    label: "操作",
    minWidth: "120",
}));
const __VLS_86 = __VLS_85({
    fixed: "right",
    label: "操作",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row) {
        const __VLS_88 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            type: "primary",
            link: true,
            size: "small",
        }));
        const __VLS_90 = __VLS_89({
            type: "primary",
            link: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        __VLS_91.slots.default;
        var __VLS_91;
    }
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
        size: "small",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDialog('update', row.id);
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
        size: "small",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.deleteProject(row.id);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
var __VLS_87;
var __VLS_35;
var __VLS_3;
const __VLS_108 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.tableData.pageNum),
    pageSize: (__VLS_ctx.tableData.pageSize),
    pageSizes: ([1, 5, 10, 20]),
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.tableData.total),
}));
const __VLS_110 = __VLS_109({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.tableData.pageNum),
    pageSize: (__VLS_ctx.tableData.pageSize),
    pageSizes: ([1, 5, 10, 20]),
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.tableData.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_112;
let __VLS_113;
let __VLS_114;
const __VLS_115 = {
    onSizeChange: (__VLS_ctx.handleSizeChange)
};
const __VLS_116 = {
    onCurrentChange: (__VLS_ctx.handleCurrentChange)
};
var __VLS_111;
const __VLS_117 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    modelValue: (__VLS_ctx.dialogFormVisible),
    title: (__VLS_ctx.title),
    width: "500",
}));
const __VLS_119 = __VLS_118({
    modelValue: (__VLS_ctx.dialogFormVisible),
    title: (__VLS_ctx.title),
    width: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
const __VLS_121 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}));
const __VLS_123 = __VLS_122({
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
const __VLS_125 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    prop: "name",
    label: "项目名称",
}));
const __VLS_127 = __VLS_126({
    prop: "name",
    label: "项目名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "请输入项目名称",
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "请输入项目名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
var __VLS_128;
const __VLS_133 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    prop: "budget",
    label: "项目预算",
}));
const __VLS_135 = __VLS_134({
    prop: "budget",
    label: "项目预算",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
const __VLS_137 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    modelValue: (__VLS_ctx.formData.budget),
    placeholder: "请输入项目预算",
}));
const __VLS_139 = __VLS_138({
    modelValue: (__VLS_ctx.formData.budget),
    placeholder: "请输入项目预算",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
var __VLS_136;
const __VLS_141 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    prop: "implementationPlan",
    label: "实施方案",
}));
const __VLS_143 = __VLS_142({
    prop: "implementationPlan",
    label: "实施方案",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
const __VLS_145 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    fileList: (__VLS_ctx.fileList),
    ...{ class: "upload-demo" },
    action: "http://localhost:8080/api/v1/file/upload",
    multiple: true,
    limit: (1),
    onRemove: (__VLS_ctx.handleRemove),
    onSuccess: (__VLS_ctx.handleUploadSuccess),
}));
const __VLS_147 = __VLS_146({
    fileList: (__VLS_ctx.fileList),
    ...{ class: "upload-demo" },
    action: "http://localhost:8080/api/v1/file/upload",
    multiple: true,
    limit: (1),
    onRemove: (__VLS_ctx.handleRemove),
    onSuccess: (__VLS_ctx.handleUploadSuccess),
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
const __VLS_149 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_151 = __VLS_150({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
let __VLS_153;
let __VLS_154;
let __VLS_155;
const __VLS_156 = {
    onClick: (__VLS_ctx.)
};
__VLS_152.slots.default;
var __VLS_152;
{
    const { tip: __VLS_thisSlot } = __VLS_148.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "el-upload__tip" },
    });
}
var __VLS_148;
var __VLS_144;
var __VLS_124;
{
    const { footer: __VLS_thisSlot } = __VLS_120.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_157 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        ...{ 'onClick': {} },
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_161;
    let __VLS_162;
    let __VLS_163;
    const __VLS_164 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogFormVisible = false;
        }
    };
    __VLS_160.slots.default;
    var __VLS_160;
    const __VLS_165 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.formLoading),
    }));
    const __VLS_167 = __VLS_166({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.formLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    let __VLS_169;
    let __VLS_170;
    let __VLS_171;
    const __VLS_172 = {
        onClick: (__VLS_ctx.submitForm)
    };
    __VLS_168.slots.default;
    var __VLS_168;
}
var __VLS_120;
/** @type {__VLS_StyleScopedClasses['upload-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            pageParamsForm: pageParamsForm,
            tableData: tableData,
            formData: formData,
            fileList: fileList,
            getPageList: getPageList,
            handleUploadSuccess: handleUploadSuccess,
            handleRemove: handleRemove,
            formRules: formRules,
            submitForm: submitForm,
            openDialog: openDialog,
            deleteProject: deleteProject,
            handleSizeChange: handleSizeChange,
            handleCurrentChange: handleCurrentChange,
            dialogFormVisible: dialogFormVisible,
            formLoading: formLoading,
            title: title,
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