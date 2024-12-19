<template>
  <div class="space-y-8">
    <!-- Introduction -->
    <div class="bg-muted/50 rounded-lg p-4">
      <p class="text-base leading-relaxed">
        Le mécanisme d'attention est au cœur des LLMs modernes. Il permet au modèle de "concentrer" 
        son analyse sur les relations pertinentes entre les différents tokens d'une phrase, comme 
        le ferait un lecteur humain.
      </p>
    </div>

    <!-- Sélection du scénario -->
    <div class="flex gap-4">
      <Button 
        v-for="s in scenarios" 
        :key="s.id"
        variant="outline"
        :class="{ 'bg-primary text-primary-foreground': currentScenario === s.id }"
        @click="$emit('update:scenario', s.id)"
      >
        {{ s.name }}
      </Button>
    </div>

    <!-- Visualisation centrale de l'attention -->
    <div class="bg-muted/50 rounded-lg p-6">
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium mb-2">Mécanisme d'attention</h3>
          <p class="text-sm text-muted-foreground mb-4">
            La visualisation ci-dessous montre comment chaque token interagit avec les autres. 
            Cette "attention" permet au modèle de comprendre le contexte et les relations entre les mots.
          </p>
          <p class="text-sm text-muted-foreground italic">
            Sélectionnez un mot pour voir ses relations avec les autres tokens.
          </p>
        </div>

        <!-- Mots alignés horizontalement -->
        <div class="flex justify-between px-4">
          <button
            v-for="(word, index) in words"
            :key="index"
            class="px-3 py-1.5 rounded-md text-sm transition-colors"
            :class="{
              'bg-primary text-primary-foreground': selectedWordIndex === index,
              'hover:bg-muted/80': selectedWordIndex !== index
            }"
            @click="selectWord(index)"
          >
            {{ word }}
          </button>
        </div>

        <!-- "Touches de piano" pour les scores d'attention -->
        <div v-if="selectedWordIndex !== null" class="flex justify-between px-4">
          <div
            v-for="(score, index) in getAttentionScores(selectedWordIndex)"
            :key="index"
            class="w-12 h-20 transition-all duration-300 flex flex-col items-center"
          >
            <!-- Pourcentage -->
            <div 
              v-if="index !== selectedWordIndex && score > 0.1" 
              class="text-xs text-center mb-1"
            >
              {{ (score * 100).toFixed(0) }}%
            </div>
            
            <!-- Touche -->
            <div
              v-if="index !== selectedWordIndex"
              class="w-full flex-1 rounded-b-sm"
              :style="{
                backgroundColor: `rgb(var(--primary))`,
                opacity: score
              }"
            />
            <div
              v-else
              class="w-full flex-1"
            />
          </div>
        </div>

        <div class="text-sm text-muted-foreground mt-4">
          <p class="font-medium mb-2">Les barres représentent l'intensité de l'attention :</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Une intesité haute indique une forte connexion entre les tokens</li>
            <li>Une intesité basse suggère une relation plus faible</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Analyse contextuelle -->
    <div class="bg-muted/50 rounded-lg p-4">
      <h3 class="text-lg font-medium mb-4">Analyse contextuelle</h3>
      <div v-if="selectedWordIndex !== null" class="space-y-6">
        <div>
          <h4 class="text-sm font-medium mb-2">Token sélectionné</h4>
          <p class="text-lg font-medium text-primary">
            "{{ words[selectedWordIndex] }}"
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium mb-2">Relations principales</h4>
          <ul class="space-y-2">
            <li 
              v-for="(relation, index) in getTopRelations(selectedWordIndex)" 
              :key="index"
              class="flex items-center gap-2"
            >
              <span class="text-sm">{{ relation.word }}</span>
              <span class="text-xs text-muted-foreground">({{ relation.type }})</span>
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium mb-2">Relations Principales</h4>
            <p class="text-sm text-muted-foreground">
              Les liens identifiés (Complément, Sujet-Verbe, etc.) montrent comment le modèle 
              comprend la structure grammaticale et sémantique de la phrase. Ces relations
              sont essentielles pour la compréhension globale du texte.
            </p>
          </div>

          <div>
            <h4 class="text-sm font-medium mb-2">Points clés</h4>
            <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Chaque token peut avoir plusieurs relations importantes</li>
              <li>L'attention est bidirectionnelle : les tokens s'influencent mutuellement</li>
              <li>Le contexte global influence la force des relations</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-muted-foreground">
        Sélectionnez un mot pour voir son analyse contextuelle
      </div>
    </div>

    <!-- Note technique -->
    <div class="bg-primary/5 rounded-lg p-4 border border-primary/10">
      <h4 class="font-medium text-primary mb-2">Note technique</h4>
      <p class="text-sm leading-relaxed">
        En réalité, un LLM utilise plusieurs "têtes d'attention" en parallèle, chacune 
        pouvant capturer différents types de relations (grammaticales, sémantiques, 
        contextuelles...). Notre visualisation montre une version simplifiée de ce 
        mécanisme complexe.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const selectedWordIndex = ref<number | null>(null)

const words = computed(() => {
  return currentScenarioData.value.tokens.map(t => t.token)
})

// Matrice d'attention simulée - adaptée en fonction du scénario
const attentionMatrix = computed(() => {
  const size = currentScenarioData.value.tokens.length
  return Array(size).fill(0).map((_, i) => 
    Array(size).fill(0).map((_, j) => {
      // Si j > i, cela signifie que c'est un mot futur
      if (j > i) return 0
      // Sinon, générer un score d'attention aléatoire
      return Math.random()
    })
  )
})

const selectWord = (index: number) => {
  selectedWordIndex.value = index
}

const getAttentionScores = (wordIndex: number) => {
  return attentionMatrix.value[wordIndex].map((score, index) => {
    // Un mot ne peut avoir d'attention que sur les mots qui le précèdent et lui-même
    if (index > wordIndex) {
      return 0 // Pas d'attention sur les mots futurs
    }
    
    // Normalisation des scores pour les mots précédents et actuels
    if (score < 0.1) return 0
    return Math.pow(score, 1.5)
  })
}

const getTopRelations = (wordIndex: number) => {
  const scores = attentionMatrix.value[wordIndex]
  return scores
    .map((score, index) => ({
      word: words.value[index],
      score: index > wordIndex ? 0 : score, // Pas de relation avec les mots futurs
      type: getRelationType(wordIndex, index)
    }))
    .filter(relation => relation.score > 0) // Ne garder que les relations valides
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

const getRelationType = (sourceIndex: number, targetIndex: number) => {
  // Types de relations adaptés selon le contexte
  const types = {
    simple: ['Sujet-Verbe', 'Verbe-Objet', 'Modification', 'Complément'],
    computer_science: ['Agent-Action', 'Action-Cible', 'Modification', 'Contexte'],
    science: ['Agent-Action', 'Action-Objet', 'Qualification', 'Description']
  }
  
  const scenarioTypes = types[currentScenarioData.value.id as keyof typeof types] || types.simple
  return scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)]
}
</script>

<style scoped>
.attention-score {
  transition: all 0.3s ease;
}

/* Animation pour les touches */
@keyframes appear {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.attention-key {
  transform-origin: top;
  animation: appear 0.3s ease-out;
}

/* ... autres styles si nécessaires ... */
</style> 