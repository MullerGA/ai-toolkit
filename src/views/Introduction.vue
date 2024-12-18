<template>
  <div class="relative">
    <!-- Overlay de flou -->
    <div 
      v-if="store.isFocusMode" 
      class="fixed inset-0 backdrop-blur-sm bg-black/10 z-[1]"
    ></div>
    
    <div class="container mx-auto px-4 py-8">
      <Card 
        :class="[
          'w-full mx-auto transition-all duration-300',
          store.isFocusMode ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] z-[10] bg-white' : 'max-w-7xl'
        ]"
      >
        <!-- En-tête -->
        <CardHeader v-show="!store.isFocusMode" class="border-b pb-6">
          <div class="flex justify-between items-start">
            <div>
              <CardTitle>Introduction Générale aux LLM</CardTitle>
              <CardDescription class="text-sm mt-2">
                Découvrez les concepts fondamentaux des modèles de langage et leurs applications concrètes
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" @click="showInfo = true">
              Guide du module
            </Button>
          </div>
        </CardHeader>

        <!-- Contenu Principal -->
        <div 
          class="space-y-12" 
          :class="{ 
            'px-8': !store.isFocusMode, 
            'p-6': store.isFocusMode 
          }"
        >
          <section 
            id="llm-definition" 
            :class="[
              'transition-all duration-300',
              store.isFocusMode && store.currentSection === 0 ? 'active-section z-[10]' : '',
              store.isFocusMode && store.currentSection !== 0 ? 'inactive-section' : ''
            ]"
          >
            <!-- Section 1: Qu'est-ce qu'un LLM ? -->
            <section class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                </div>
                <h2 class="text-2xl font-semibold">Qu'est-ce qu'un LLM ?</h2>
              </div>

              <div class="space-y-8">
                <!-- Définition principale -->
                <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
                  <CardContent class="p-6">
                    <p class="text-sm leading-relaxed space-y-2">
                      Un <span class="font-medium">LLM</span> 
                      (<span class="italic">Large Language Model</span>) est un 
                      <span class="font-medium">système d'intelligence artificielle</span> qui a 
                      <span class="italic">"appris"</span> à partir d'une 
                      <span class="font-medium">quantité massive de textes</span>, capable de 
                      <span class="font-medium">comprendre</span> et 
                      <span class="font-medium">générer</span> du contenu de manière 
                      <span class="font-medium">contextuelle</span> et 
                      <span class="font-medium">adaptative</span>.
                    </p>
                  </CardContent>
                </Card>

                <!-- Comparaison visuelle -->
                <div class="grid md:grid-cols-2 gap-6">
                  <Card class="bg-slate-50 dark:bg-slate-800/50 overflow-hidden transition-all hover:shadow-md">
                    <CardHeader class="border-b bg-slate-100 dark:bg-slate-700/50">
                      <CardTitle class="text-lg">Système Expert Traditionnel</CardTitle>
                      <CardDescription class="text-sm text-slate-600 dark:text-slate-400">
                        Optimisé pour des tâches spécifiques avec une logique prédéfinie
                      </CardDescription>
                    </CardHeader>
                    <CardContent class="p-6">
                      <div class="aspect-square relative w-[200px] mx-auto mb-4">
                        <!-- Animation arbre de décision -->
                        <div class="tree-animation w-full h-full">
                          <svg class="w-full h-full" viewBox="0 0 200 200">
                            <path class="tree-line" d="M100,20 L100,50" stroke="currentColor" stroke-width="2"/>
                            <path class="tree-line" d="M100,50 L60,90" stroke="currentColor" stroke-width="2"/>
                            <path class="tree-line" d="M100,50 L140,90" stroke="currentColor" stroke-width="2"/>
                            <path class="tree-line" d="M60,90 L40,130" stroke="currentColor" stroke-width="2"/>
                            <path class="tree-line" d="M60,90 L80,130" stroke="currentColor" stroke-width="2"/>
                            <path class="tree-line" d="M140,90 L120,130" stroke="currentColor" stroke-width="2"/>
                            <path class="tree-line" d="M140,90 L160,130" stroke="currentColor" stroke-width="2"/>
                            
                            <circle class="tree-node" cx="100" cy="50" r="6" fill="currentColor"/>
                            <circle class="tree-node" cx="60" cy="90" r="6" fill="currentColor"/>
                            <circle class="tree-node" cx="140" cy="90" r="6" fill="currentColor"/>
                            <circle class="tree-node" cx="40" cy="130" r="6" fill="currentColor"/>
                            <circle class="tree-node" cx="80" cy="130" r="6" fill="currentColor"/>
                            <circle class="tree-node" cx="120" cy="130" r="6" fill="currentColor"/>
                            <circle class="tree-node" cx="160" cy="130" r="6" fill="currentColor"/>
                          </svg>
                        </div>
                        <div class="absolute bottom-4 left-0 right-0 text-center text-sm text-slate-600 dark:text-slate-300">
                          Structure rigide et hiérarchique
                        </div>
                      </div>
                      <!-- Ajouter les points forts -->
                      <div class="space-y-2 mt-4">
                        <h4 class="font-medium text-sm text-slate-700 dark:text-slate-300">Points forts :</h4>
                        <ul class="text-sm space-y-1">
                          <li class="flex items-center gap-2">
                            <span class="i-lucide-check text-green-500" />
                            <span>Précision extrême dans leur domaine</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <span class="i-lucide-check text-green-500" />
                            <span>Résultats prévisibles et fiables</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <span class="i-lucide-check text-green-500" />
                            <span>Parfait pour les processus critiques</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card class="bg-slate-50 dark:bg-slate-800/50 overflow-hidden transition-all hover:shadow-md">
                    <CardHeader class="border-b bg-slate-100 dark:bg-slate-700/50">
                      <CardTitle class="text-lg">Large Language Model</CardTitle>
                      <CardDescription class="text-sm text-slate-600 dark:text-slate-400">
                        Adaptable à de multiples contextes avec une compréhension nuancée
                      </CardDescription>
                    </CardHeader>
                    <CardContent class="p-6">
                      <div class="aspect-square relative w-[200px] mx-auto mb-4">
                        <div class="network-animation w-full h-full">
                          <svg class="w-full h-full" viewBox="0 0 200 200">
                            <g class="nodes"></g>
                          </svg>
                        </div>
                        <div class="absolute bottom-4 left-0 right-0 text-center text-sm text-slate-600 dark:text-slate-300">
                          Réseau flexible et interconnecté
                        </div>
                      </div>
                      <!-- Ajouter les points forts -->
                      <div class="space-y-2 mt-4">
                        <h4 class="font-medium text-sm text-slate-700 dark:text-slate-300">Points forts :</h4>
                        <ul class="text-sm space-y-1">
                          <li class="flex items-center gap-2">
                            <span class="i-lucide-check text-green-500" />
                            <span>Polyvalence et adaptabilité</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <span class="i-lucide-check text-green-500" />
                            <span>Compréhension du contexte</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <span class="i-lucide-check text-green-500" />
                            <span>Apprentissage continu</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </section>

          <section 
            id="llm-evolution"
            :class="[
              'transition-all duration-300',
              store.isFocusMode && store.currentSection === 1 ? 'active-section z-[10]' : '',
              store.isFocusMode && store.currentSection !== 1 ? 'inactive-section' : ''
            ]"
          >
            <!-- Nouvelle section: Évolution des LLM -->
            <section class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 font-semibold">2</span>
                </div>
                <h2 class="text-2xl font-semibold">Évolution des LLM</h2>
              </div>

              <div class="space-y-8">
                <!-- Texte d'introduction sur l'évolution -->
                <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
                  <CardContent class="p-6">
                    <p class="text-sm leading-relaxed space-y-2">
                      L'évolution des <span class="font-medium">LLM</span> représente une 
                      <span class="font-medium">progression fulgurante</span> sur une période 
                      particulièrement courte. En seulement <span class="font-medium">quelques années</span>, 
                      nous sommes passés de modèles aux <span class="italic">capacités limitées</span> à des 
                      <span class="font-medium">assistants sophistiqués</span>, marquant une 
                      <span class="font-medium">accélération sans précédent</span> dans l'histoire de 
                      l'intelligence artificielle.
                    </p>
                  </CardContent>
                </Card>

                <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
                  <CardHeader class="pb-2">
                    <CardTitle class="text-lg">Les grandes étapes de l'évolution des LLM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="w-full px-6 py-4">
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex gap-2">
                          <Button 
                            @click="previousStep" 
                            :disabled="isPlaying || currentStepIndex <= -1"
                            variant="outline"
                            class="px-4 py-2"
                          >
                            Précédent
                          </Button>
                          <Button 
                            @click="nextStep" 
                            :disabled="isPlaying || currentStepIndex >= evolutionData.length"
                            variant="outline"
                            class="px-4 py-2"
                          >
                            Suivant
                          </Button>
                          <Button 
                            @click="showAllData" 
                            :disabled="isPlaying"
                            variant="outline"
                            class="px-4 py-2"
                          >
                            Voir tout
                          </Button>
                        </div>
                        <div 
                          class="text-lg min-h-[64px] min-w-[200px]"
                        >
                          <div 
                            v-if="currentStep" 
                            class="text-slate-700 dark:text-slate-300 animate-fade-in bg-slate-100 dark:bg-slate-800 p-2 rounded-lg"
                          >
                            <span class="font-semibold">{{ currentStep.model }}</span>
                            <p class="text-sm mt-0.5">{{ currentStep.description }}</p>
                          </div>
                        </div>
                      </div>

                      <div class="relative">
                        <canvas ref="chartContainer" class="w-full h-[300px]"></canvas>
                        <div v-if="hoveredPoint" 
                             class="absolute bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border"
                             :style="tooltipStyle">
                          <p class="font-medium">{{ hoveredPoint.model }}</p>
                          <p class="text-sm text-slate-600 dark:text-slate-300">{{ hoveredPoint.description }}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </section>

          <!-- Section Applications concrètes -->
          <section 
            id="llm-applications"
            :class="[
              'transition-all duration-300',
              store.isFocusMode && store.currentSection === 2 ? 'active-section z-[10]' : '',
              store.isFocusMode && store.currentSection !== 2 ? 'inactive-section' : ''
            ]"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 font-semibold">3</span>
              </div>
              <h2 class="text-2xl font-semibold">Applications concrètes</h2>
            </div>

            <div class="space-y-8">
              <!-- Texte d'introduction -->
              <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
                <CardContent class="p-6">
                  <p class="text-sm leading-relaxed space-y-2">
                    Les <span class="font-medium">LLM</span> révolutionnent de nombreux domaines grâce à leur 
                    <span class="font-medium">polyvalence</span> et leur capacité à 
                    <span class="font-medium">comprendre le contexte</span>. Voici les principaux 
                    <span class="italic">cas d'usage</span> qui transforment déjà notre façon de travailler.
                  </p>
                </CardContent>
              </Card>

              <!-- Modifier la grille des applications -->
              <div class="grid md:grid-cols-3 gap-6">
                <!-- Cards existantes et nouvelles -->
                <Card v-for="(app, index) in applications" :key="index" 
                      class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
                  <CardHeader class="border-b bg-slate-100 dark:bg-slate-700/50">
                    <CardTitle class="text-lg">{{ app.title }}</CardTitle>
                  </CardHeader>
                  <CardContent class="p-6">
                    <div class="space-y-4">
                      <p class="text-slate-600 dark:text-slate-300">{{ app.description }}</p>
                      <div class="pt-4 border-t">
                        <h4 class="font-medium text-sm mb-2">Gains potentiels :</h4>
                        <ul class="text-sm space-y-1">
                          <li v-for="(advantage, i) in app.advantages" :key="i" 
                              class="flex items-center gap-2">
                            <span class="i-lucide-check text-green-500" />
                            <span>{{ advantage }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <!-- Card d'invitation aux nouveaux usages -->
                <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md border-dashed border-2 border-blue-200 dark:border-blue-800">
                  <CardContent class="p-6 h-full flex flex-col items-center justify-center text-center">
                    <div class="space-y-4">
                      <span class="i-lucide-plus-circle text-4xl text-blue-500" />
                      <div>
                        <h3 class="text-lg font-medium mb-2">Votre prochain usage ?</h3>
                        <p class="text-slate-600 dark:text-slate-300">
                          Les possibilités sont infinies. Imaginez votre propre cas d'usage en fonction de vos besoins spécifiques.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <!-- Section Concepts clés -->
          <section 
            id="llm-concepts"
            :class="[
              'transition-all duration-300',
              store.isFocusMode && store.currentSection === 3 ? 'active-section z-[10]' : '',
              store.isFocusMode && store.currentSection !== 3 ? 'inactive-section' : ''
            ]"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 font-semibold">4</span>
              </div>
              <h2 class="text-2xl font-semibold">Concepts clés</h2>
            </div>

            <div class="space-y-8">
              <!-- Texte d'introduction -->
              <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
                <CardContent class="p-6">
                  <p class="text-sm leading-relaxed space-y-2">
                    Pour bien comprendre les <span class="font-medium">LLM</span>, il est essentiel de maîtriser certains 
                    <span class="font-medium">concepts fondamentaux</span> qui sont au cœur de leur 
                    <span class="italic">fonctionnement</span> et de leurs <span class="italic">capacités</span>.
                  </p>
                </CardContent>
              </Card>

              <!-- Concepts en grille -->
              <div class="grid md:grid-cols-3 gap-6">
                <Card v-for="(concept, index) in concepts" :key="index" 
                      class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
                  <CardHeader class="border-b bg-slate-100 dark:bg-slate-700/50">
                    <CardTitle class="text-lg">{{ concept.title }}</CardTitle>
                  </CardHeader>
                  <CardContent class="p-6">
                    <div class="space-y-4">
                      <p class="text-slate-600 dark:text-slate-300">{{ concept.description }}</p>
                      <div class="flex items-center justify-center pt-4">
                        <span class="text-3xl text-blue-500">
                          <!-- Icône appropriée pour chaque concept -->
                          <span v-if="index === 0" class="i-lucide-message-square" />
                          <span v-if="index === 1" class="i-lucide-database" />
                          <span v-if="index === 2" class="i-lucide-git-branch" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <!-- Note de conclusion (masquée en mode focus) -->
          <Card 
            v-show="!store.isFocusMode"
            class="bg-slate-50 dark:bg-slate-800/50 mt-4 transition-all hover:shadow-md"
          >
            <CardContent class="p-6">
              <div class="flex flex-col gap-4">
                <div class="flex items-start gap-3">
                  <span class="i-lucide-lightbulb text-yellow-500 mt-1 flex-shrink-0" />
                  <div class="space-y-2">
                    <p class="text-slate-600 dark:text-slate-300">
                      Cette introduction vous a présenté les bases des <span class="font-medium">LLM</span>. 
                      La suite du parcours vous permettra d'explorer en détail leur fonctionnement interne 
                      et les différentes manières d'interagir avec eux.
                    </p>
                  </div>
                </div>
                <div class="flex justify-end">
                  <Button 
                    variant="outline" 
                    class="flex items-center gap-2"
                    @click="scrollToTop"
                  >
                    <span class="i-lucide-arrow-up text-sm" />
                    Haut de page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>

    <PresentationControls v-show="store.isFocusMode" class="z-[20]" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Chart from 'chart.js/auto'
