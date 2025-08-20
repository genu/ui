import { inject, computed, provide } from 'vue'
import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { FormFieldProps } from '../types'
import type { FormFieldInjectedOptions, FormInjectedOptions } from '../types/form'
import type { GetObjectField } from '../types/utils'

type Props<T> = {
  name?: string
  size?: GetObjectField<T, 'size'>
  color?: GetObjectField<T, 'color'>
  highlight?: boolean
  disabled?: boolean
  label?: string
}

export const formOptionsInjectionKey: InjectionKey<ComputedRef<FormInjectedOptions>> = Symbol('nuxt-ui.form-options')
export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>> | undefined> = Symbol('nuxt-ui.form-field')
export const formLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('nuxt-ui.form-loading')
export const formGroupInjectionKey: InjectionKey<ComputedRef<{ size?: any }>> = Symbol('nuxt-ui.form-group')

export function useFormField<T>(props?: Props<T>) {
  const formField = inject(formFieldInjectionKey, undefined)
  const formGroup = inject(formGroupInjectionKey, undefined)

  // Blocks the FormField injection to avoid duplicating events when nesting input components.
  provide(formFieldInjectionKey, undefined)

  return {
    name: computed(() => props?.name ?? formField?.value?.name),
    size: computed(() => props?.size ?? formField?.value?.size ?? formGroup?.value?.size),
    color: computed(() => formField?.value?.hasError ? 'error' : props?.color),
    highlight: computed(() => formField?.value?.hasError ? true : props?.highlight)
  }
}
