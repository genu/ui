import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ComputedRef, DeepReadonly, Ref } from 'vue'
import type { Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema } from 'yup'
import type { GetObjectField } from './utils'
import type { Struct as SuperstructSchema } from 'superstruct'
import type { AriaLabelProps } from '@formwerk/core'

export interface Form<S extends FormSchema> {
  validate<T extends boolean>(opts?: { name?: keyof FormData<S, false> | (keyof FormData<S, false>)[], silent?: boolean, nested?: boolean, transform?: T }): Promise<FormData<S, T> | false>
  clear (path?: string): void
  submit (): Promise<void>
  disabled: ComputedRef<boolean>
  dirty: ComputedRef<boolean>
  loading: Ref<boolean>

  dirtyFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>
  touchedFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>
  blurredFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>
}

export type FormSchema<I extends object = object, O extends object = I>
  = | YupObjectSchema<I>
    | JoiSchema<I>
    | SuperstructSchema<any, any>
    | StandardSchemaV1<I, O>

// Define a utility type to infer the input type based on the schema type
export type InferInput<Schema> = Schema extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Schema>
  : Schema extends YupObjectSchema<infer I> ? I
    : Schema extends JoiSchema<infer I> ? I
      : Schema extends SuperstructSchema<infer I, any> ? I
        : Schema extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Schema>
          : never

// Define a utility type to infer the output type based on the schema type
export type InferOutput<Schema> = Schema extends StandardSchemaV1 ? StandardSchemaV1.InferOutput<Schema>
  : Schema extends YupObjectSchema<infer O> ? O
    : Schema extends JoiSchema<infer O> ? O
      : Schema extends SuperstructSchema<infer O, any> ? O
        : never

export type FormData<S extends FormSchema, T extends boolean = true> = T extends true ? InferOutput<S> : InferInput<S>

export type FormInputEvents = 'input' | 'blur' | 'change' | 'focus'

export type FormSubmitEvent<T> = SubmitEvent & { data: T }

export type FormEventType = FormInputEvents

export type FormChildAttachEvent = {
  type: 'attach'
  formId: string | number
  validate: Form<any>['validate']
}

export type FormChildDetachEvent = {
  type: 'detach'
  formId: string | number
}

export type FormInputEvent<T extends object> = {
  type: FormEventType
  name: keyof T
  eager?: boolean
}

export type FormEvent<T extends object>
  = | FormInputEvent<T>
    | FormChildAttachEvent
    | FormChildDetachEvent

export interface FormInjectedOptions {
  disabled?: boolean
  validateOnInputDelay?: number
}

export interface FormFieldInjectedOptions<T> {
  name?: string
  size?: GetObjectField<T, 'size'>
  eagerValidation?: boolean
  validateOnInputDelay?: number
  errorPattern?: RegExp
  hint?: string
  description?: string
  help?: string
  label?: string
  displayError: string | undefined
  setLabelProps: (props: AriaLabelProps) => void
  setDescriptionProps: (props: any) => void
  setErrorMessageProps: (props: any) => void
  setErrorMessage: (errorMessage: Ref<string | undefined>) => void
  setIsTouched: (isTouched: Ref<boolean>) => void
}
