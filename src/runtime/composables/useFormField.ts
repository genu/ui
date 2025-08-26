import { inject, computed, provide } from 'vue'
import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { FormFieldProps } from '../types'
import type { FormFieldInjectedOptions, FormGroupInjectedOptions } from '../types/form'
import type { GetObjectField } from '../types/utils'
import type { FormGroupProps } from '../components/FormGroup.vue'
import { useFormContext } from '@formwerk/core'

type Props<T> = {
  name?: string
  size?: GetObjectField<T, 'size'>
  color?: GetObjectField<T, 'color'>
  highlight?: boolean
  disabled?: boolean
}

export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>> | undefined> = Symbol('nuxt-ui.form-field')
export const formGroupInjectionKey: InjectionKey<ComputedRef<FormGroupInjectedOptions<FormGroupProps>> | undefined> = Symbol('nuxt-ui.form-group')
export const formLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('nuxt-ui.form-loading')

export function useFormField<T>(props?: Props<T>) {
  const formContext = useFormContext()

  const isDisabled = computed(() => formContext?.isDisabled.value)

  const formField = inject(formFieldInjectionKey, undefined)
  const formGroup = inject(formGroupInjectionKey, undefined)

  // Blocks the FormField injection to avoid duplicating events when nesting input components.
  provide(formFieldInjectionKey, undefined)

  const hasError = computed(() => !!(formField?.value.hasError))

  return {
    name: computed(() => props?.name ?? formField?.value?.name),
    size: computed(() => props?.size ?? formField?.value?.size ?? formGroup?.value?.size),
    color: computed(() => hasError.value ? 'error' : props?.color),
    highlight: computed(() => hasError.value ? true : props?.highlight),
    disabled: computed(() => isDisabled.value || props?.disabled)
  }
}
