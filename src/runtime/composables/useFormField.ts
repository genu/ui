import { inject, computed, provide } from 'vue'
import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { FormFieldProps } from '../types'
import type { FormFieldInjectedOptions, FormGroupInjectedOptions } from '../types/form'
import type { GetObjectField } from '../types/utils'
import type { FormGroupProps } from '../components/FormGroup.vue'

type Props<T> = {
  name?: string
  size?: GetObjectField<T, 'size'>
}

export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>> | undefined> = Symbol('nuxt-ui.form-field')
export const formGroupInjectionKey: InjectionKey<ComputedRef<FormGroupInjectedOptions<FormGroupProps>> | undefined> = Symbol('nuxt-ui.form-group')
export const formLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('nuxt-ui.form-loading')

export function useFormField<T>(props?: Props<T>) {
  const formField = inject(formFieldInjectionKey, undefined)
  const formGroup = inject(formGroupInjectionKey, undefined)

  // Blocks the FormField injection to avoid duplicating events when nesting input components.
  provide(formFieldInjectionKey, undefined)

  return {
    name: computed(() => props?.name ?? formField?.value?.name),
    size: computed(() => props?.size ?? formField?.value?.size ?? formGroup?.value?.size)
  }
}
