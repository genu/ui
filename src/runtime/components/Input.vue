<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { AcceptableValue } from '../types/utils'
import type { ComponentConfig } from '../types/tv'
import type { Numberish } from '@formwerk/core'
import { useTextControl } from '@formwerk/core'

type Input = ComponentConfig<typeof theme, AppConfig, 'input'>

export interface InputProps<T extends AcceptableValue = AcceptableValue> extends UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  /** The placeholder text when the input is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: Input['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: Input['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Input['variants']['size']
  required?: boolean
  autocomplete?: InputHTMLAttributes['autocomplete']
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  readonly?: boolean
  maxLength?: Numberish
  minLength?: Numberish
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  modelValue?: T
  defaultValue?: T
  class?: any
  ui?: Input['slots']
}

export interface InputSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts" generic="T extends AcceptableValue">
import { computed, onMounted } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps<T>>(), {
  type: 'text',
  autocomplete: 'off',
  autofocusDelay: 0
})

const slots = defineSlots<InputSlots>()

const appConfig = useAppConfig() as Input['AppConfig']

const { name, size: formGroupSize, highlight, color } = useFormField<InputProps<T>>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps<T>>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const { inputEl, inputProps } = useTextControl({
  name,
  minLength: props.minLength,
  maxLength: props.maxLength,
  placeholder: props.placeholder,
  disabled: props.disabled,
  readonly: props.readonly,
  autocomplete: props.autocomplete,
  required: props.required,
  type: props.type
})

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.input || {}) })({
  type: props.type as Input['variants']['type'],
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

function autoFocus() {
  if (props.autofocus) {
    inputEl.value?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

defineExpose({
  inputEl
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <input :class="ui.base({ class: props.ui?.base })" v-bind="{ ...$attrs, ...inputProps }">
    <slot />

    <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing">
        <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </Primitive>
</template>
