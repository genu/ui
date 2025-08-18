import { inject, computed, provide } from 'vue'
import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { FormFieldProps } from '../types'
import type { FormFieldInjectedOptions, FormInjectedOptions } from '../types/form'
import type { GetObjectField } from '../types/utils'
import type { AriaLabelProps } from '@formwerk/core'

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
  const formOptions = inject(formOptionsInjectionKey, undefined)
  const formField = inject(formFieldInjectionKey, undefined)
  const formGroup = inject(formGroupInjectionKey, undefined)

  // Blocks the FormField injection to avoid duplicating events when nesting input components.
  provide(formFieldInjectionKey, undefined)

  const setLabelProps = (props: AriaLabelProps) => {
    if (formField?.value?.setLabelProps) {
      formField.value.setLabelProps(props)
    }
  }

  const setDescriptionProps = (props: any) => {
    if (formField?.value?.setDescriptionProps) {
      formField.value.setDescriptionProps(props)
    }
  }

  const setErrorMessageProps = (props: any) => {
    if (formField?.value?.setErrorMessageProps) {
      formField.value.setErrorMessageProps(props)
    }
  }

  const setErrorMessage = (errorMessage: Ref<string | undefined>) => {
    if (formField?.value?.setErrorMessage) {
      formField.value.setErrorMessage(errorMessage)
    }
  }

  const setIsTouched = (isTouched: Ref<boolean>) => {
    if (formField?.value?.setIsTouched) {
      formField.value.setIsTouched(isTouched)
    }
  }

  return {
    name: computed(() => props?.name ?? formField?.value?.name),
    label: computed(() => props?.label ?? formField?.value?.label),
    size: computed(() => props?.size ?? formField?.value?.size ?? formGroup?.value?.size),
    color: computed(() => formField?.value?.displayError ? 'error' : props?.color),
    highlight: computed(() => formField?.value?.displayError ? true : props?.highlight),
    disabled: computed(() => formOptions?.value?.disabled || props?.disabled),
    setLabelProps,
    setDescriptionProps,
    setErrorMessageProps,
    setErrorMessage,
    setIsTouched
  }
}
