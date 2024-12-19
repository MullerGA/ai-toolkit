<template>
  <div class="space-y-8">
    <!-- Introduction -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <p class="text-base leading-relaxed">
          La <span class="font-medium">première étape</span> du traitement d'un texte par un 
          <span class="font-medium">LLM</span> est la <span class="font-medium">tokenisation</span> : 
          le découpage du texte en <span class="italic">unités élémentaires</span> appelées 
          "<span class="font-medium text-primary">tokens</span>". Ces tokens peuvent être des 
          <span class="italic">mots entiers</span>, des <span class="italic">parties de mots</span>, 
          ou même des <span class="italic">caractères individuels</span>.
        </p>
      </CardContent>
    </Card>

    <!-- Sélection du texte à analyser -->
    <div>
      
      <div class="flex gap-3">
        <Button
          v-for="s in scenarios"
          :key="s.id"
          variant="outline"
          class="button-scenario"
          :class="{ 'active': currentScenario === s.id }"
          @click="$emit('update:scenario', s.id)"
        >
          {{ s.name }}
        </Button>
      </div>
    </div>

    <!-- Processus de tokenisation -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6 space-y-6">
        <!-- Texte original -->
        <div class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-primary/10 transition-all hover:shadow-md">
          <h4 class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium flex items-center gap-2 text-primary">
              <DocumentTextIcon class="h-4 w-4" />
              Texte Original
            </span>
            <span class="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              {{ getWordCount }} mots
            </span>
          </h4>
          <p class="text-lg font-medium leading-relaxed">{{ currentScenarioData.input }}</p>
        </div>

        <!-- Flèche animée -->
        <div class="flex justify-center">
          <div class="tokenization-arrow">
            <ArrowDownIcon class="h-6 w-6 text-primary" />
          </div>
        </div>

        <!-- Zone de tokenisation -->
        <div class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-primary/10 transition-all hover:shadow-md">
          <h4 class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium flex items-center gap-2 text-primary">
              <CodeBracketIcon class="h-4 w-4" />
              Décomposition en Tokens
            </span>
            <span class="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              {{ tokens.length }} tokens
            </span>
          </h4>
          <div class="flex flex-wrap gap-3">
            <div v-for="(token, index) in tokens" 
                 :key="index"
                 class="token-box">
              <span class="token-content">{{ token }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Points clés -->
    <div class="grid md:grid-cols-2 gap-6">
      <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
        <CardHeader class="border-b bg-slate-100 dark:bg-slate-700/50">
          <CardTitle class="text-lg flex items-center gap-2">
            <LightBulbIcon class="h-4 w-4 text-yellow-500" />
            Saviez-vous ?
          </CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <p class="text-sm leading-relaxed">
            Les LLMs modernes utilisent des sous-mots comme tokens.
            Par exemple, "incroyable" pourrait être divisé en "in" + "croyable",
            ce qui aide le modèle à comprendre les parties composantes des mots.
          </p>
        </CardContent>
      </Card>

      <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
        <CardHeader class="border-b bg-slate-100 dark:bg-slate-700/50">
          <CardTitle class="text-lg flex items-center gap-2">
            <KeyIcon class="h-4 w-4 text-primary" />
            Points Clés
          </CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <ul class="space-y-2 text-sm">
            <li class="flex items-start gap-2">
              <CheckCircleIcon class="h-4 w-4 text-green-500 mt-0.5" />
              <span>La tokenisation est la première étape cruciale du traitement</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircleIcon class="h-4 w-4 text-green-500 mt-0.5" />
              <span>Elle permet une meilleure compréhension de la structure des mots</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { 
  DocumentTextIcon, 
  ArrowRightIcon, 
  CodeBracketIcon,
  LightBulbIcon,
  KeyIcon,
  CheckCircleIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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

// Ajouter l'état pour le token sélectionné
const selectedToken = ref<string | null>(null)

// Fonction pour sélectionner un token
const selectToken = (token: string) => {
  selectedToken.value = token
}

// Fonction pour obtenir le type de token
const getTokenType = (token: string) => {
  // Logique simple pour déterminer le type
  if (token.length === 1) return 'Caractère'
  if (token.match(/^[A-Z]/)) return 'Début de phrase'
  if (token.match(/[.,!?]/)) return 'Ponctuation'
  return 'Mot'
}

// Fonction pour obtenir la fréquence simulée
const getTokenFrequency = (token: string) => {
  const frequencies = {
    'Le': 'Très élevée',
    'la': 'Très élevée',
    'chat': 'Moyenne',
    'dort': 'Faible',
    'sur': 'Élevée',
    'le': 'Très élevée',
    'tapis': 'Faible'
  }
  return frequencies[token as keyof typeof frequencies] || 'Moyenne'
}

// Fonction pour obtenir une couleur cohérente pour les tokens liés
const getTokenColor = (token: string, index: number) => {
  const colors = [
    'rgb(var(--primary))',
    'rgb(59, 130, 246)', // blue-500
    'rgb(16, 185, 129)', // emerald-500
    'rgb(236, 72, 153)', // pink-500
    'rgb(245, 158, 11)'  // amber-500
  ];
  
  // Logique pour grouper les tokens du même mot
  const baseWord = token.toLowerCase().replace(/[^a-z]/g, '');
  const colorIndex = baseWord.length % colors.length;
  
  return colors[colorIndex];
};
</script>

<style scoped>
.token-chip {
  @apply px-2 py-1 bg-primary/10 text-primary rounded-md 
         hover:bg-primary/20 transition-colors;
}

.token-button {
  @apply px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 
         transition-all duration-200 hover:scale-105 active:scale-95;
}

.token-selected {
  @apply ring-2 ring-primary ring-offset-2 ring-offset-background;
}

/* Animation de la flèche */
.arrow-container {
  position: relative;
  width: 100%;
  height: 40px;
}

.arrow-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: currentColor;
  transform: translateY(-50%);
  opacity: 0.2;
}

.process-step {
  position: relative;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Style pour les boutons de scénario */
.button-scenario {
  @apply transition-all duration-200;
}

.button-scenario.active {
  @apply bg-primary text-primary-foreground;
}

/* Styles pour les tokens */
.token-box {
  @apply relative px-3 py-2 rounded-md font-mono text-sm
         bg-primary/10 text-primary font-medium
         border border-primary/20 shadow-sm
         transition-all duration-300
         hover:bg-primary/15 hover:border-primary/30;
}

.token-content {
  @apply relative z-10;
}

/* Animation de la flèche */
.tokenization-arrow {
  @apply relative flex items-center justify-center h-8;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* Transition entre les exemples */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 