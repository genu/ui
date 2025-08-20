<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form-field'
import type { ComponentConfig } from '../types/tv'

type FormField = ComponentConfig<typeof theme, AppConfig, 'formField'>

export interface FormFieldProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The name of the FormField. Also used to match form errors. */
  name?: string
  /** A regular expression to match form error names. */
  errorPattern?: RegExp
  label?: string
  description?: string
  help?: string
  error?: boolean | string
  hint?: string
  /**
   * @defaultValue 'md'
   */
  size?: FormField['variants']['size']
  required?: boolean
  /** If true, validation on input will be active immediately instead of waiting for a blur event. */
  eagerValidation?: boolean
  /**
   * Delay in milliseconds before validating the form on input events.
   * @defaultValue `300`
   */
  validateOnInputDelay?: number
  class?: any
  ui?: FormField['slots']
}

export interface FormFieldSlots {
  label(props: { label?: string }): any
  hint(props: { hint?: string }): any
  description(props: { description?: string }): any
  help(props: { help?: string }): any
  error(props: { error?: boolean | string }): any
  default(props: { error?: boolean | string }): any
}
</script>

<script setup lang="ts">
import { computed, ref, provide, type Ref } from 'vue'
import { Primitive, Label } from 'reka-ui'
import { useAppConfig } from '#imports'
import { formFieldInjectionKey } from '../composables/useFormField'
import { tv } from '../utils/tv'
import type { FormFieldInjectedOptions } from '../types/form'
import { useFieldState, useFormField } from '@formwerk/core'

const props = defineProps<FormFieldProps>()
const slots = defineSlots<FormFieldSlots>()

const appConfig = useAppConfig() as FormField['AppConfig']

const state = useFieldState({ path: props.name })
const { labelProps, descriptionProps, errorMessageProps } = useFormField({ label: props.label || '', description: props.description || '' }, state)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.formField || {}) })({
  size: props.size,
  required: props.required
}))

// Input state
const errorMessageRef = ref<Ref<string | undefined> | undefined>()
const isTouchedRef = ref<Ref<boolean> | undefined>()

const displayError = computed(() =>
  isTouchedRef.value?.value ? errorMessageRef.value?.value : ''
)

provide(formFieldInjectionKey, computed(() => ({
  displayError: displayError.value,
  name: props.name,
  size: props.size,
  eagerValidation: props.eagerValidation,
  validateOnInputDelay: props.validateOnInputDelay,
  errorPattern: props.errorPattern,
  hint: props.hint,
  description: props.description,
  help: props.help,
  label: props.label,
  setErrorMessage: message => errorMessageRef.value = message,
  setIsTouched: touched => isTouchedRef.value = touched
}) as FormFieldInjectedOptions<FormFieldProps>))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="label || !!slots.label" :class="ui.labelWrapper({ class: props.ui?.labelWrapper })">
        <Label v-bind="labelProps" :class="ui.label({ class: props.ui?.label })">
          <slot name="label" :label="label">
            {{ label }}
          </slot>
        </Label>
        <span v-if="hint || !!slots.hint" :id="`${labelProps?.id}-hint`" :class="ui.hint({ class: props.ui?.hint })">
          <slot name="hint" :hint="hint">
            {{ hint }}
          </slot>
        </span>
      </div>

      <p v-if="description || !!slots.description" v-bind="descriptionProps" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div :class="[(label || !!slots.label || description || !!slots.description) && ui.container({ class: props.ui?.container })]">
      <slot :error="displayError" />

      <div v-if="(typeof error === 'string' || displayError) || !!slots.error" v-bind="errorMessageProps" :class="ui.error({ class: props.ui?.error })">
        <slot name="error" :error="displayError">
          {{ displayError }}
        </slot>
      </div>
      <div v-else-if="help || !!slots.help" :id="`${labelProps?.id}-help`" :class="ui.help({ class: props.ui?.help })">
        <slot name="help" :help="help">
          {{ help }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>
