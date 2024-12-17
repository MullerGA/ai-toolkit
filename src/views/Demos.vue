<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-6">Démonstrations</h1>
    <div class="max-w-3xl mx-auto">
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Chat IA</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            v-model="userInput"
            placeholder="Posez votre question ici..."
            class="mb-4"
          />
          <Button @click="sendMessage" class="w-full">Envoyer</Button>
        </CardContent>
      </Card>

      <div class="space-y-4">
        <Card v-for="(message, index) in messages" :key="index">
          <CardContent class="p-4">
            <p>{{ message }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const userInput = ref('')
const messages = ref<string[]>([])

const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.unshift(userInput.value)
    userInput.value = ''
  }
}
</script> 