import { useRouter } from 'vue-router'
import { usePresentationStore } from '@/stores/presentation'
import PresentationControls from '@/components/PresentationControls.vue'

// Initialiser le store
const store = usePresentationStore()

const chartContainer = ref<HTMLCanvasElement | null>(null)
const hoveredPoint = ref<null | {
  model: string;
  description: string;
  x: number;
  y: number;
}>(null)

const tooltipStyle = computed(() => {
  if (!hoveredPoint.value) return {}
  return {
    left: `${hoveredPoint.value.x}px`,
    top: `${hoveredPoint.value.y - 100}px`,
    transform: 'translateX(-50%)',
    zIndex: 50
  }
})

const showInfo = ref(false)

const applications = [
  {
    title: "Assistance client",
    description: "Support 24/7, réponses personnalisées, traitement des requêtes courantes",
    advantages: [
      "Optimisation du temps de réponse client",
      "Amélioration de l'expérience utilisateur",
      "Rationalisation des coûts de support"
    ]
  },
  {
    title: "Analyse de documents",
    description: "Extraction d'informations, résumés automatiques, classification",
    advantages: [
      "Valorisation du patrimoine documentaire",
      "Accélération du traitement des données",
      "Identification de tendances cachées"
    ]
  },
  {
    title: "Aide à la rédaction",
    description: "Suggestions de contenu, correction, amélioration du style",
    advantages: [
      "Fluidification du processus rédactionnel",
      "Harmonisation des communications",
      "Renforcement de la qualité éditoriale"
    ]
  },
  {
    title: "Automatisation de processus",
    description: "Traitement des emails, génération de rapports, documentation",
    advantages: [
      "Réduction des tâches manuelles répétitives",
      "Optimisation des processus métier",
      "Recentrage sur les activités à valeur ajoutée"
    ]
  },
  {
    title: "Recherche augmentée",
    description: "Enrichissement des moteurs de recherche, compréhension des requêtes complexes, synthèse des résultats",
    advantages: [
      "Amélioration de la pertinence des résultats",
      "Contextualisation des recherches",
      "Synthèse multi-sources intelligente"
    ]
  }
]

