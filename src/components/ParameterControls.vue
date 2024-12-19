<template>
  <div class="space-y-4">
    <!-- Mode de contrôle -->
    <div class="flex justify-center gap-4 mb-6">
      <div class="flex gap-2">
        <Button 
          variant="outline"
          :class="{ 'bg-primary text-primary-foreground': mode === 'simple' }"
          @click="setMode('simple')"
        >
          Mode Simple
        </Button>
        <Button
          variant="outline"
          :class="{ 'bg-primary text-primary-foreground': mode === 'advanced' }"
          @click="setMode('advanced')"
        >
          Mode Avancé
        </Button>
      </div>
    </div>

    <!-- Contrôles simples -->
    <div v-if="mode === 'simple'" class="space-y-4">
      <div class="space-y-2">
        <Label>Créativité: {{ creativity.toFixed(2) }}</Label>
        <Slider
          :model-value="[creativity]"
          @update:model-value="value => value && updateCreativity(value[0])"
          :min="0.1"
          :max="2.0"
          :step="0.1"
          class="w-full"
        />
        <p class="text-xs text-muted-foreground">
          Contrôle global de la génération
        </p>
      </div>
    </div>

    <!-- Contrôles avancés -->
    <div v-else class="space-y-6">
      <div class="space-y-2">
        <Label>Température: {{ temperature.toFixed(2) }}</Label>
        <Slider
          :model-value="[temperature]"
          @update:model-value="value => value && updateTemperature(value[0])"
          :min="0.1"
          :max="2.0"
          :step="0.1"
          class="w-full"
        />
        <p class="text-xs text-muted-foreground">
          Contrôle la créativité du modèle
        </p>
      </div>

      <div class="space-y-2">
        <Label>Top K: {{ topK }}</Label>
        <Slider
          :model-value="[topK]"
          @update:model-value="value => value && updateTopK(value[0])"
          :min="1"
          :max="10"
          :step="1"
          class="w-full"
        />
        <p class="text-xs text-muted-foreground">
          Limite le nombre de tokens considérés
        </p>
      </div>

      <div class="space-y-2">
        <Label>Top P: {{ topP.toFixed(2) }}</Label>
        <Slider
          :model-value="[topP]"
          @update:model-value="value => value && updateTopP(value[0])"
          :min="0.1"
          :max="1.0"
          :step="0.05"
          class="w-full"
        />
        <p class="text-xs text-muted-foreground">
          Seuil de probabilité cumulée
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

const mode = ref<'simple' | 'advanced'>('simple')
const creativity = ref(0.7)

const props = defineProps<{
  temperature: number
  topK: number
  topP: number
}>()

const emit = defineEmits<{
  (e: 'update:temperature', value: number): void
  (e: 'update:topK', value: number): void
  (e: 'update:topP', value: number): void
}>()

const setMode = (newMode: 'simple' | 'advanced') => {
  mode.value = newMode
}

const updateCreativity = (value: number) => {
  creativity.value = value
  // Mettre à jour tous les paramètres en fonction de la créativité
  emit('update:temperature', value)
  emit('update:topK', Math.round(10 - value * 3))
  emit('update:topP', Math.max(0.1, Math.min(1, value / 2)))
}

const updateTemperature = (value: number) => {
  emit('update:temperature', value)
}

const updateTopK = (value: number) => {
  emit('update:topK', value)
}

const updateTopP = (value: number) => {
  emit('update:topP', value)
}

// Synchroniser les valeurs initiales
watch(() => props.temperature, (newValue) => {
  if (mode.value === 'simple') {
    creativity.value = newValue
  }
}, { immediate: true })
</script> 