import { ElMessageBox } from 'element-plus'

export function useConfirm() {
    const confirm = async (message: string, title = '提示') => {
        try {
            await ElMessageBox.confirm(message, title, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            return true
        } catch {
            return false
        }
    }
    return { confirm }
}