const concepts = [
  {
    title: "Le langage naturel",
    description: "Capacité à comprendre et générer du texte comme un humain, avec nuances et contexte"
  },
  {
    title: "L'apprentissage sur les données",
    description: "Entraînement sur des millions de textes pour capturer patterns et connaissances"
  },
  {
    title: "La notion de contexte",
    description: "Compréhension du contexte pour des réponses pertinentes et cohérentes"
  }
]

const evolutionData = [
  { year: 2018, model: 'BERT / GPT-1', level: 0.5, description: 'Premiers pas vers la compréhension', current: true },
  { year: 2020, model: 'GPT-3', level: 1.2, description: 'Premier grand modèle généraliste', current: true },
  { year: 2022, model: 'ChatGPT', level: 2.8, description: 'Révolution de l\'interaction', current: true },
  { year: 2024, model: 'GPT-4 / Claude-3', level: 4.2, description: 'Assistant multicompétent', current: true },
  { year: 2025, model: 'Présent', level: 4.8, description: 'Aujourd\'hui', current: true }
]

const projectionData = [
  { year: 2026, level: 5.5 },
  { year: 2028, level: 6.3 },
  { year: 2030, level: 7.2 }
]

const currentStep = ref<typeof evolutionData[0] | null>(null)
const currentStepIndex = ref(-1)
const isPlaying = ref(false)
let chart: Chart | null = null

