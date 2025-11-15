import { cloneDeep } from 'lodash-es';
import { IconJson } from '@/components/Icon/src/data';
defineOptions({ name: 'IconSelect' });
const props = defineProps({
    modelValue: {
        require: false,
        type: String
    },
    clearable: {
        require: false,
        type: Boolean
    }
});
const emit = defineEmits();
const visible = ref(false);
const inputValue = toRef(props, 'modelValue');
const iconList = ref(IconJson);
const icon = ref('add-location');
const currentActiveType = ref('ep:');
// 深拷贝图标数据，前端做搜索
const copyIconList = cloneDeep(iconList.value);
const pageSize = ref(96);
const currentPage = ref(1);
// 搜索条件
const filterValue = ref('');
const tabsList = [
    {
        label: 'Element Plus',
        name: 'ep:'
    },
    {
        label: 'Font Awesome 4',
        name: 'fa:'
    },
    {
        label: 'Font Awesome 5 Solid',
        name: 'fa-solid:'
    }
];
const pageList = computed(() => {
    if (currentPage.value === 1) {
        return copyIconList[currentActiveType.value]
            ?.filter((v) => v.includes(filterValue.value))
            .slice(currentPage.value - 1, pageSize.value);
    }
    else {
        return copyIconList[currentActiveType.value]
            ?.filter((v) => v.includes(filterValue.value))
            .slice(pageSize.value * (currentPage.value - 1), pageSize.value * (currentPage.value - 1) + pageSize.value);
    }
});
const iconCount = computed(() => {
    return copyIconList[currentActiveType.value] == undefined
        ? 0
        : copyIconList[currentActiveType.value].length;
});
const iconItemStyle = computed(() => {
    return (item) => {
        if (inputValue.value === currentActiveType.value + item) {
            return {
                borderColor: 'var(--el-color-primary)',
                color: 'var(--el-color-primary)'
            };
        }
    };
});
function handleClick({ props }) {
    currentPage.value = 1;
    currentActiveType.value = props.name;
    emit('update:modelValue', currentActiveType.value + iconList.value[currentActiveType.value][0]);
    icon.value = iconList.value[currentActiveType.value][0];
}
function onChangeIcon(item) {
    icon.value = item;
    emit('update:modelValue', currentActiveType.value + item);
    visible.value = false;
}
function onCurrentChange(page) {
    currentPage.value = page;
}
function clearIcon() {
    icon.value = '';
    emit('update:modelValue', '');
    visible.value = false;
}
watch(() => {
    return props.modelValue;
}, () => {
    if (props.modelValue && props.modelValue.indexOf(':') >= 0) {
        currentActiveType.value = props.modelValue.substring(0, props.modelValue.indexOf(':') + 1);
        icon.value = props.modelValue.substring(props.modelValue.indexOf(':') + 1);
    }
});
watch(() => {
    return filterValue.value;
}, () => {
    currentPage.value = 1;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-divider--horizontal']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "selector" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.ElInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.inputValue),
    clearable: (props.clearable),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.inputValue),
    clearable: (props.clearable),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (...[$event]) => {
        __VLS_ctx.visible = !__VLS_ctx.visible;
    }
};
const __VLS_8 = {
    onClear: (__VLS_ctx.clearIcon)
};
__VLS_3.slots.default;
{
    const { append: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_9 = {}.ElPopover;
    /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.ElPopover, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        popperOptions: ({
            placement: 'auto'
        }),
        visible: (__VLS_ctx.visible),
        width: (355),
        popperClass: "pure-popper",
        trigger: "click",
    }));
    const __VLS_11 = __VLS_10({
        popperOptions: ({
            placement: 'auto'
        }),
        visible: (__VLS_ctx.visible),
        width: (355),
        popperClass: "pure-popper",
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_12.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.visible = !__VLS_ctx.visible;
                } },
            ...{ class: "h-32px w-40px flex cursor-pointer items-center justify-center" },
        });
        const __VLS_13 = {}.Icon;
        /** @type {[typeof __VLS_components.Icon, ]} */ ;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
            icon: (__VLS_ctx.currentActiveType + __VLS_ctx.icon),
        }));
        const __VLS_15 = __VLS_14({
            icon: (__VLS_ctx.currentActiveType + __VLS_ctx.icon),
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    }
    const __VLS_17 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        modelValue: (__VLS_ctx.filterValue),
        ...{ class: "p-2" },
        clearable: true,
        placeholder: "搜索图标",
    }));
    const __VLS_19 = __VLS_18({
        modelValue: (__VLS_ctx.filterValue),
        ...{ class: "p-2" },
        clearable: true,
        placeholder: "搜索图标",
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    const __VLS_21 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        borderStyle: "dashed",
    }));
    const __VLS_23 = __VLS_22({
        borderStyle: "dashed",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const __VLS_25 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.ElTabs, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onTabClick': {} },
        modelValue: (__VLS_ctx.currentActiveType),
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onTabClick': {} },
        modelValue: (__VLS_ctx.currentActiveType),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_29;
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = {
        onTabClick: (__VLS_ctx.handleClick)
    };
    __VLS_28.slots.default;
    for (const [pane, index] of __VLS_getVForSourceType((__VLS_ctx.tabsList))) {
        const __VLS_33 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.ElTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
            key: (index),
            label: (pane.label),
            name: (pane.name),
        }));
        const __VLS_35 = __VLS_34({
            key: (index),
            label: (pane.label),
            name: (pane.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        __VLS_36.slots.default;
        const __VLS_37 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
            borderStyle: "dashed",
            ...{ class: "tab-divider" },
        }));
        const __VLS_39 = __VLS_38({
            borderStyle: "dashed",
            ...{ class: "tab-divider" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        const __VLS_41 = {}.ElScrollbar;
        /** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.ElScrollbar, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            height: "220px",
        }));
        const __VLS_43 = __VLS_42({
            height: "220px",
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_44.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: "ml-2 flex flex-wrap" },
        });
        for (const [item, key] of __VLS_getVForSourceType((__VLS_ctx.pageList))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                ...{ onClick: (...[$event]) => {
                        __VLS_ctx.onChangeIcon(item);
                    } },
                key: (key),
                ...{ style: (__VLS_ctx.iconItemStyle(item)) },
                title: (item),
                ...{ class: "icon-item mr-2 mt-1 w-1/10 flex cursor-pointer items-center justify-center border border-solid p-2" },
            });
            const __VLS_45 = {}.Icon;
            /** @type {[typeof __VLS_components.Icon, ]} */ ;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
                icon: (__VLS_ctx.currentActiveType + item),
            }));
            const __VLS_47 = __VLS_46({
                icon: (__VLS_ctx.currentActiveType + item),
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        }
        var __VLS_44;
        var __VLS_36;
    }
    var __VLS_28;
    const __VLS_49 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        borderStyle: "dashed",
    }));
    const __VLS_51 = __VLS_50({
        borderStyle: "dashed",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const __VLS_53 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.iconCount),
        background: true,
        ...{ class: "h-10 flex items-center justify-center" },
        layout: "prev, pager, next",
        size: "small",
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.iconCount),
        background: true,
        ...{ class: "h-10 flex items-center justify-center" },
        layout: "prev, pager, next",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    let __VLS_59;
    const __VLS_60 = {
        onCurrentChange: (__VLS_ctx.onCurrentChange)
    };
    var __VLS_56;
    var __VLS_12;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['selector']} */ ;
/** @type {__VLS_StyleScopedClasses['h-32px']} */ ;
/** @type {__VLS_StyleScopedClasses['w-40px']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-item']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-1/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            inputValue: inputValue,
            icon: icon,
            currentActiveType: currentActiveType,
            pageSize: pageSize,
            currentPage: currentPage,
            filterValue: filterValue,
            tabsList: tabsList,
            pageList: pageList,
            iconCount: iconCount,
            iconItemStyle: iconItemStyle,
            handleClick: handleClick,
            onChangeIcon: onChangeIcon,
            onCurrentChange: onCurrentChange,
            clearIcon: clearIcon,
        };
    },
    __typeEmits: {},
    props: {
        modelValue: {
            require: false,
            type: String
        },
        clearable: {
            require: false,
            type: Boolean
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    props: {
        modelValue: {
            require: false,
            type: String
        },
        clearable: {
            require: false,
            type: Boolean
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=IconSelect.vue.js.map