<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-7xl mx-auto">
      <CardHeader class="pb-4 border-b">
        <div class="flex justify-between items-start">
          <div>
            <CardTitle>Traitement des Données par l'IA</CardTitle>
            <CardDescription>
              Visualisation du processus de compréhension du texte
            </CardDescription>
          </div>
          <Button variant="outline" @click="showInfo = true">
            En savoir plus
          </Button>
        </div>
      </CardHeader>

      <div class="p-6">
        <!-- Section supérieure : Sélection et texte -->
        <div class="mb-8 space-y-6">
          <!-- Sélection du scénario -->
          <div>
            <h3 class="text-lg font-medium mb-4">Scénarios</h3>
            <div class="flex gap-4">
              <Button 
                v-for="scenario in scenarios" 
                :key="scenario.id"
                variant="outline"
                :class="{ 'bg-primary text-primary-foreground': currentScenario === scenario.id }"
                @click="selectScenario(scenario.id)"
              >
                {{ scenario.name }}
              </Button>
            </div>
          </div>

          <!-- Exemple de texte -->
          <div>
            <h3 class="text-lg font-medium mb-2">Texte d'exemple</h3>
            <div class="bg-muted p-4 rounded-lg">
              <p class="text-lg">{{ getCurrentScenarioData.text }}</p>
            </div>
            <p class="text-sm text-muted-foreground mt-2">{{ getCurrentScenarioData.description }}</p>
          </div>

          <!-- Tokenisation -->
          <div>
            <h3 class="text-lg font-medium mb-4">Tokenisation</h3>
            <div class="flex flex-wrap gap-2 justify-center">
              <div v-for="token in tokens" :key="token" 
                   class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 rounded-md text-sm">
                {{ token }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section inférieure : Grille 5 colonnes -->
        <div class="grid md:grid-cols-5 gap-8">
          <!-- Colonne gauche : Représentation vectorielle (2/5) -->
          <div class="md:col-span-2 space-y-4">
            <h3 class="text-lg font-medium">Représentation vectorielle</h3>
            <div class="bg-muted/50 rounded-lg p-4">
              <div class="space-y-2">
                <div v-for="vector in vectors" :key="vector.token" 
                     class="flex items-center justify-between p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md hover:shadow-md transition-shadow">
                  <span class="font-medium">{{ vector.token }}</span>
                  <span class="font-mono text-sm text-muted-foreground">
                    [{{ vector.values.map(v => v.toFixed(2)).join(', ') }}]
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne droite : Relations sémantiques (3/5) -->
          <div class="md:col-span-3 space-y-4">
            <h3 class="text-lg font-medium">Relations sémantiques</h3>
            <div class="bg-muted/50 rounded-lg p-4">
              <svg width="100%" height="300" class="semantic-graph">
                <!-- Nœuds -->
                <g v-for="node in semanticNodes" :key="node.id">
                  <circle
                    :cx="node.x"
                    :cy="node.y"
                    r="40"
                    class="fill-blue-100 hover:fill-blue-200 dark:fill-blue-900/20 dark:hover:fill-blue-900/30 cursor-pointer"
                  />
                  <text
                    :x="node.x"
                    :y="node.y"
                    text-anchor="middle"
                    alignment-baseline="middle"
                    class="text-sm font-medium pointer-events-none"
                  >
                    {{ node.label }}
                  </text>
                </g>
                <!-- Liens -->
                <g>
                  <line
                    v-for="(link, index) in semanticLinks"
                    :key="index"
                    :x1="link.source.x"
                    :y1="link.source.y"
                    :x2="link.target.x"
                    :y2="link.target.y"
                    class="stroke-blue-300 dark:stroke-blue-700"
                    stroke-width="2"
                  />
                  <text
                    v-for="(link, index) in semanticLinks"
                    :key="'label-' + index"
                    :x="(link.source.x + link.target.x) / 2"
                    :y="(link.source.y + link.target.y) / 2 - 10"
                    text-anchor="middle"
                    class="text-xs fill-muted-foreground"
                  >
                    {{ link.label }}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Modal d'information -->
    <Dialog v-model:open="showInfo">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comment l'IA comprend le texte</DialogTitle>
          <DialogDescription>
            Explication détaillée du processus de traitement
          </DialogDescription>
        </DialogHeader>
        <div class="prose dark:prose-invert mt-4">
          <h3>Le processus en 3 étapes</h3>
          <ol>
            <li>
              <strong>Tokenisation</strong> : Le texte est découpé en unités de sens (tokens)
            </li>
            <li>
              <strong>Vectorisation</strong> : Chaque token est converti en vecteur numérique
            </li>
            <li>
              <strong>Relations sémantiques</strong> : Le modèle établit des liens entre les concepts
            </li>
          </ol>
        </div>
        <DialogFooter>
          <Button @click="showInfo = false">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const showInfo = ref(false)

interface ScenarioData {
  id: string
  name: string
  text: string
  description: string
  tokens: string[]
  vectors: Array<{
    token: string
    values: number[]
  }>
  semanticNodes: Array<{
    id: number
    label: string
    x: number
    y: number
  }>
  semanticLinks: Array<{
    source: { x: number; y: number }
    target: { x: number; y: number }
    label: string
  }>
}

// Définition des scénarios
const scenarios: ScenarioData[] = [
{
    id: 'computer_science',
    name: 'Intelligence Artificielle',
    text: 'L\'intelligence artificielle transforme rapidement notre société',
    tokens: ['L\'', 'intelligence', 'artificielle', 'transform', 'e', 'rapid', 'ement', 'notre', 'société'],
    vectors: [
      { token: 'L\'', values: [0.1, 0.1, 0.1] },
      { token: 'intelligence', values: [0.8, 0.6, 0.7] },
      { token: 'artificielle', values: [0.9, 0.7, 0.8] },
      { token: 'transform', values: [0.7, 0.8, 0.6] },
      { token: 'e', values: [0.1, 0.1, 0.1] },
      { token: 'rapid', values: [0.6, 0.7, 0.5] },
      { token: 'ement', values: [0.2, 0.3, 0.2] },
      { token: 'notre', values: [0.3, 0.4, 0.3] },
      { token: 'société', values: [0.7, 0.8, 0.7] }
    ],
    semanticNodes: [
      { id: 1, label: 'intelligence artificielle', x: 150, y: 100 },
      { id: 2, label: 'transforme', x: 300, y: 100 },
      { id: 3, label: 'société', x: 450, y: 100 },
      { id: 4, label: 'rapidement', x: 300, y: 200 }
    ],
    semanticLinks: [
      {
        source: { x: 150, y: 100 },
        target: { x: 300, y: 100 },
        label: '0.9 (sujet-verbe)'
      },
      {
        source: { x: 300, y: 100 },
        target: { x: 450, y: 100 },
        label: '0.8 (verbe-objet)'
      },
      {
        source: { x: 300, y: 100 },
        target: { x: 300, y: 200 },
        label: '0.7 (modification)'
      }
    ]
  },
  {
    id: 'science',
    name: 'Découverte Scientifique',
    text: 'Les chercheurs ont découvert une nouvelle particule subatomique fascinante',
    tokens: ['Les', 'cherch', 'eurs', 'ont', 'découvert', 'une', 'nouvelle', 'particule', 'sub', 'atom', 'ique', 'fascin', 'ante'],
    vectors: [
      { token: 'Les', values: [0.2, 0.1, 0.1] },
      { token: 'cherch', values: [0.7, 0.6, 0.6] },
      { token: 'eurs', values: [0.3, 0.2, 0.2] },
      { token: 'ont', values: [0.2, 0.2, 0.1] },
      { token: 'découvert', values: [0.8, 0.7, 0.7] },
      { token: 'une', values: [0.1, 0.1, 0.1] },
      { token: 'nouvelle', values: [0.6, 0.5, 0.5] },
      { token: 'particule', values: [0.8, 0.8, 0.7] },
      { token: 'sub', values: [0.5, 0.6, 0.5] },
      { token: 'atom', values: [0.7, 0.7, 0.6] },
      { token: 'ique', values: [0.2, 0.2, 0.2] },
      { token: 'fascin', values: [0.6, 0.7, 0.5] },
      { token: 'ante', values: [0.2, 0.3, 0.2] }
    ],
    semanticNodes: [
      { id: 1, label: 'chercheurs', x: 150, y: 100 },
      { id: 2, label: 'découvert', x: 300, y: 100 },
      { id: 3, label: 'particule', x: 450, y: 100 },
      { id: 4, label: 'subatomique', x: 450, y: 200 },
      { id: 5, label: 'fascinante', x: 600, y: 150 }
    ],
    semanticLinks: [
      {
        source: { x: 150, y: 100 },
        target: { x: 300, y: 100 },
        label: '0.8 (agent)'
      },
      {
        source: { x: 300, y: 100 },
        target: { x: 450, y: 100 },
        label: '0.9 (objet)'
      },
      {
        source: { x: 450, y: 100 },
        target: { x: 450, y: 200 },
        label: '0.8 (qualification)'
      },
      {
        source: { x: 450, y: 100 },
        target: { x: 600, y: 150 },
        label: '0.7 (description)'
      }
    ]
  }
]

const currentScenario = ref('computer_science')

const getCurrentScenarioData = computed(() => {
  return scenarios.find(s => s.id === currentScenario.value) || scenarios[0]
})

// Mise à jour des refs avec les données du scénario
const tokens = computed(() => getCurrentScenarioData.value.tokens)
const vectors = computed(() => getCurrentScenarioData.value.vectors)
const semanticNodes = computed(() => getCurrentScenarioData.value.semanticNodes)
const semanticLinks = computed(() => getCurrentScenarioData.value.semanticLinks)

const selectScenario = (id: string) => {
  currentScenario.value = id
}
</script>

<style scoped>
.semantic-graph {
  overflow: visible;
}

/* Animations améliorées */
circle {
  transition: all 0.3s ease;
}

circle:hover {
  fill-opacity: 0.8;
  transform: scale(1.1);
}

line {
  transition: all 0.3s ease;
}

text {
  user-select: none;
}

/* Animations pour les transitions de scénarios */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Animation pour les vecteurs */
.vector-bar {
  transition: width 0.3s ease;
}

/* Animation pour les boutons */
.button-hover {
  transition: all 0.2s ease;
}

.button-hover:hover {
  transform: translateY(-2px);
}
</style> 