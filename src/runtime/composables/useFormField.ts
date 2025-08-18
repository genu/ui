import { inject, computed, provide } from 'vue'
import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { FormFieldProps } from '../types'
import type { FormFieldInjectedOptions, FormInjectedOptions } from '../types/form'
import type { GetObjectField } from '../types/utils'

type Props<T> = {
  id?: string
  name?: string
  size?: GetObjectField<T, 'size'>
  color?: GetObjectField<T, 'color'>
  highlight?: boolean
  disabled?: boolean
}

export const formOptionsInjectionKey: InjectionKey<ComputedRef<FormInjectedOptions>> = Symbol('nuxt-ui.form-options')
export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>> | undefined> = Symbol('nuxt-ui.form-field')
export const formLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('nuxt-ui.form-loading')

export function useFormField<T>(props?: Props<T>) {
  const formOptions = inject(formOptionsInjectionKey, undefined)
  const formField = inject(formFieldInjectionKey, undefined)

  // Blocks the FormField injection to avoid duplicating events when nesting input components.
  provide(formFieldInjectionKey, undefined)

  return {
    name: computed(() => props?.name ?? formField?.value.name),
    size: computed(() => props?.size ?? formField?.value.size),
    color: computed(() => formField?.value.error ? 'error' : props?.color),
    highlight: computed(() => formField?.value.error ? true : props?.highlight),
    disabled: computed(() => formOptions?.value.disabled || props?.disabled),
  }
}
