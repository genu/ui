<script setup lang="ts">
import * as z from 'zod'

const schema = z.object({
  contract: z.string({ error: 'Contract is required' }).min(4, 'Contract must be at least 4 characters')
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-4">
      <UForm id="My Awesome Form" :schema="schema" class="w-full" #="{values,errors,isTouched}">
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

        <!-- <UFormGroup
          name="contact"
          label="Contact Information (Size: lg)"
          size="lg"
          variant="outline"
        >
          <div class="flex gap-4">
            <UFormField
              class="flex-1"
              label="Your Email Address"
              name="email"
              description="Enter the email address of the person"
              required
            >
              <UInput placeholder="john@lennon.com" class="w-full" />
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
        </UFormGroup> -->
      </UForm>
    </div>
  </div>
</template>