const createChart = (ctx: CanvasRenderingContext2D) => {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...evolutionData.map(d => d.year), ...projectionData.map(d => d.year)],
      datasets: [
        {
          label: 'Évolution réelle',
          data: [],  // Commencer avec un tableau vide
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          pointBackgroundColor: '#3b82f6',
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.4
        },
        {
          label: 'Projection optimiste',
          data: Array(evolutionData.length + projectionData.length).fill(null),
          borderColor: 'rgba(59, 130, 246, 0.2)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: '+1',
          pointRadius: 0,
          tension: 0
        },
        {
          label: 'Projection pessimiste',
          data: Array(evolutionData.length + projectionData.length).fill(null),
          borderColor: 'rgba(59, 130, 246, 0.2)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: true,
        mode: 'nearest'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              const dataIndex = context.dataIndex
              if (dataIndex < evolutionData.length) {
                const data = evolutionData[dataIndex]
                return `${data.model}: ${data.description}`
              }
              return `Projection: ${context.formattedValue}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 7.5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              const levels = [
                '',
                'Traitement basique du texte',
                'Compréhension contextuelle',
                'Interaction conversationnelle',
                'Raisonnement avancé',
                'Intelligence généraliste',
                'Super-Intelligence',
                'Au-delà'
              ]
              return levels[Math.round(value as number)] || ''
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return this.getLabelForValue(value as number)
            },
            stepSize: 2
          }
        }
      }
    }
  })
}

const previousStep = async () => {
  if (currentStepIndex.value <= -1) return
  
  currentStepIndex.value--
  currentStep.value = currentStepIndex.value >= 0 ? evolutionData[currentStepIndex.value] : null
  
  if (chart) {
    const newData = currentStepIndex.value >= 0 
      ? evolutionData.slice(0, currentStepIndex.value + 1).map(d => d.level)
      : []
    
    chart.data.datasets[0].data = [
      ...newData,
      ...Array(evolutionData.length + projectionData.length - newData.length).fill(null)
    ]
    chart.data.datasets[1].data = Array(evolutionData.length + projectionData.length).fill(null)
    chart.data.datasets[2].data = Array(evolutionData.length + projectionData.length).fill(null)
    chart.update('none')
  }
}

const nextStep = async () => {
  if (currentStepIndex.value >= evolutionData.length) return
  
  currentStepIndex.value++
  currentStep.value = evolutionData[currentStepIndex.value]
  
  if (chart) {
    const newData = evolutionData.slice(0, currentStepIndex.value + 1).map(d => d.level)
    chart.data.datasets[0].data = [
      ...newData,
      ...Array(evolutionData.length + projectionData.length - newData.length).fill(null)
    ]
    
    // Ajouter les projections à la dernière étape
    if (currentStepIndex.value === evolutionData.length - 1) {
      const optimisticProjection = evolutionData.map((d, i) => {
        if (i === evolutionData.length - 1) return d.level
        return null
      }).concat(projectionData.map((d, i) => {
        const lastRealPoint = evolutionData[evolutionData.length - 1].level
        const progressionRate = 1.2
        return lastRealPoint + ((i + 1) * progressionRate * (1 + i * 0.2))
      }))

      const pessimisticProjection = evolutionData.map((d, i) => {
        if (i === evolutionData.length - 1) return d.level
        return null
      }).concat(projectionData.map((d, i) => {
        const lastRealPoint = evolutionData[evolutionData.length - 1].level
        const progressionRate = 0.4
        return lastRealPoint + ((i + 1) * progressionRate * (1 + i * 0.1))
      }))

      chart.data.datasets[1].data = optimisticProjection
      chart.data.datasets[2].data = pessimisticProjection
    }
    
    chart.update('none')
  }
}

const showAllData = async () => {
  try {
    currentStepIndex.value = evolutionData.length - 1
    currentStep.value = null
    
    await nextTick()
    
    if (!chart) {
      console.warn('Chart not initialized')
      return
    }

    chart.data.datasets[0].data = evolutionData.map(d => d.level)
    chart.data.datasets[1].data = evolutionData.map((d, i) => {
      if (i === evolutionData.length - 1) return d.level
      return null
    }).concat(projectionData.map((d, i) => {
      const lastRealPoint = evolutionData[evolutionData.length - 1].level
      const progressionRate = 1.2
      return lastRealPoint + ((i + 1) * progressionRate * (1 + i * 0.2))
    }))

    chart.data.datasets[2].data = evolutionData.map((d, i) => {
      if (i === evolutionData.length - 1) return d.level
      return null
    }).concat(projectionData.map((d, i) => {
      const lastRealPoint = evolutionData[evolutionData.length - 1].level
      const progressionRate = 0.4
      return lastRealPoint + ((i + 1) * progressionRate * (1 + i * 0.1))
    }))

    chart.update()
  } catch (error) {
    console.error('Error in showAllData:', error)
  }
}

onMounted(async () => {
  try {
    if (!chartContainer.value) return
    const ctx = chartContainer.value.getContext('2d')
    if (!ctx) return
    
    chart = createChart(ctx)
    currentStepIndex.value = -1
    await nextStep() // Afficher le premier point
  } catch (error) {
    console.error('Error initializing chart:', error)
  }
})

const drawModelLabels = () => {
  if (!chart || !chart.ctx || !chart.chartArea) return
  
  const ctx = chart.ctx
  evolutionData.forEach((data, index) => {
    const meta = chart.getDatasetMeta(0)
    if (!meta || !meta.data[index]) return
    
    const point = meta.data[index]
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.font = '12px sans-serif'
    ctx.fillStyle = data.current ? '#3b82f6' : 'rgba(59, 130, 246, 0.6)'
    ctx.fillText(data.model, point.x, point.y - 15)
    ctx.restore()
  })
}

// Ajouter ces interfaces au début du script
interface Point {
  x: number;
  y: number;
}

interface Connection {
  from: Point;
  to: Point;
  strength: number;
}

// Modifier la fonction generateNetworkPoints
const generateNetworkPoints = (): { points: Point[]; connections: Connection[] } => {
  const points: Point[] = []
  const connections: Connection[] = []
  
  // Générer plus de points avec une meilleure distribution
  for (let i = 0; i < 15; i++) {
    // Distribution plus naturelle des points
    const angle = (i / 15) * Math.PI * 2
    const radius = 30 + Math.random() * 40 // Variation du rayon pour plus de naturel
    const x = 100 + Math.cos(angle) * radius
    const y = 100 + Math.sin(angle) * radius
    
    points.push({ x, y })
  }
  
  // Ajouter quelques points centraux
  points.push({ x: 100, y: 100 }) // Point central
  points.push({ x: 90, y: 95 })   // Points autour du centre
  points.push({ x: 110, y: 105 })
  
  // Créer plus de connexions pour un réseau plus dense
  points.forEach((point, i) => {
    points.forEach((otherPoint, j) => {
      if (i !== j) {
        const distance = Math.sqrt(
          Math.pow(point.x - otherPoint.x, 2) + 
          Math.pow(point.y - otherPoint.y, 2)
        )
        // Augmenter la distance maximale de connexion
        if (distance < 70) {
          connections.push({
            from: point,
            to: otherPoint,
            strength: 1 - (distance / 70)
          })
        }
      }
    })
  })
  
  return { points, connections }
}

// Modifier la partie qui crée les éléments SVG
onMounted(() => {
  const { points, connections } = generateNetworkPoints()
  const svg = document.querySelector('.network-animation svg g')
  
  if (!svg) return
  
  // Ajouter d'abord les points
  points.forEach((point, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', point.x.toString())
    circle.setAttribute('cy', point.y.toString())
    const isCenter = Math.abs(point.x - 100) < 20 && Math.abs(point.y - 100) < 20
    circle.setAttribute('r', isCenter ? '6' : '4')
    circle.setAttribute('fill', 'currentColor')
    circle.classList.add('network-node')
    svg.appendChild(circle)
    
    // Ajouter la classe visible après un court délai
    setTimeout(() => {
      circle.classList.add('visible')
    }, index * 50)
  })
  
  // Ajouter ensuite les connexions
  connections.forEach((connection, index) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', connection.from.x.toString())
    line.setAttribute('y1', connection.from.y.toString())
    line.setAttribute('x2', connection.to.x.toString())
    line.setAttribute('y2', connection.to.y.toString())
    line.setAttribute('stroke', 'currentColor')
    line.setAttribute('stroke-width', (connection.strength * 1.5).toString())
    line.setAttribute('opacity', (connection.strength * 0.6).toString())
    line.classList.add('network-line')
    svg.appendChild(line)
  })
})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const router = useRouter()

const goToHomeModule = () => {
  router.push('/').then(() => {
    setTimeout(() => {
      const moduleElement = document.querySelector('[data-module="introduction"]')
      if (moduleElement) {
        moduleElement.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  })
}

// Gestion des raccourcis clavier
const handleKeydown = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return
  }
  
  switch (event.key.toLowerCase()) {
    case 'arrowright':
    case 'arrowdown':
      store.nextSection()
      break
    case 'arrowleft':
    case 'arrowup':
      store.previousSection()
      break
    case 'f':
      store.toggleFocusMode()
      break
    case 'escape':
      store.exitFocusMode()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Computed pour obtenir la section active
const currentSection = computed(() => {
  const sectionContent = document.querySelector(`#${store.sections[store.currentSection]} > section`)?.cloneNode(true)
  return sectionContent || null
})
</script>

