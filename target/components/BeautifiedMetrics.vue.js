const { data } = defineProps();
function pct(v) {
    if (v == null || v < 0)
        return 0;
    return Math.min(100, Number(v.toFixed(1)));
}
function loadToPercent(v, cores) {
    if (v == null || v < 0)
        return 0;
    const c = cores && cores > 0 ? cores : 1;
    return Math.min(100, Number(((v / c) * 100).toFixed(1)));
}
function progressStatus(p) {
    if (p >= 85)
        return 'exception';
    if (p >= 70)
        return 'warning';
    return 'success';
}
function statusTagType(health) {
    const h = (health || '').toLowerCase();
    if (h.includes('ok') || h.includes('healthy') || h.includes('normal'))
        return 'success';
    if (h.includes('warn'))
        return 'warning';
    if (h.includes('critical') || h.includes('error'))
        return 'danger';
    return 'info';
}
function formatPct(p) {
    const v = typeof p === 'number' && isFinite(p) ? p : 0;
    return `${v.toFixed(1)}%`;
}
function formatBytes(value) {
    if (typeof value === 'string') {
        const n = Number(value);
        if (!isFinite(n))
            return value;
        value = n;
    }
    if (typeof value !== 'number' || !isFinite(value) || value < 0) {
        return `${value ?? '-'}`;
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let idx = 0;
    let num = value;
    while (num >= 1024 && idx < units.length - 1) {
        num /= 1024;
        idx++;
    }
    const fixed = num >= 100 ? 0 : 1;
    return `${num.toFixed(fixed)} ${units[idx]}`;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress--text-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress-bar__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress--text-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress--text-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress-bar__innerText']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress--text-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress-bar__innerText']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress--text-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['el-progress-bar__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-pane']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "metrics-view" },
});
const __VLS_0 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    column: (3),
    border: true,
    ...{ class: "block" },
}));
const __VLS_2 = __VLS_1({
    column: (3),
    border: true,
    ...{ class: "block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "状态",
}));
const __VLS_6 = __VLS_5({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    type: (__VLS_ctx.statusTagType(data?.summary?.health)),
}));
const __VLS_10 = __VLS_9({
    type: (__VLS_ctx.statusTagType(data?.summary?.health)),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
(data?.summary?.health || data?.status);
var __VLS_11;
var __VLS_7;
const __VLS_12 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "主机名",
}));
const __VLS_14 = __VLS_13({
    label: "主机名",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
(data?.hostname);
var __VLS_15;
const __VLS_16 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "时间戳",
}));
const __VLS_18 = __VLS_17({
    label: "时间戳",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
(data?.timestamp);
var __VLS_19;
var __VLS_3;
const __VLS_20 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "block" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "系统",
}));
const __VLS_26 = __VLS_25({
    label: "系统",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    column: (3),
    border: true,
}));
const __VLS_30 = __VLS_29({
    column: (3),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "OS",
}));
const __VLS_34 = __VLS_33({
    label: "OS",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
(data?.system?.os);
var __VLS_35;
const __VLS_36 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "内核",
}));
const __VLS_38 = __VLS_37({
    label: "内核",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
(data?.system?.kernel);
var __VLS_39;
const __VLS_40 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "架构",
}));
const __VLS_42 = __VLS_41({
    label: "架构",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
(data?.system?.architecture);
var __VLS_43;
const __VLS_44 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "Uptime",
}));
const __VLS_46 = __VLS_45({
    label: "Uptime",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
(data?.system?.uptime);
var __VLS_47;
const __VLS_48 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "登录用户数",
}));
const __VLS_50 = __VLS_49({
    label: "登录用户数",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
(data?.system?.users);
var __VLS_51;
var __VLS_31;
if ((data?.summary?.alerts || []).length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "alerts" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    for (const [a, i] of __VLS_getVForSourceType((data.summary.alerts))) {
        const __VLS_52 = {}.ElAlert;
        /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            key: (i),
            title: (a),
            type: "warning",
            showIcon: true,
            ...{ class: "mb8" },
        }));
        const __VLS_54 = __VLS_53({
            key: (i),
            title: (a),
            type: "warning",
            showIcon: true,
            ...{ class: "mb8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    }
}
if ((data?.summary?.recommendations || []).length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "reco" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    for (const [r, i] of __VLS_getVForSourceType((data.summary.recommendations))) {
        const __VLS_56 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            key: (i),
            type: "success",
            ...{ class: "mr8 mb8" },
        }));
        const __VLS_58 = __VLS_57({
            key: (i),
            type: "success",
            ...{ class: "mr8 mb8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        __VLS_59.slots.default;
        (r);
        var __VLS_59;
    }
}
var __VLS_27;
const __VLS_60 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "CPU",
}));
const __VLS_62 = __VLS_61({
    label: "CPU",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    column: (3),
    border: true,
}));
const __VLS_66 = __VLS_65({
    column: (3),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "型号",
}));
const __VLS_70 = __VLS_69({
    label: "型号",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
(data?.cpu?.model);
var __VLS_71;
const __VLS_72 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "核心",
}));
const __VLS_74 = __VLS_73({
    label: "核心",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
(data?.cpu?.cores);
var __VLS_75;
const __VLS_76 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "线程",
}));
const __VLS_78 = __VLS_77({
    label: "线程",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
(data?.cpu?.threads);
var __VLS_79;
const __VLS_80 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "频率",
}));
const __VLS_82 = __VLS_81({
    label: "频率",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
(data?.cpu?.frequency);
var __VLS_83;
const __VLS_84 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "缓存",
}));
const __VLS_86 = __VLS_85({
    label: "缓存",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
(data?.cpu?.cache);
var __VLS_87;
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-row-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_88 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    percentage: (__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['1min'], data?.cpu?.cores)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['1min'], data?.cpu?.cores))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_90 = __VLS_89({
    percentage: (__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['1min'], data?.cpu?.cores)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['1min'], data?.cpu?.cores))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_92 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    percentage: (__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['5min'], data?.cpu?.cores)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['5min'], data?.cpu?.cores))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_94 = __VLS_93({
    percentage: (__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['5min'], data?.cpu?.cores)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['5min'], data?.cpu?.cores))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_96 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    percentage: (__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['15min'], data?.cpu?.cores)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['15min'], data?.cpu?.cores))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_98 = __VLS_97({
    percentage: (__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['15min'], data?.cpu?.cores)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.loadToPercent(data?.cpu?.load_average?.['15min'], data?.cpu?.cores))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-row-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_100 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.user)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.cpu?.usage?.user))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_102 = __VLS_101({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.user)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.cpu?.usage?.user))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_104 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.system)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.cpu?.usage?.system))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_106 = __VLS_105({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.system)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.cpu?.usage?.system))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_108 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.idle)),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_110 = __VLS_109({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.idle)),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_112 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.wait)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.cpu?.usage?.wait))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_114 = __VLS_113({
    percentage: (__VLS_ctx.pct(data?.cpu?.usage?.wait)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.cpu?.usage?.wait))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
var __VLS_63;
const __VLS_116 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "内存",
}));
const __VLS_118 = __VLS_117({
    label: "内存",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    column: (3),
    border: true,
}));
const __VLS_122 = __VLS_121({
    column: (3),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "总内存",
}));
const __VLS_126 = __VLS_125({
    label: "总内存",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
(__VLS_ctx.formatBytes(data?.memory?.total));
var __VLS_127;
const __VLS_128 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "已用",
}));
const __VLS_130 = __VLS_129({
    label: "已用",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
(__VLS_ctx.formatBytes(data?.memory?.used));
var __VLS_131;
const __VLS_132 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "可用",
}));
const __VLS_134 = __VLS_133({
    label: "可用",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
(__VLS_ctx.formatBytes(data?.memory?.available));
var __VLS_135;
const __VLS_136 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "使用率",
}));
const __VLS_138 = __VLS_137({
    label: "使用率",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    percentage: (__VLS_ctx.pct(data?.memory?.usage_percent)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.memory?.usage_percent))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}));
