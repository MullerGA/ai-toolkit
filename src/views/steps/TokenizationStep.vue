<template>
  <div class="space-y-8">
    <!-- Introduction -->
    <div class="bg-muted/50 rounded-lg p-4">
      <p class="text-base leading-relaxed">
        La première étape du traitement d'un texte par un LLM est la tokenisation : 
        le découpage du texte en unités élémentaires appelées "tokens". 
        Ces tokens peuvent être des mots entiers, des parties de mots, ou même des 
        caractères individuels.
      </p>
    </div>

    <!-- Sélection du scénario -->
    <div class="flex gap-4">
      <Button 
        v-for="scenario in scenarios" 
        :key="scenario.id"
        variant="outline"
        :class="{ 'bg-primary text-primary-foreground': currentScenario === scenario.id }"
        @click="$emit('update:scenario', scenario.id)"
      >
        {{ scenario.name }}
      </Button>
    </div>

    <!-- Texte d'entrée et résultat -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="font-medium mb-2 flex items-center justify-between">
          <span>Texte d'entrée</span>
          <span class="text-sm text-muted-foreground">
            ({{ getWordCount }} mots)
          </span>
        </h4>
        <p class="text-lg">{{ currentScenarioData.input }}</p>
      </div>
      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="font-medium mb-2 flex items-center justify-between">
          <span>Résultat transformé</span>
          <span class="text-sm text-muted-foreground">
            ({{ tokens.length }} tokens)
          </span>
        </h4>
        <p class="text-lg">
          Tokens: {{ tokens.map(token => `[${token}]`).join(' ') }}
        </p>
      </div>
    </div>

    <!-- Visualisation principale -->
    <div>
      <h3 class="text-lg font-medium mb-4">Tokenisation</h3>
      <div class="flex flex-wrap gap-2 justify-center">
        <div 
          v-for="token in tokens" 
          :key="token" 
          class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 rounded-md text-sm"
        >
          {{ token }}
        </div>
      </div>
    </div>

    <!-- Encadré "Saviez-vous ?" -->
    <div class="bg-primary/5 rounded-lg p-4 border border-primary/10">
      <h4 class="font-medium text-primary mb-2">Saviez-vous ?</h4>
      <p class="text-sm leading-relaxed">
        Les LLMs modernes utilisent souvent des sous-mots comme tokens.
        Par exemple, "incroyable" pourrait être divisé en "in" + "croyable",
        ce qui aide le modèle à comprendre les parties composantes des mots.
        Cette approche permet de gérer efficacement les mots rares ou inconnus
        en les décomposant en parties familières.
      </p>
    </div>

    <!-- Points clés -->
    <div class="bg-muted/30 rounded-lg p-4">
      <h4 class="font-medium mb-3">Points clés à retenir :</h4>
      <ul class="grid md:grid-cols-2 gap-4 text-sm">
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
          <span>La tokenisation est la première transformation du texte brut</span>
        </li>
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
          <span>Elle prépare le texte pour l'analyse vectorielle qui suivra</span>
        </li>
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
          <span>Un même mot peut être divisé en plusieurs tokens selon sa complexité</span>
        </li>
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
          <span>Cette décomposition permet de mieux comprendre la structure des mots</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'

interface Token {
  token: string
  vector: number[]
}

interface Scenario {
  id: string
  name: string
  input: string
  tokens: Token[]
  description: string
}

const props = defineProps<{
  scenario: string
  scenarios: Scenario[]
}>()

defineEmits<{
  'update:scenario': [scenarioId: string]
}>()

const currentScenario = computed(() => props.scenario)
const currentScenarioData = computed(() => {
  return props.scenarios.find(s => s.id === currentScenario.value) || props.scenarios[0]
})

const getWordCount = computed(() => {
  return currentScenarioData.value.input.split(/\s+/).length
})

const tokens = computed(() => {
  return currentScenarioData.value.tokens.map(t => t.token)
})
</script>

<style scoped>
/* Animation pour les tokens */
@keyframes tokenPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.token-animate {
  animation: tokenPulse 1s ease-in-out infinite;
}
</style> 