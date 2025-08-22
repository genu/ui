<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form'
import type { ComponentConfig } from '../types/tv'
import type { GenericFormSchema, ConsumableData, FormObject, SchemaFormProps } from '@formwerk/core'
import type { FormInputEvents } from '../types'
import type { StandardSchemaV1 } from '@standard-schema/spec'

type FormConfig = ComponentConfig<typeof theme, AppConfig, 'form'>

interface WithSchema<TSchema extends GenericFormSchema, TOutput extends FormObject = StandardSchemaV1.InferOutput<TSchema>, T extends boolean = true> extends SchemaFormProps<TSchema> {
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
  onSubmit?: (values: ConsumableData<TOutput>) => void | Promise<void>
}

export interface FormSlots {
  default(props?: { errors: Ref<string[]>, loading: boolean }): any
}
</script>

<script lang="ts" setup generic="TSchema extends GenericFormSchema, TInput  extends FormObject = StandardSchemaV1.InferInput<TSchema>, TOutput extends FormObject = StandardSchemaV1.InferOutput<TSchema>, T extends boolean = true">
import { provide, ref, computed, readonly, type Ref } from 'vue'
import { formLoadingInjectionKey, useAppConfig } from '#imports'
import { tv } from '../utils/tv'

import { useForm } from '@formwerk/core'

const props = withDefaults(defineProps<WithSchema<TSchema, TOutput, T>>(), {
  validateOn: () => ['blur', 'change', 'input'] as FormInputEvents[],
  attach: true,
  // transform: () => true as T,
  loadingAuto: true
})

const { formProps, values, ...form } = useForm(props)

const loading = ref(false)
provide(formLoadingInjectionKey, readonly(loading))

const onSubmitWrapper = form.handleSubmit(async (payload) => {
  loading.value = props.loadingAuto && true

  // await props.onSubmit?.(payload)
})

const appConfig = useAppConfig() as FormConfig['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.form || {}) }))

const disabled = computed(() => props.disabled || loading.value)
const errors = computed(() => form.getErrors())
const isTouched = computed(() => form.isTouched())
const isDirty = computed(() => form.isDirty())
const isValid = computed(() => form.isValid())

defineExpose({
  validate: form.validate,
  submit: onSubmitWrapper,
  errors,
  clear: form.setErrors,
  getErrors: form.getErrors,
  disabled,
  loading,
  isValid

})
</script>

<template>
  <form v-bind="formProps" :class="ui({ class: props.class })" @submit.prevent="onSubmitWrapper">
    <slot
      :values
      :errors
      :is-touched
      :is-dirty
      :is-valid
      :loading
    />
  </form>
</template>
