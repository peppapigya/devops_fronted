import { propTypes } from '@/utils/propTypes';
import Iconify from '@purge-icons/generated';
import { useDesign } from '@/utils/useDesign';
defineOptions({ name: 'Icon' });
const { getPrefixCls } = useDesign();
const prefixCls = getPrefixCls('icon');
const props = defineProps({
    // icon name
    icon: propTypes.string,
    // icon color
    color: propTypes.string,
    // icon size
    size: propTypes.number.def(16),
    // icon svg class
    svgClass: propTypes.string.def('')
});
const elRef = ref(null);
const isLocal = computed(() => props.icon?.startsWith('svg-icon:'));
const symbolId = computed(() => {
    return unref(isLocal) ? `#icon-${props.icon.split('svg-icon:')[1]}` : props.icon;
});
const getIconifyStyle = computed(() => {
    const { color, size } = props;
    return {
        fontSize: `${size}px`,
        height: '1em',
        color
    };
});
const getSvgClass = computed(() => {
    const { svgClass } = props;
    return `iconify ${svgClass}`;
});
const updateIcon = async (icon) => {
    if (unref(isLocal))
        return;
    const el = unref(elRef);
    if (!el)
        return;
    await nextTick();
    if (!icon)
        return;
    const svg = Iconify.renderSVG(icon, {});
    if (svg) {
        el.textContent = '';
        el.appendChild(svg);
    }
    else {
        const span = document.createElement('span');
        span.className = 'iconify';
        span.dataset.icon = icon;
        el.textContent = '';
        el.appendChild(span);
    }
};
watch(() => props.icon, (icon) => {
    updateIcon(icon);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.ElIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: (__VLS_ctx.prefixCls) },
    color: (__VLS_ctx.color),
    size: (__VLS_ctx.size),
}));
const __VLS_2 = __VLS_1({
    ...{ class: (__VLS_ctx.prefixCls) },
    color: (__VLS_ctx.color),
    size: (__VLS_ctx.size),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
if (__VLS_ctx.isLocal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: (__VLS_ctx.getSvgClass) },
        'aria-hidden': "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.use)({
        'xlink:href': (__VLS_ctx.symbolId),
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ref: "elRef",
        ...{ class: (__VLS_ctx.$attrs.class) },
        ...{ style: (__VLS_ctx.getIconifyStyle) },
    });
    /** @type {typeof __VLS_ctx.elRef} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (__VLS_ctx.getSvgClass) },
        'data-icon': (__VLS_ctx.symbolId),
    });
}
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            prefixCls: prefixCls,
            elRef: elRef,
            isLocal: isLocal,
            symbolId: symbolId,
            getIconifyStyle: getIconifyStyle,
            getSvgClass: getSvgClass,
        };
    },
    props: {
        // icon name
        icon: propTypes.string,
        // icon color
        color: propTypes.string,
        // icon size
        size: propTypes.number.def(16),
        // icon svg class
        svgClass: propTypes.string.def('')
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        // icon name
        icon: propTypes.string,
        // icon color
        color: propTypes.string,
        // icon size
        size: propTypes.number.def(16),
        // icon svg class
        svgClass: propTypes.string.def('')
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Icon.vue.js.map