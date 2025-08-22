<script setup lang="ts">
import * as z from 'zod'

const schema = z.object({
  contract: z.string({ error: 'Contract is required' }).min(4, 'Contract must be at least 4 characters'),
  company: z.object({
    name: z.string({ error: 'Company name is required' }).min(4, 'Company name must be at least 4 characters')
  }),
  preferences: z.object({
    theme: z.string({ error: 'Theme is required' }).min(4, 'Theme must be at least 4 characters'),
    language: z.string({ error: 'Language is required' }).min(4, 'Language must be at least 4 characters')
  }),
  advanced: z.object({
    apiKey: z.string({ error: 'API key is required' }).min(4, 'API key must be at least 4 characters'),
    override: z.string({ error: 'Override is required' }).min(4, 'Override must be at least 4 characters')
  })
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-4">
      <UForm
        id="My Awesome Form"
        :schema="schema"
        :initial-values="{
          contract: 'initial data'
        }"
        class=""
        #="{values,errors,isTouched}"
        @submit="(data) => {
          const d = data.toJSON()
          console.log(d.contract)
        }"
      >
        <UFormField
          class="flex-1"
          label="Your Contract"
          name="contract"
          description="Enter your contract"
          help="This is a help text"
          required
        >
          <UInput placeholder="John Lennon" class="w-full" />
        </UFormField>

        <UFormGroup
          name="company"
          label="Company Information (Size: lg)"
          variant="outline"
        >
          <div class="flex gap-4">
            <UFormField
              class="flex-1"
              label="Company Name"
              name="name"
              description="Enter the name of the company"
              required
            >
              <UInput placeholder="Apple Inc." class="w-full" />
            </UFormField>
          </div>
        </UFormGroup>
        <UFormGroup
          name="preferences"
          label="Preferences (Size: sm)"
          variant="soft"
          size="sm"
        >
          <div class="grid grid-cols-2 gap-6">
            <UFormField
              label="Theme"
              name="theme"
              description="Choose your preferred theme"
            >
              <UInput placeholder="Dark" />
            </UFormField>
            <UFormField
              label="Language"
              name="language"
              description="Select your language"
            >
              <UInput placeholder="English" />
            </UFormField>
          </div>
        </UFormGroup>

        <UFormGroup
          name="advanced"
          label="Advanced Settings"
          variant="ghost"
          size="xs"
        >
          <template #label="{ label }">
            <div class="flex gap-2 items-center">
              <span class="text-lg font-bold text-blue-600">⚙️ {{ label }}</span>
              <span class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">Optional</span>
            </div>
          </template>
          <UFormField
            label="API Key"
            name="apiKey"
            description="Your API key for advanced features"
          >
            <UInput placeholder="sk-..." />
          </UFormField>

          <UFormField
            label="Large Override"
            name="override"
            size="lg"
            description="This field explicitly sets size=lg"
          >
            <UInput placeholder="This is large despite FormGroup being xs" />
          </UFormField>
        </UFormGroup>

        Form Data:
        <pre>{{ values }}</pre>
      </UForm>
    </div>
  </div>
</template>
