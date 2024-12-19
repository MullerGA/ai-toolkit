<template>
  <div class="space-y-8">
    <!-- Introduction -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <p class="text-base leading-relaxed">
          La <span class="font-medium">génération de réponses</span> est l'étape finale où le 
          <span class="font-medium">LLM</span> produit du texte <span class="italic">token par token</span>. 
          Cette génération est un <span class="font-medium text-primary">processus complexe</span> qui peut 
          être <span class="italic">ajusté et optimisé</span> de différentes manières.
        </p>
      </CardContent>
    </Card>

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

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Processus de génération -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium">Génération de réponse</h3>
          <div class="text-sm text-muted-foreground mb-4">
            <p class="mb-2">Le modèle génère sa réponse token par token, en considérant à chaque étape :</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Le contexte complet de la conversation</li>
              <li>Les relations établies par le mécanisme d'attention</li>
              <li>Les probabilités de chaque token possible</li>
            </ul>
          </div>
        </div>

        <div class="bg-muted/50 rounded-lg p-4">
          <!-- Texte en cours de génération -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium">Réponse générée</h4>
            <div class="bg-background rounded p-3 min-h-[100px] relative">
              <div class="space-x-1">
                <span 
                  v-for="(token, index) in generatedTokens" 
                  :key="index"
                  :class="{ 
                    'text-primary font-medium': index === currentTokenIndex,
                    'opacity-50': index > currentTokenIndex
                  }"
                >
                  {{ token }}
                </span>
                <span 
                  v-if="isGenerating" 
                  class="inline-block w-2 h-4 bg-primary animate-pulse ml-1"
                />
              </div>
              
              <!-- Historique des tokens supprimés -->
              <div v-if="deletedTokens.length > 0" class="mt-2 text-sm text-muted-foreground">
                <div>Tokens supprimés:</div>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="(token, index) in deletedTokens" 
                    :key="index"
                    class="px-1 bg-red-100 dark:bg-red-900/20 rounded"
                  >
                    {{ token }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contrôles de génération -->
          <div class="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              :disabled="isGenerating || generatedTokens.length > 0"
              @click="startGeneration"
            >
              Générer
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              :disabled="!isGenerating"
              @click="pauseGeneration"
            >
              {{ isPaused ? 'Reprendre' : 'Pause' }}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              :disabled="!canUndo"
              @click="undoToken"
            >
              Retour
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              :disabled="!canRedo"
              @click="redoToken"
            >
              Avant
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              :disabled="generatedTokens.length === 0"
              @click="resetGeneration"
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      <!-- Probabilités des tokens -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium">Prédictions</h3>
          <div class="text-sm text-muted-foreground mb-4">
            <p class="mb-2">À chaque étape, le modèle :</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Calcule les probabilités pour tous les tokens possibles</li>
              <li>Sélectionne le plus approprié selon le contexte</li>
              <li>Met à jour son état interne pour la prochaine prédiction</li>
            </ul>
          </div>
        </div>

        <div class="bg-muted/50 rounded-lg p-4">
          <div v-if="currentTokenIndex !== null" class="space-y-4">
            <h4 class="text-sm font-medium mb-2">Prochains tokens possibles</h4>
            <div class="space-y-2">
              <div 
                v-for="prediction in currentPredictions" 
                :key="prediction.token"
                class="flex items-center gap-2 group cursor-pointer"
                @click="selectPrediction(prediction)"
              >
                <div class="w-24 truncate text-sm">{{ prediction.token }}</div>
                <div 
                  class="flex-grow h-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors"
                  :style="{ background: `linear-gradient(90deg, var(--primary) ${prediction.probability * 100}%, transparent ${prediction.probability * 100}%)` }"
                />
                <div class="w-16 text-sm text-right">
                  {{ (prediction.probability * 100).toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground">
            Démarrez la génération pour voir les prédictions
          </div>
        </div>
      </div>
    </div>

    <!-- Pour aller plus loin -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <h4 class="font-medium mb-3">Pour aller plus loin</h4>
        <p class="text-sm text-muted-foreground mb-2">
          Découvrez notre visualisation de "L'Entonnoir de Décision LLM" pour comprendre en détail :
        </p>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Comment la température influence la distribution des probabilités</li>
          <li>L'impact du Top-K sur la sélection des tokens</li>
          <li>Le rôle du Top-P dans le filtrage des choix</li>
          <li>La transformation progressive des probabilités à chaque étape</li>
        </ul>
      </CardContent>
    </Card>

    <!-- Note de conclusion -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <p class="text-sm leading-relaxed">
          La génération de texte par un LLM utilise un système sophistiqué de filtrage
          des probabilités. Notre visualisation interactive de l'entonnoir vous permettra
          d'explorer et de comprendre comment ces différents paramètres façonnent
          la génération finale du texte.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

// États de génération
const isGenerating = ref(false)
const isPaused = ref(false)
const currentTokenIndex = ref<number | null>(null)
const generatedTokens = ref<string[]>([])
const deletedTokens = ref<string[]>([])
const tokenHistory = ref<string[][]>([])
const historyIndex = ref(-1)

// Prédictions adaptées selon le scénario
const predictionsByStep = computed(() => {
  return currentScenarioData.value.tokens.map(token => {
    // Générer des alternatives plausibles selon le contexte
    const alternatives = getAlternativesForToken(token.token, currentScenarioData.value.id)
    return [
      { token: token.token, probability: 0.6 + Math.random() * 0.2 },
      ...alternatives.map(alt => ({ 
        token: alt, 
        probability: Math.random() * 0.3 
      }))
    ].sort((a, b) => b.probability - a.probability)
  })
})

// Fonction helper pour générer des alternatives contextuelles
const getAlternativesForToken = (token: string, scenarioId: string) => {
  const alternatives = {
    simple: {
      'Le': ['Un', 'Ce'],
      'chat': ['chien', 'félin'],
      'dort': ['repose', 'sommeille'],
      'sur': ['dans', 'sous'],
      'le': ['un', 'son'],
      'tapis': ['sol', 'canapé']
    },
    computer_science: {
      'intelligence': ['système', 'programme'],
      'artificielle': ['machine', 'automatique'],
      'transforme': ['analyse', 'traite'],
      'rapidement': ['efficacement', 'instantanément'],
      'société': ['monde', 'quotidien']
    },
    science: {
      'chercheurs': ['scientifiques', 'experts'],
      'découvert': ['identifié', 'observé'],
      'particule': ['molécule', 'élément'],
      'subatomique': ['quantique', 'microscopique'],
      'fascinante': ['intéressante', 'remarquable']
    }
  }

  const scenarioAlternatives = alternatives[scenarioId as keyof typeof alternatives] || alternatives.simple
  return scenarioAlternatives[token] || ['le', 'un', 'ce']
}

const currentPredictions = computed(() => {
  if (currentTokenIndex.value === null) return []
  return predictionsByStep.value[currentTokenIndex.value] || []
})

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < tokenHistory.value.length - 1)

// Fonctions de contrôle
const startGeneration = () => {
  isGenerating.value = true
  isPaused.value = false
  currentTokenIndex.value = 0
  generatedTokens.value = []
  deletedTokens.value = []
  tokenHistory.value = [[]]
  historyIndex.value = 0
  generateNextToken()
}

const pauseGeneration = () => {
  isPaused.value = !isPaused.value
  if (!isPaused.value) {
    generateNextToken()
  }
}

const generateNextToken = () => {
  if (!isGenerating.value || isPaused.value) return

  setTimeout(() => {
    if (currentTokenIndex.value !== null) {
      const predictions = currentPredictions.value
      if (predictions.length > 0) {
        const selectedPrediction = predictions[0] // Prend le token le plus probable
        addToken(selectedPrediction.token)
      } else {
        stopGeneration()
      }
    }
  }, 1000)
}

const addToken = (token: string) => {
  generatedTokens.value.push(token)
  currentTokenIndex.value = currentTokenIndex.value !== null ? currentTokenIndex.value + 1 : 0
  
  // Mise à jour de l'historique
  const newHistory = generatedTokens.value.slice()
  historyIndex.value++
  tokenHistory.value = tokenHistory.value.slice(0, historyIndex.value).concat([newHistory])
  
  // Vérifier si on a atteint la fin de la phrase
  if (currentTokenIndex.value < predictionsByStep.value.length) {
    generateNextToken()
  } else {
    stopGeneration()
  }
}

const selectPrediction = (prediction: { token: string; probability: number }) => {
  if (isPaused.value) {
    addToken(prediction.token)
  }
}

const undoToken = () => {
  if (!canUndo.value) return
  
  historyIndex.value--
  const lastToken = generatedTokens.value.pop()
  if (lastToken) {
    deletedTokens.value.push(lastToken)
    currentTokenIndex.value = generatedTokens.value.length - 1
  }
}

const redoToken = () => {
  if (!canRedo.value) return
  
  historyIndex.value++
  const nextState = tokenHistory.value[historyIndex.value]
  const newToken = nextState[nextState.length - 1]
  generatedTokens.value = nextState
  deletedTokens.value = deletedTokens.value.filter(t => t !== newToken)
  currentTokenIndex.value = generatedTokens.value.length - 1
}

const stopGeneration = () => {
  isGenerating.value = false
  isPaused.value = false
  currentTokenIndex.value = null
}

const resetGeneration = () => {
  isGenerating.value = false
  isPaused.value = false
  currentTokenIndex.value = null
  generatedTokens.value = []
  deletedTokens.value = []
  tokenHistory.value = []
  historyIndex.value = -1
}
</script>

<style scoped>
.generation-highlight {
  @apply ring-2 ring-primary transition-all duration-300;
}

.probability-bar {
  @apply transition-all duration-300;
}
</style> 