import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const router = useRouter();
const step = ref(1);
const loading = ref(false);
const emailFormRef = ref();
const emailForm = ref({ email: '' });
const emailRules = ref({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]
});
const sendResetCode = async () => {
    loading.value = true;
    try {
        // 调用API发送重置验证码
        // await LoginApi.sendResetCode(emailForm.email)
        ElMessage.success('验证码已发送，请查收邮件');
        step.value = 2;
    }
    catch (error) {
        ElMessage.error('发送失败，请检查邮箱地址');
    }
    finally {
        loading.value = false;
    }
};
const goBack = () => {
    router.push('/login');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "forgot-password-container" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "forgot-password-card" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "forgot-password-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
const __VLS_4 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    active: (__VLS_ctx.step),
    finishStatus: "success",
    alignCenter: true,
}));
const __VLS_6 = __VLS_5({
    active: (__VLS_ctx.step),
    finishStatus: "success",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    title: "验证邮箱",
}));
const __VLS_10 = __VLS_9({
    title: "验证邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_12 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    title: "重置密码",
}));
const __VLS_14 = __VLS_13({
    title: "重置密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    title: "完成",
}));
const __VLS_18 = __VLS_17({
    title: "完成",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_7;
if (__VLS_ctx.step === 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "step-content" },
    });
    const __VLS_20 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        model: (__VLS_ctx.emailForm),
        rules: (__VLS_ctx.emailRules),
        ref: "emailFormRef",
    }));
    const __VLS_22 = __VLS_21({
        model: (__VLS_ctx.emailForm),
        rules: (__VLS_ctx.emailRules),
        ref: "emailFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    /** @type {typeof __VLS_ctx.emailFormRef} */ ;
    var __VLS_24 = {};
    __VLS_23.slots.default;
    const __VLS_26 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        prop: "email",
    }));
    const __VLS_28 = __VLS_27({
        prop: "email",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    __VLS_29.slots.default;
    const __VLS_30 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        modelValue: (__VLS_ctx.emailForm.email),
        placeholder: "请输入注册邮箱",
        prefixIcon: "Message",
    }));
    const __VLS_32 = __VLS_31({
        modelValue: (__VLS_ctx.emailForm.email),
        placeholder: "请输入注册邮箱",
        prefixIcon: "Message",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    var __VLS_29;
    const __VLS_34 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_38;
    let __VLS_39;
    let __VLS_40;
    const __VLS_41 = {
        onClick: (__VLS_ctx.sendResetCode)
    };
    __VLS_37.slots.default;
    var __VLS_37;
    var __VLS_23;
}
const __VLS_42 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    ...{ 'onClick': {} },
}));
const __VLS_44 = __VLS_43({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_46;
let __VLS_47;
let __VLS_48;
const __VLS_49 = {
    onClick: (__VLS_ctx.goBack)
};
__VLS_45.slots.default;
var __VLS_45;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['forgot-password-container']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['step-content']} */ ;
// @ts-ignore
var __VLS_25 = __VLS_24;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            step: step,
            loading: loading,
            emailFormRef: emailFormRef,
            emailForm: emailForm,
            emailRules: emailRules,
            sendResetCode: sendResetCode,
            goBack: goBack,
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