<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form'
import type { ComponentConfig } from '../types/tv'
import type { SchemaFormProps, GenericFormSchema } from '@formwerk/core'
import type { FormInputEvents } from '../types'

type FormConfig = ComponentConfig<typeof theme, AppConfig, 'form'>

export interface FormProps<TSchema extends GenericFormSchema, T extends boolean = true> extends SchemaFormProps<TSchema> {
  /**
   * The list of input events that trigger the form validation.
   * @remarks The form always validates on submit.
   * @defaultValue `['blur', 'change', 'input']`
   */
  validateOn?: FormInputEvents[]

  /** Disable all inputs inside the form. */
  disabled?: boolean
  /**
   * If true, schema transformations will be applied to the state on submit.
   * @defaultValue `true`
   */
  transform?: T
  /**
   * If true, this form will attach to its parent Form (if any) and validate at the same time.
   * @defaultValue `true`
   */
  attach?: boolean

  /**
   * When `true`, all form elements will be disabled on `@submit` event.
   * This will cause any focused input elements to lose their focus state.
   * @defaultValue `true`
   */
  loadingAuto?: boolean
  class?: any
}

export interface FormSlots {
  default(props?: { errors: Ref<string[]>, loading: boolean }): any
}
</script>

<script lang="ts" setup generic="TSchema extends GenericFormSchema, T extends boolean = true">
import { provide, ref, computed, readonly, type Ref } from 'vue'
import { formLoadingInjectionKey, useAppConfig } from '#imports'
import { tv } from '../utils/tv'

import { useForm } from '@formwerk/core'

const props = withDefaults(defineProps<FormProps<TSchema, T>>(), {
  validateOn: () => ['blur', 'change', 'input'] as FormInputEvents[],
  attach: true,
  transform: () => true as T,
  loadingAuto: true
})

const { formProps, handleSubmit, getIssues, values, ...form } = useForm(props)

const loading = ref(false)
provide(formLoadingInjectionKey, readonly(loading))

form.reset()
const appConfig = useAppConfig() as FormConfig['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.form || {}) }))

const errors = computed(() => form.getErrors())
const isTouched = computed(() => form.isTouched())
</script>

<template>
  <form v-bind="formProps" :class="ui({ class: props.class })">
    <slot :values="values" :errors="errors" :is-touched="isTouched" />
  </form>
</template>