<style scoped>
.prose {
  max-width: none;
}

/* Animation pour les cartes au hover */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.dot {
  transition: r 0.2s;
}

.dot:hover {
  r: 8;
}

.label {
  font-size: 12px;
}

.tooltip-custom {
  transition: all 0.2s ease;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Animations pour l'arbre */
.tree-line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawLine 1.5s ease forwards;
}

.tree-node {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 1.5s;
}

/* Animations pour le réseau */
.network-node {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.network-line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawLine 1.5s ease forwards;
  animation-delay: 0.5s;
  opacity: 0.4;
}

@keyframes drawLine {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulseNode {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Ajouter une animation de pulse après l'apparition */
.network-node.visible {
  animation: fadeIn 0.5s ease forwards, pulseNode 2s ease infinite 0.5s;
}

.tree-node.visible {
  animation: fadeIn 0.5s ease forwards, pulseNode 2s ease infinite 0.5s;
}

/* Styles pour le mode focus */
.active-section {
  position: relative;
  width: 100%;
  z-index: 15;
  margin: 0;
  padding: 1.5rem;
}

.inactive-section {
  display: none;
}

/* Styles pour la Card en mode focus */
.card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Ajustement des marges et espacements en mode focus */
.active-section :deep(.card) {
  margin-bottom: 1.5rem;
  height: 100%;
  background-color: rgb(248 250 252); /* bg-slate-50 */
  @apply shadow-sm hover:shadow-md transition-shadow;
}

/* Ajuster la grille en mode focus */
.active-section :deep(.grid) {
  gap: 1.5rem;
  @apply grid-cols-1 md:grid-cols-2;
  margin-bottom: 1.5rem;
}

/* Uniformiser les espacements des titres et contenus */
.active-section :deep(h2) {
  @apply text-2xl font-semibold mb-6;
}

.active-section :deep(.card-header) {
  @apply border-b bg-slate-100 dark:bg-slate-700/50 p-4;
}

.active-section :deep(.card-content) {
  @apply p-6;
}

/* Ajuster l'espacement des listes */
.active-section :deep(ul) {
  @apply space-y-2;
}

/* Uniformiser les marges des sections de contenu */
.active-section :deep(.space-y-8) {
  @apply space-y-4;
}

/* Ajuster la hauteur du graphique dans la section Évolution */
#llm-evolution :deep(.h-[300px]) {
  @apply h-[250px];
}

/* Optimiser l'espacement vertical */
.active-section :deep(.space-y-8) {
  @apply space-y-4;
}

/* Réduire les marges des cartes en mode focus */
.active-section :deep(.card) {
  margin: 1rem 0;
  height: 100%;
  background-color: rgb(248 250 252);
}

/* Ajustements spécifiques pour la section Applications */
#llm-applications :deep(.grid) {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}

/* Supprimer le margin-top des sections 2, 3 et 4 en mode focus */
#llm-evolution.active-section,
#llm-applications.active-section,
#llm-concepts.active-section {
  margin-top: 0;
}

