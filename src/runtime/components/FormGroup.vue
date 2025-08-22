<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form-group'
import type { ComponentConfig } from '../types/tv'
import type { FormObject } from '@formwerk/core'

type FormGroup = ComponentConfig<typeof theme, AppConfig, 'formGroup'>

export interface FormGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'fieldset'
   */
  as?: any
  /**
   * The name/path of the form group.
   */
  name: string
  /**
   * The label for the form group.
   */
  label?: string

  /**
   * Whether the form group is disabled.
   */
  disabled?: boolean
  /**
   * Whether HTML5 validation should be disabled for this form group.
   */
  disableHtmlValidation?: boolean
  /**
   * @defaultValue 'md'
   */
  size?: FormGroup['variants']['size']
  class?: any
  ui?: FormGroup['slots']
}

export interface FormGroupSlots {
  label(props: { label?: string }): any
  default(props: { isDirty: boolean, isValid: boolean, isTouched: boolean, displayError: (name: string) => string }): any
}
</script>

<script setup lang="ts" generic="TInput extends FormObject = FormObject, TOutput extends FormObject = TInput">
import { computed, provide } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useFormGroup } from '@formwerk/core'
import { formGroupInjectionKey } from '../composables/useFormField'
import type { FormGroupInjectedOptions } from '../types/form'

const props = withDefaults(defineProps<FormGroupProps>(), {
  size: 'md'
})
const slots = defineSlots<FormGroupSlots>()

const appConfig = useAppConfig() as FormGroup['AppConfig']

const {
  groupEl,
  labelProps,
  groupProps,
  isDirty,
  isValid,
  isTouched,
  isDisabled,
  displayError,
  validate,
  getErrors
} = useFormGroup({
  name: props.name,
  label: props.label,
  disabled: props.disabled,
  disableHtmlValidation: props.disableHtmlValidation
})

const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.formGroup })({
  size: props.size
}))

provide(formGroupInjectionKey, computed(() => ({
  size: props.size
}) as FormGroupInjectedOptions<FormGroupProps>))

defineExpose({
  validate,
  getErrors,
  isDirty,
  isValid,
  isTouched,
  isDisabled,
  displayError
})
</script>

<template>
  <Primitive
    ref="groupEl"
    :as="as || 'fieldset'"
    v-bind="groupProps"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :disabled="isDisabled"
  >
    <legend v-if="label || !!slots.label" v-bind="labelProps" :class="ui.legend({ class: props.ui?.legend })">
      <slot name="label" :label="label">
        {{ label }}
      </slot>
    </legend>

    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <slot
        :is-dirty="isDirty"
        :is-valid="isValid"
        :is-touched="isTouched"
        :display-error="displayError"
      />
    </div>
  </Primitive>
</template>