const __VLS_142 = __VLS_141({
    percentage: (__VLS_ctx.pct(data?.memory?.usage_percent)),
    status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(data?.memory?.usage_percent))),
    textInside: (true),
    showText: (true),
    strokeWidth: (12),
    format: (__VLS_ctx.formatPct),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
var __VLS_139;
const __VLS_144 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "Swap 总",
}));
const __VLS_146 = __VLS_145({
    label: "Swap 总",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
(__VLS_ctx.formatBytes(data?.memory?.swap_total));
var __VLS_147;
const __VLS_148 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "Swap 已用",
}));
const __VLS_150 = __VLS_149({
    label: "Swap 已用",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
(__VLS_ctx.formatBytes(data?.memory?.swap_used));
var __VLS_151;
const __VLS_152 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "Swap 空闲",
}));
const __VLS_154 = __VLS_153({
    label: "Swap 空闲",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
(__VLS_ctx.formatBytes(data?.memory?.swap_free));
var __VLS_155;
var __VLS_123;
var __VLS_119;
const __VLS_156 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "磁盘",
}));
const __VLS_158 = __VLS_157({
    label: "磁盘",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scroll-pane" },
});
const __VLS_160 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    data: (data?.disk || []),
    border: true,
    stripe: true,
    ...{ style: {} },
}));
const __VLS_162 = __VLS_161({
    data: (data?.disk || []),
    border: true,
    stripe: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    prop: "filesystem",
    label: "文件系统",
    minWidth: "160",
}));
const __VLS_166 = __VLS_165({
    prop: "filesystem",
    label: "文件系统",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_168 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    prop: "mounted_on",
    label: "挂载点",
    minWidth: "160",
}));
const __VLS_170 = __VLS_169({
    prop: "mounted_on",
    label: "挂载点",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const __VLS_172 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    prop: "size",
    label: "容量",
    minWidth: "120",
}));
const __VLS_174 = __VLS_173({
    prop: "size",
    label: "容量",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    prop: "used",
    label: "已用",
    minWidth: "120",
}));
const __VLS_178 = __VLS_177({
    prop: "used",
    label: "已用",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    prop: "available",
    label: "可用",
    minWidth: "120",
}));
const __VLS_182 = __VLS_181({
    prop: "available",
    label: "可用",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "使用率",
    minWidth: "200",
}));
const __VLS_186 = __VLS_185({
    label: "使用率",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_187.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_188 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        percentage: (__VLS_ctx.pct(row.usage_percent)),
        status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(row.usage_percent))),
        textInside: (true),
        showText: (true),
        strokeWidth: (12),
        format: (__VLS_ctx.formatPct),
    }));
    const __VLS_190 = __VLS_189({
        percentage: (__VLS_ctx.pct(row.usage_percent)),
        status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(row.usage_percent))),
        textInside: (true),
        showText: (true),
        strokeWidth: (12),
        format: (__VLS_ctx.formatPct),
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
}
var __VLS_187;
var __VLS_163;
var __VLS_159;
const __VLS_192 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "网络",
}));
const __VLS_194 = __VLS_193({
    label: "网络",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scroll-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_196 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    column: (3),
    border: true,
}));
const __VLS_198 = __VLS_197({
    column: (3),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "总连接",
}));
const __VLS_202 = __VLS_201({
    label: "总连接",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
(data?.network?.connections?.total);
var __VLS_203;
const __VLS_204 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "监听",
}));
const __VLS_206 = __VLS_205({
    label: "监听",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
(data?.network?.connections?.listening);
var __VLS_207;
const __VLS_208 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "已建立",
}));
const __VLS_210 = __VLS_209({
    label: "已建立",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
(data?.network?.connections?.established);
var __VLS_211;
var __VLS_199;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_212 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    data: (data?.network?.interfaces || []),
    border: true,
    stripe: true,
}));
const __VLS_214 = __VLS_213({
    data: (data?.network?.interfaces || []),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    prop: "name",
    label: "名称",
    minWidth: "140",
}));
const __VLS_218 = __VLS_217({
    prop: "name",
    label: "名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "IPv4",
    minWidth: "200",
}));
const __VLS_222 = __VLS_221({
    label: "IPv4",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_223.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [ip, i] of __VLS_getVForSourceType((row.ipv4 || []))) {
        const __VLS_224 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
            key: (i),
            ...{ class: "mr8" },
        }));
        const __VLS_226 = __VLS_225({
            key: (i),
            ...{ class: "mr8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_225));
        __VLS_227.slots.default;
        (ip);
        var __VLS_227;
    }
}
var __VLS_223;
const __VLS_228 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "IPv6",
    minWidth: "200",
}));
const __VLS_230 = __VLS_229({
    label: "IPv6",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_231.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [ip, i] of __VLS_getVForSourceType((row.ipv6 || []))) {
        const __VLS_232 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
            key: (i),
            ...{ class: "mr8" },
        }));
        const __VLS_234 = __VLS_233({
            key: (i),
            ...{ class: "mr8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        __VLS_235.slots.default;
        (ip);
        var __VLS_235;
    }
}
var __VLS_231;
const __VLS_236 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    prop: "type",
    label: "类型",
    minWidth: "100",
}));
const __VLS_238 = __VLS_237({
    prop: "type",
    label: "类型",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
var __VLS_215;
var __VLS_195;
const __VLS_240 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "进程",
}));
const __VLS_242 = __VLS_241({
    label: "进程",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scroll-pane" },
});
const __VLS_244 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    column: (5),
    border: true,
}));
const __VLS_246 = __VLS_245({
    column: (5),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "总数",
}));
const __VLS_250 = __VLS_249({
    label: "总数",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
(data?.processes?.total);
var __VLS_251;
const __VLS_252 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    label: "运行",
}));
const __VLS_254 = __VLS_253({
    label: "运行",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
(data?.processes?.running);
var __VLS_255;
const __VLS_256 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    label: "睡眠",
}));
const __VLS_258 = __VLS_257({
    label: "睡眠",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
(data?.processes?.sleeping);
var __VLS_259;
const __VLS_260 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    label: "停止",
}));
const __VLS_262 = __VLS_261({
    label: "停止",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
(data?.processes?.stopped);
var __VLS_263;
const __VLS_264 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    label: "僵尸",
}));
const __VLS_266 = __VLS_265({
    label: "僵尸",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
(data?.processes?.zombie);
var __VLS_267;
var __VLS_247;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_268 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    data: (data?.processes?.top_processes || []),
    border: true,
    stripe: true,
}));
const __VLS_270 = __VLS_269({
    data: (data?.processes?.top_processes || []),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
const __VLS_272 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    prop: "pid",
    label: "PID",
    width: "90",
}));
const __VLS_274 = __VLS_273({
    prop: "pid",
    label: "PID",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
const __VLS_276 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    prop: "name",
    label: "名称",
    minWidth: "160",
}));
const __VLS_278 = __VLS_277({
    prop: "name",
    label: "名称",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
const __VLS_280 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    prop: "user",
    label: "用户",
    minWidth: "140",
}));
const __VLS_282 = __VLS_281({
    prop: "user",
    label: "用户",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
const __VLS_284 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    label: "CPU%",
    width: "140",
}));
const __VLS_286 = __VLS_285({
    label: "CPU%",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_287.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_288 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        percentage: (__VLS_ctx.pct(row.cpu_percent)),
        status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(row.cpu_percent))),
        textInside: (true),
        showText: (true),
        strokeWidth: (12),
        format: (__VLS_ctx.formatPct),
    }));
    const __VLS_290 = __VLS_289({
        percentage: (__VLS_ctx.pct(row.cpu_percent)),
        status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(row.cpu_percent))),
        textInside: (true),
        showText: (true),
        strokeWidth: (12),
        format: (__VLS_ctx.formatPct),
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
}
var __VLS_287;
const __VLS_292 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    label: "内存%",
    width: "140",
}));
const __VLS_294 = __VLS_293({
    label: "内存%",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_295.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_296 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
        percentage: (__VLS_ctx.pct(row.memory_percent)),
        status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(row.memory_percent))),
        textInside: (true),
        showText: (true),
        strokeWidth: (12),
        format: (__VLS_ctx.formatPct),
    }));
    const __VLS_298 = __VLS_297({
        percentage: (__VLS_ctx.pct(row.memory_percent)),
        status: (__VLS_ctx.progressStatus(__VLS_ctx.pct(row.memory_percent))),
        textInside: (true),
        showText: (true),
        strokeWidth: (12),
        format: (__VLS_ctx.formatPct),
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
}
var __VLS_295;
const __VLS_300 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    prop: "memory_usage",
    label: "内存占用",
    minWidth: "140",
}));
const __VLS_302 = __VLS_301({
    prop: "memory_usage",
    label: "内存占用",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
const __VLS_304 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    prop: "state",
    label: "状态",
    width: "110",
}));
const __VLS_306 = __VLS_305({
    prop: "state",
    label: "状态",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
var __VLS_271;
var __VLS_243;
var __VLS_23;
/** @type {__VLS_StyleScopedClasses['metrics-view']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['alerts']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb8']} */ ;
/** @type {__VLS_StyleScopedClasses['reco']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mr8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb8']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-row-3']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-row-2']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-item']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mr8']} */ ;
/** @type {__VLS_StyleScopedClasses['mr8']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            pct: pct,
            loadToPercent: loadToPercent,
            progressStatus: progressStatus,
            statusTagType: statusTagType,
            formatPct: formatPct,
            formatBytes: formatBytes,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BeautifiedMetrics.vue.js.map