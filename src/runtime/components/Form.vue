<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form'
import type { ComponentConfig } from '../types/tv'
import type { SchemaFormProps, GenericFormSchema } from '@formwerk/core'

type FormConfig = ComponentConfig<typeof theme, AppConfig, 'form'>

export interface FormProps<TSchema extends GenericFormSchema> extends SchemaFormProps<TSchema> {
  class?: any
}
</script>

<script lang="ts" setup generic="TSchema extends GenericFormSchema">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

import { useForm } from '@formwerk/core'

const props = defineProps<FormProps<TSchema>>()

const { formProps, handleSubmit, values, getErrors, displayError, isTouched, ...form } = useForm(props)

form.reset()
const appConfig = useAppConfig() as FormConfig['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.form || {}) }))

const onSubmitWrapper = handleSubmit((data) => {
  console.log('Form submitted:', data)
})
</script>

<template>
  <form v-bind="formProps" :class="ui({ class: props.class })" @submit.prevent="onSubmitWrapper">
    <slot :values="values" :errors="getErrors()" :display-error="displayError" :is-touched="isTouched()" />
  </form>
</template>