/* Alignement du titre et du numéro */
.active-section :deep(.flex.items-center.gap-4) {
  @apply mb-8;
}

/* Style du conteneur du numéro */
.active-section :deep(.w-10.h-10.rounded-full) {
  @apply flex items-center justify-center flex-shrink-0;
}

/* Style du titre */
.active-section :deep(h2.text-2xl) {
  @apply my-0 flex items-center text-base font-medium;
  line-height: 40px;
}

/* Styles communs pour toutes les sections (mode standard) */
section .flex.items-center.gap-4 {
  @apply mb-8;
}

/* Alignement du numéro avec le titre */
section .w-10.h-10.rounded-full {
  @apply flex items-center justify-center flex-shrink-0;
}

/* Style uniforme des titres */
section h2.text-2xl {
  @apply my-0 flex items-center text-base font-medium;
  line-height: 40px;
}

/* Espacement consistant du contenu */
section .space-y-8 {
  @apply mt-8;
}

/* Espacement uniforme entre les sections */
section + section {
  @apply mt-16;
}

/* Ajustement de l'espacement après l'en-tête principal */
.card-header + div {
  @apply pt-12;
}

/* Ajustement de l'espacement de la première section */
#llm-definition {
  @apply mt-4;
}

/* Ajuster la taille du texte dans les cartes */
.card-content p {
  @apply text-sm leading-relaxed;
}

/* Ajuster les titres des cartes */
.card-header .card-title {
  @apply text-base;
}

/* Ajuster les descriptions */
.card-description {
  @apply text-xs;
}

/* Ajuster le texte des listes */
ul li {
  @apply text-xs;
}

/* Titre principal */
.card-header .card-title {
  @apply text-base;
}

/* Description principale */
.card-header .card-description {
  @apply text-xs;
}
</style> 