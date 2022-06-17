import { VNode, InjectionKey, Ref, onMounted, watch, inject, ref, getCurrentInstance } from 'vue'
import { delay } from '@hairy/libcore'
import noop from 'lodash/noop'

export interface OverlayMeta {
  /** 调取失败，更改 visible，且当 animation 结束后销毁 */
  cancel: Function
  /** 调取成功，更改 visible，且当 animation 结束后销毁 */
  confirm: Function
  /** 销毁当前实例（立即，且调用失败），不是 overlay 则调用 reject */
  vanish: Function
  /** vnode 当前包装层的 VNode */
  vnode?: VNode
  /** visible 包装层属性，控制弹出层显示与隐藏 */
  visible: Ref<boolean>
  /** 默认值的情况使用的事件 */
  emits?: ('cancel' | 'confirm')[]
  /** 使用默认的值(component 式调用) */
  __is_default?: boolean
}

export const OverlayMetaKey: InjectionKey<OverlayMeta> = Symbol('__imperative_overlay_key')

export interface UseOverlayMetaOptions {
  animation?: number
  immediate?: boolean
}

export const useDefaultMeta = (): OverlayMeta => {
  const instance = getCurrentInstance()
  const visible = ref(false)

  const cancel = (value?: any) => {
    visible.value = false
    instance?.emit('cancel', value)
  }
  const confirm = (value?: any) => {
    visible.value = false
    instance?.emit('confirm', value)
  }
  return {
    cancel,
    confirm,
    vanish: noop,
    visible,
    emits: ['cancel', 'confirm'],
    __is_default: true
  }
}

/**
 * 获取弹出层元信息
 * @function cancel 调取失败，更改 visible，且当 animation 结束后销毁
 * @function confirm 调取成功，更改 visible，且当 animation 结束后销毁
 * @function vanish 销毁当前实例（立即调用，且会调用失败）
 * @field vnode 当前包装层的 VNode
 * @field visible 包装层属性，控制弹出层显示与隐藏
 * @returns
 */
export const useOverlayMeta = (options: UseOverlayMetaOptions = {}) => {
  const { animation = 0, immediate = true } = options
  const meta = inject(OverlayMetaKey, useDefaultMeta())

  // 为了简便性和合理的逻辑组合，将 animation 逻辑移至 meta 创建时
  // 组件式调用直接获取默认值，vanish 将没有任何效果，不进行 watch
  !meta.__is_default &&
    watch(meta.visible, async () => {
      if (meta.visible.value) return undefined
      if (animation > 0) await delay(animation)
      meta.vanish?.()
    })

  if (immediate) onMounted(() => (meta.visible.value = true))

  return meta
}
