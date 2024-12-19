<template>
  <div class="min-h-screen bg-[#f8f9fa] dark:bg-[#1a1a1a]">
    <div class="container mx-auto px-4 py-8">
      <Card v-if="!isLoading" class="w-full max-w-7xl mx-auto">
        <CardHeader class="pb-4 border-b">
          <div class="flex justify-between items-start">
            <div>
              <CardTitle>L'Entonnoir de Décision LLM</CardTitle>
              <CardDescription>
                L'entonnoir de décision illustre comment un LLM filtre et sélectionne ses réponses.
                Découvrez l'impact de chaque paramètre sur la génération de texte.
              </CardDescription>
            </div>
            <Button variant="outline" @click="showInfo = true">
              En savoir plus
            </Button>
          </div>
        </CardHeader>

        <!-- Grille principale -->
        <div class="grid md:grid-cols-12 gap-8 p-6">
          <!-- Colonne de gauche : Contrôles -->
          <div class="md:col-span-3 space-y-8">
            <!-- Sélection du scénario -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium mb-2">Scénario</h3>
              <CardContent class="border rounded-lg bg-muted/50 p-4 shadow-sm">
                <div class="flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    :class="{ 'bg-primary text-primary-foreground': selectedScenario === 'horse' }"
                    @click="selectScenario('horse')"
                  >
                    Scénario Animal
                  </Button>
                  <Button 
                    variant="outline"
                    :class="{ 'bg-primary text-primary-foreground': selectedScenario === 'italy' }"
                    @click="selectScenario('italy')"
                  >
                    Scénario Voyage
                  </Button>
                  <Button 
                    variant="outline"
                    :class="{ 'bg-primary text-primary-foreground': selectedScenario === 'recipe' }"
                    @click="selectScenario('recipe')"
                  >
                    Génération de Recette
                  </Button>
                </div>
              </CardContent>
            </div>

            <!-- Remplacer la section des contrôles -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium mb-2">Paramètres</h3>
              <CardContent class="border rounded-lg p-6 shadow-sm">
                <ParameterControls
                  v-model:temperature="temperature"
                  v-model:topK="topK"
                  v-model:topP="topP"
                />
              </CardContent>
            </div>

            <!-- Distribution initiale -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium mb-2">Distribution initiale des mots</h3>
              <CardContent class="border rounded-lg p-4 shadow-sm">
                <ScrollArea class="h-[300px]">
                  <div class="space-y-2 pr-4">
                    <div v-for="token in baseTokens" :key="token.token" 
                         class="text-sm px-3 py-2 hover:bg-muted/50 rounded-md">
                      <div class="flex justify-between items-center mb-1">
                        <span class="font-medium">{{ token.token }}</span>
                        <span class="text-muted-foreground">{{ (token.prob * 100).toFixed(1) }}%</span>
                      </div>
                      <!-- Barre de progression -->
                      <div class="w-full bg-muted/30 rounded-full h-1.5">
                        <div class="bg-primary h-full rounded-full transition-all duration-300"
                             :style="{ width: `${token.prob * 100}%` }">
                        </div>
                      </div>
                      <!-- Description en dessous -->
                      <p class="text-xs text-muted-foreground mt-1">
                        {{ token.description }}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </div>
          </div>

          <!-- Colonne centrale : Visualisation -->
          <div class="md:col-span-6">
            <!-- Phrase d'exemple avec résultat -->
            <CardContent class="pb-6">
              <div class="w-full bg-muted p-6 rounded-lg shadow-sm">
                <div class="flex flex-col gap-4">
                  <div>
                    <p class="text-lg font-medium">
                      {{ currentScenario.prompt }}
                      <span class="blink-cursor mx-1">|</span>
                      <span v-if="displayedWord" class="relative inline-flex items-center">
                        <span class="typing-effect text-primary font-bold px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
                          <span class="selection-animation">{{ displayedWord }}</span>
                        </span>
                      </span>
                      <span v-else class="text-primary font-bold"> ...</span>
                    </p>
                    <p class="text-sm text-muted-foreground mt-4">
                      {{ currentScenario.description }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <!-- Analyse préliminaire repliable -->
            <CardContent class="pb-6">
              <Collapsible>
                <CollapsibleTrigger class="flex items-center gap-2 text-sm hover:text-primary w-full mb-2">
                  <ChevronRightIcon
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-90': isAnalysisOpen }"
                  />
                  <span class="font-medium">Analyse Préliminaire</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <PreFunnelView 
                    :input_tokens="currentScenario.input_tokens"
                    class="w-full"
                  />
                </CollapsibleContent>
              </Collapsible>
            </CardContent>

            <!-- Entonnoir -->
            <CardContent>
              <div class="w-full h-[600px] bg-card rounded-lg border shadow-sm relative">
                <svg viewBox="0 0 400 400" class="w-full h-full">
                  <!-- Entonnoir avec animation de pulse -->
                  <path
                    :d="getFunnelPath"
                    fill="#e2e8f0"
                    stroke="#64748b"
                    stroke-width="2"
                    class="funnel-path"
                  />

                  <!-- Points représentant les tokens avec animation de chute -->
                  <template v-for="(level, levelIndex) in tokenLevels" :key="levelIndex">
                    <circle
                      v-for="(point, i) in level"
                      :key="`${levelIndex}-${i}`"
                      :cx="point.x"
                      :cy="point.y"
                      r="4"
                      :fill="point.color"
                      class="token-point"
                      :style="{
                        '--delay': `${i * 0.1}s`,
                        '--level': levelIndex
                      }"
                    >
                      <title>{{ point.title }}</title>
                    </circle>
                  </template>

                  <!-- Ajouter des effets visuels pour les filtres -->
                  <g class="filter-effects">
                    <path
                      v-for="(filter, index) in filterEffects"
                      :key="index"
                      :d="filter.path"
                      :stroke="filter.color"
                      class="filter-line"
                      stroke-width="1"
                      fill="none"
                    />
                  </g>
                </svg>

                <!-- Légende améliorée -->
                <div class="absolute top-4 right-4 bg-background/80 p-4 rounded-lg shadow-sm">
                  <div class="space-y-3">
                    <div class="flex items-center gap-2">
                      <span class="inline-block w-3 h-3 rounded-full bg-[#93c5fd]"></span>
                      <div>
                        <p class="text-sm font-medium">Après température</p>
                        <p class="text-xs text-muted-foreground">
                          {{ filteredTokens.afterTemp.length }} mots
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="inline-block w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                      <div>
                        <p class="text-sm font-medium">Après Top K</p>
                        <p class="text-xs text-muted-foreground">
                          {{ filteredTokens.afterTopK.length }} mots
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="inline-block w-3 h-3 rounded-full bg-[#1d4ed8]"></span>
                      <div>
                        <p class="text-sm font-medium">Après Top P</p>
                        <p class="text-xs text-muted-foreground">
                          {{ filteredTokens.afterTopP.length }} mots
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          <!-- Colonne de droite : Résultats -->
          <div class="md:col-span-3">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-medium mb-2">Résultats</h3>
                <div class="relative inline-block group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="h-5 w-5 p-0 hover:bg-transparent"
                  >
                    <InformationCircleIcon 
                      class="h-4 w-4 text-muted-foreground group-hover:text-primary"
                    />
                    <span class="sr-only">Information sur les résultats</span>
                  </Button>
                  
                  <!-- Tooltip -->
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover/90 backdrop-blur-sm text-popover-foreground text-xs rounded-lg shadow-lg w-48 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                    Observez comment les différents paramètres influencent la distribution des probabilités et les choix finaux du modèle.
                  </div>
                </div>
              </div>
              <CardContent class="h-full border rounded-lg p-6 shadow-sm">
                <ScrollArea class="h-[700px]">
                  <div class="space-y-4 p-4">
                    <!-- Résultats après température -->
                    <div class="space-y-2">
                      <h3 class="font-medium flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-[#93c5fd]"></span>
                        Après température ({{ temperature.toFixed(2) }})
                      </h3>
                      <div class="space-y-2">
                        <div v-for="token in sortedTempTokens.slice(0, 6)" :key="token.token" 
                             class="text-sm px-3 py-2 rounded hover:bg-muted">
                          <div class="flex justify-between items-center mb-1">
                            <span class="font-medium">{{ token.token }}</span>
                            <span class="text-muted-foreground">{{ (token.prob * 100).toFixed(1) }}%</span>
                          </div>
                          <div class="w-full bg-muted/30 rounded-full h-1.5">
                            <div class="bg-[#93c5fd] h-full rounded-full transition-all duration-300"
                                 :style="{ width: `${token.prob * 100}%` }">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Résultats après Top K -->
                    <div class="space-y-2">
                      <h3 class="font-medium flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                        Après Top K ({{ topK }})
                      </h3>
                      <div class="space-y-2">
                        <div v-for="token in sortedTopKTokens.slice(0, 6)" :key="token.token" 
                             class="text-sm px-3 py-2 rounded hover:bg-muted">
                          <div class="flex justify-between items-center mb-1">
                            <span class="font-medium">{{ token.token }}</span>
                            <span class="text-muted-foreground">{{ (token.prob * 100).toFixed(1) }}%</span>
                          </div>
                          <div class="w-full bg-muted/30 rounded-full h-1.5">
                            <div class="bg-[#3b82f6] h-full rounded-full transition-all duration-300"
                                 :style="{ width: `${token.prob * 100}%` }">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Résultats après Top P -->
                    <div class="space-y-2">
                      <h3 class="font-medium flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-[#1d4ed8]"></span>
                        Après Top P ({{ topP.toFixed(2) }})
                      </h3>
                      <div class="space-y-2">
                        <div v-for="token in sortedTopPTokens.slice(0, 6)" :key="token.token" 
                             class="text-sm px-3 py-2 rounded hover:bg-muted">
                          <div class="flex justify-between items-center mb-1">
                            <span class="font-medium">{{ token.token }}</span>
                            <span class="text-muted-foreground">{{ (token.prob * 100).toFixed(1) }}%</span>
                          </div>
                          <div class="w-full bg-muted/30 rounded-full h-1.5">
                            <div class="bg-[#1d4ed8] h-full rounded-full transition-all duration-300"
                                 :style="{ width: `${token.prob * 100}%` }">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>

      <Dialog v-model:open="showInfo">
        <DialogContent class="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>L'Entonnoir de Décision LLM : Documentation Complète</DialogTitle>
            <DialogDescription>
              Comprendre le processus complet de génération de texte par les LLMs
            </DialogDescription>
          </DialogHeader>

          <div class="prose dark:prose-invert mt-4">
            <h2>Vue d'ensemble</h2>
            <p>
              Un LLM (Large Language Model) fonctionne comme un système de prédiction probabiliste complexe. 
              Pour la phrase "Il court au galop, c'est un...", le modèle passe par plusieurs étapes de 
              traitement avant de proposer une réponse.
            </p>

            <h2>Le processus complet</h2>

            <h3>Analyse contextuelle</h3>
            <ul>
              <li>Tokenisation du texte d'entrée</li>
              <li>Analyse du contexte précédent</li>
              <li>Identification des relations sémantiques</li>
              <li>Application de l'attention sur les éléments pertinents</li>
            </ul>

            <h3>Génération des probabilités brutes</h3>
            <ul>
              <li>Création d'un vecteur de scores pour chaque token possible</li>
              <li>Identification des tokens pertinents dans le contexte</li>
              <li>Calcul des scores d'attention pour chaque token</li>
            </ul>

            <h3>Application du Softmax</h3>
            <ul>
              <li>Transformation des scores bruts en probabilités</li>
              <li>Normalisation pour que la somme = 1</li>
              <li>Distribution initiale créée</li>
            </ul>

            <h3>Pruning (élagage)</h3>
            <ul>
              <li>Élimination des tokens non pertinents</li>
              <li>Réduction drastique de l'espace des possibles</li>
              <li>Conservation uniquement des tokens contextuellement cohérents</li>
            </ul>

            <h3>Paramètres de contrôle</h3>
            <div class="pl-4 border-l-4 border-gray-200">
              <h4>Temperature</h4>
              <ul>
                <li>Modifie la distribution des probabilités</li>
                <li>Impact sur la "créativité" des choix</li>
                <li>Formule : P(x) = exp(logits/T) / Σ exp(logits/T)</li>
              </ul>

              <h4>Top K</h4>
              <ul>
                <li>Sélection des K tokens les plus probables</li>
                <li>Limite stricte sur le nombre de choix</li>
                <li>Réduit l'espace des possibles</li>
              </ul>

              <h4>Top P (Nucleus Sampling)</h4>
              <ul>
                <li>Sélection basée sur la probabilité cumulée</li>
                <li>Garde les tokens jusqu'à atteindre le seuil P</li>
                <li>Adaptation dynamique selon le contexte</li>
              </ul>
            </div>

            <h3>Sélection finale</h3>
            <ul>
              <li>Tirage aléatoire pondéré</li>
              <li>Respect des probabilités ajustées</li>
              <li>Génération de la réponse</li>
            </ul>

            <h2>Exemple détaillé : "Il court au galop, c'est un..."</h2>

            <h3>Traitement initial</h3>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <p class="font-bold">Contexte identifié :</p>
              <ul>
                <li>Action : courir au galop</li>
                <li>Champ lexical : mouvement, vitesse</li>
                <li>Domaine : animaux</li>
              </ul>
            </div>

            <h3>Distribution initiale (après Softmax)</h3>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <pre class="text-sm">
cheval    : 0.35  | Cumul: 0.35
étalon    : 0.25  | Cumul: 0.60
poney     : 0.12  | Cumul: 0.72
pur-sang  : 0.08  | Cumul: 0.80
...
              </pre>
            </div>

            <h3>Application des paramètres</h3>
            <div class="space-y-4">
              <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
                <p class="font-bold">Temperature (0.7):</p>
                <ul>
                  <li>Conserve une distribution relativement naturelle</li>
                  <li>Légère augmentation des probabilités plus faibles</li>
                </ul>
              </div>

              <div class="bg-green-50 dark:bg-green-900 p-4 rounded-md">
                <p class="font-bold">Top K (5):</p>
                <ul>
                  <li>Ne garde que les 5 premiers tokens</li>
                  <li>Élimine tous les tokens après "mustang"</li>
                </ul>
              </div>

              <div class="bg-purple-50 dark:bg-purple-900 p-4 rounded-md">
                <p class="font-bold">Top P (0.8):</p>
                <ul>
                  <li>Garde les tokens jusqu'à probabilité cumulée de 0.8</li>
                  <li>Dans notre cas : cheval, étalon, poney, pur-sang</li>
                </ul>
              </div>
            </div>

            <h3>Sélection finale</h3>
            <ul>
              <li>Tirage aléatoire pondéré parmi les tokens restants</li>
              <li>Probabilités relatives respectées</li>
              <li>Exemple : "cheval" a ~61.8% de chances d'être choisi</li>
            </ul>

            <h2>Limitations de notre visualisation</h2>
            <p>Notre interface simplifie certains aspects :</p>
            <ul>
              <li>Ne montre pas le processus de tokenisation</li>
              <li>Simplifie l'analyse contextuelle</li>
              <li>Ne visualise pas l'attention</li>
              <li>Ne montre pas les embeddings</li>
              <li>Simplifie le pruning initial</li>
            </ul>

            <h2>Pour aller plus loin</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h3>Aspects avancés non couverts</h3>
                <ul>
                  <li>Attention layers et leur impact</li>
                  <li>Embeddings et espace vectoriel</li>
                  <li>Biais du modèle</li>
                  <li>Impact du contexte étendu</li>
                  <li>Optimisations techniques</li>
                  <li>Techniques d'échantillonnage avancées</li>
                </ul>
              </div>

              <div>
                <h3>Concepts connexes</h3>
                <ul>
                  <li>Beam search</li>
                  <li>Greedy decoding</li>
                  <li>Température dynamique</li>
                  <li>Échantillonnage typique</li>
                  <li>Pénalités de répétition</li>
                </ul>
              </div>
            </div>

            <h2>Approches de génération de texte</h2>
            <div class="space-y-4">
              <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
                <h4 class="font-bold">Génération standard (Temperature/Top-K/Top-P)</h4>
                <ul>
                  <li>Considère plusieurs possibilités à chaque étape</li>
                  <li>Utilise un tirage aléatoire pondéré</li>
                  <li>Plus "créatif" et naturel</li>
                </ul>
              </div>

              <div class="bg-green-50 dark:bg-green-900 p-4 rounded-md">
                <h4 class="font-bold">Greedy Decoding</h4>
                <ul>
                  <li>Prend TOUJOURS le token le plus probable</li>
                  <li>Équivalent à Temperature = 0 ou Top-K = 1</li>
                  <li>Déterministe (même résultat à chaque fois)</li>
                </ul>
              </div>

              <div class="bg-purple-50 dark:bg-purple-900 p-4 rounded-md">
                <h4 class="font-bold">Beam Search</h4>
                <ul>
                  <li>Maintient plusieurs chemins possibles en parallèle</li>
                  <li>Explore plusieurs séquences simultanément</li>
                  <li>Plus coûteux mais souvent plus robuste</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button @click="showInfo = false">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/vue/24/solid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import PreFunnelView from '@/components/PreFunnelView.vue'
import ParameterControls from '@/components/ParameterControls.vue'

const isOpen = ref(false)
const isAnalysisOpen = ref(false)
const wordChangeInterval = ref<number | null>(null)

const temperature = ref(0.7)
const topK = ref(5)
const topP = ref(0.8)

interface Token {
  token: string;
  prob: number;
  description?: string;
}

interface InputWord {
  word: string;
  tokens: string[];
}

interface Prediction {
  word: string;
  prob: number;
  description: string;
}

interface Scenario {
  id: string;
  prompt: string;
  description: string;
  input_tokens: InputWord[];
  predictions: Prediction[];
}

// Définition des scénarios
const scenarios: Record<string, Scenario> = {
  horse: {
    id: 'horse',
    prompt: 'Il court au galop, c\'est un',
    description: 'Prédiction du type d\'animal en fonction du contexte',
    input_tokens: [
      { word: "Il", tokens: ["Il"] },
      { word: "court", tokens: ["court"] },
      { word: "au", tokens: ["au"] },
      { word: "galop", tokens: ["gal", "op"] },
      { word: ",", tokens: [","] },
      { word: "c'est", tokens: ["c'", "est"] },
      { word: "un", tokens: ["un"] }
    ],
    predictions: [
      { word: "cheval", prob: 0.35, description: "Animal le plus probable dans ce contexte" },
      { word: "étalon", prob: 0.25, description: "Spécification masculine du cheval" },
      { word: "poney", prob: 0.12, description: "Variante plus petite" },
      { word: "pur-sang", prob: 0.08, description: "Race spécifique" },
      { word: "mustang", prob: 0.05, description: "Type de cheval sauvage" },
      { word: "coursier", prob: 0.04, description: "Synonyme plus littéraire" },
      { word: "canasson", prob: 0.03, description: "Terme familier" },
      { word: "destrier", prob: 0.02, description: "Terme historique" },
      { word: "palomino", prob: 0.015, description: "Couleur spécifique" },
      { word: "yearling", prob: 0.01, description: "Jeune cheval" },
      { word: "zèbre", prob: 0.008, description: "Autre équidé" },
      { word: "lièvre", prob: 0.007, description: "Autre animal rapide" },
      { word: "guépard", prob: 0.005, description: "Animal rapide mais moins probable" },
      { word: "kangourou", prob: 0.003, description: "Animal qui bondit" },
      { word: "centaure", prob: 0.002, description: "Créature mythologique" }
    ]
  },
  italy: {
    id: 'italy',
    prompt: 'Pour votre séjour en Italie en juillet, nous vous recommandons de visiter',
    description: 'Recommandation de destination en fonction de la saison',
    input_tokens: [
      { word: "Pour", tokens: ["Pour"] },
      { word: "votre", tokens: ["vot", "re"] },
      { word: "séjour", tokens: ["sé", "jour"] },
      { word: "en", tokens: ["en"] },
      { word: "Italie", tokens: ["Ital", "ie"] },
      { word: "en", tokens: ["en"] },
      { word: "juillet", tokens: ["juill", "et"] },
      { word: ",", tokens: [","] },
      { word: "nous", tokens: ["nous"] },
      { word: "vous", tokens: ["vous"] },
      { word: "recommandons", tokens: ["recomm", "and", "ons"] },
      { word: "de", tokens: ["de"] },
      { word: "visiter", tokens: ["visit", "er"] }
    ],
    predictions: [
      { word: "Rome", prob: 0.30, description: "Capitale, centre historique majeur" },
      { word: "Florence", prob: 0.20, description: "Centre de la Renaissance" },
      { word: "Venise", prob: 0.15, description: "Unique, très touristique en été" },
      { word: "Cinque Terre", prob: 0.08, description: "Idéal en été, côte pittoresque" },
      { word: "Toscane", prob: 0.06, description: "Région viticole et culturelle" },
      { word: "Naples", prob: 0.05, description: "Gastronomie et histoire" },
      { word: "Côte Amalfitaine", prob: 0.04, description: "Destination balnéaire prisée" },
      { word: "Sicile", prob: 0.03, description: "Grande île, riche en histoire" },
      { word: "Sardaigne", prob: 0.025, description: "Plages magnifiques, moins touristique" },
      { word: "Bologne", prob: 0.02, description: "Centre gastronomique" },
      { word: "Matera", prob: 0.015, description: "Ville troglodyte unique" },
      { word: "Pouilles", prob: 0.01, description: "Région authentique émergente" },
      { word: "Lac de Côme", prob: 0.008, description: "Destination luxe" },
      { word: "Gênes", prob: 0.005, description: "Port historique" },
      { word: "Dolomites", prob: 0.002, description: "Montagnes, moins adapté en été" }
    ]
  },
  recipe: {
    id: 'recipe',
    prompt: 'Pour cette recette de gâteau, commencez par',
    description: 'Génération d\'instructions culinaires',
    input_tokens: [
      { word: "Pour", tokens: ["Pour"] },
      { word: "cette", tokens: ["cette"] },
      { word: "recette", tokens: ["rec", "ette"] },
      { word: "de", tokens: ["de"] },
      { word: "gâteau", tokens: ["gât", "eau"] },
      { word: ",", tokens: [","] },
      { word: "commencez", tokens: ["commenc", "ez"] },
      { word: "par", tokens: ["par"] }
    ],
    predictions: [
      { word: "préchauffer", prob: 0.40, description: "Préparation du four" },
      { word: "mélanger", prob: 0.25, description: "Incorporation des ingrédients" },
      { word: "préparer", prob: 0.15, description: "Organisation initiale" },
      { word: "battre", prob: 0.08, description: "Travail des œufs" },
      { word: "tamiser", prob: 0.04, description: "Affinage de la farine" },
      { word: "beurrer", prob: 0.03, description: "Préparation du moule" },
      { word: "peser", prob: 0.02, description: "Mesure précise" },
      { word: "sortir", prob: 0.01, description: "Mise à température" },
      { word: "fouetter", prob: 0.008, description: "Aération de la pâte" },
      { word: "rassembler", prob: 0.007, description: "Collecte des ingrédients" },
      { word: "chemiser", prob: 0.005, description: "Protection du moule" },
      { word: "chauffer", prob: 0.004, description: "Préparation thermique" },
      { word: "vérifier", prob: 0.003, description: "Contrôle des ingrédients" },
      { word: "couper", prob: 0.002, description: "Préparation des fruits" },
      { word: "fondre", prob: 0.001, description: "Préparation du chocolat" }
    ]
  },

};

const selectedScenario = ref('horse')
const currentScenario = computed(() => scenarios[selectedScenario.value])

// Pour l'affichage des tokens dans PreFunnelView
const inputTokens = computed(() => {
  return currentScenario.value.input_tokens.flatMap(word => 
    word.tokens.map(token => ({
      text: token,
      word: word.word
    }))
  );
});

// Pour l'entonnoir et les filtres
const baseTokens = computed(() => {
  return currentScenario.value.predictions.map(pred => ({
    token: pred.word,
    prob: pred.prob,
    description: pred.description
  }));
});

// Pour les résultats de prédiction
const predictions = computed(() => {
  return currentScenario.value.predictions;
});

// Mise à jour du filtrage pour les prédictions
const filteredTokens = computed(() => {
  const afterTemp = applyTemperature(predictions.value, temperature.value);
  const afterTopK = applyTopK(afterTemp, topK.value);
  const afterTopP = applyTopP(afterTopK, topP.value);

  return {
    afterTemp,
    afterTopK,
    afterTopP
  };
});

// Calcul du chemin de l'entonnoir avec des dimensions plus larges
const getFunnelPath = computed(() => {
  const topWidth = 300 * (0.5 + temperature.value/2) // Augmenté de 200 à 300
  const midWidth = Math.min(topWidth * 0.8, 240 * (topK.value/10)) // Augmenté de 160 à 240
  const bottomWidth = Math.min(midWidth * 0.8, 180 * topP.value) // Augmenté de 120 à 180
  
  return `
    M ${200 - topWidth/2},50 
    C ${200 - topWidth/2},50 ${200 - midWidth/2},150 ${200 - midWidth/2},150
    L ${200 + midWidth/2},150
    C ${200 + midWidth/2},150 ${200 + topWidth/2},50 ${200 + topWidth/2},50 Z
    
    M ${200 - midWidth/2},150
    C ${200 - midWidth/2},150 ${200 - bottomWidth/2},250 ${200 - bottomWidth/2},250
    L ${200 + bottomWidth/2},250
    C ${200 + bottomWidth/2},250 ${200 + midWidth/2},150 ${200 + midWidth/2},150 Z
    
    M ${200 - bottomWidth/2},250
    C ${200 - bottomWidth/2},250 ${200 - 30},350 ${200 - 30},350
    L ${200 + 30},350
    C ${200 + 30},350 ${200 + bottomWidth/2},250 ${200 + bottomWidth/2},250 Z
  `
})

// Mise à jour de la visualisation des tokens
const tokenLevels = computed(() => {
  const getPointsInEllipse = (tokens: Token[], centerY: number, radiusX: number) => {
    if (tokens.length === 0) return []
    
    return tokens.map((token, i) => {
      const angle = (i * (2 * Math.PI / tokens.length)) + (Math.PI / 2)
      const adjustedRadius = radiusX * (0.3 + 0.4 * token.prob)
      
      return {
        x: 200 + Math.cos(angle) * adjustedRadius,
        y: centerY + Math.sin(angle) * (radiusX * 0.15),
        color: '#3b82f6',
        title: getTokenTooltip(token)
      }
    })
  }

  const topWidth = 300 * (0.5 + temperature.value/2)
  const midWidth = Math.min(topWidth * 0.8, 240 * (topK.value/10))
  const bottomWidth = Math.min(midWidth * 0.8, 180 * topP.value)

  return [
    getPointsInEllipse(filteredTokens.value.afterTemp, 80, topWidth * 0.3)
      .map(p => ({ ...p, color: '#93c5fd' })),
    getPointsInEllipse(filteredTokens.value.afterTopK, 180, midWidth * 0.3)
      .map(p => ({ ...p, color: '#3b82f6' })),
    getPointsInEllipse(filteredTokens.value.afterTopP, 280, bottomWidth * 0.3)
      .map(p => ({ ...p, color: '#1d4ed8' }))
  ]
})

// Tri des tokens par probabilité
const sortedTempTokens = computed(() => 
  [...filteredTokens.value.afterTemp].sort((a, b) => b.prob - a.prob)
)

const sortedTopKTokens = computed(() => 
  [...filteredTokens.value.afterTopK].sort((a, b) => b.prob - a.prob)
)

const sortedTopPTokens = computed(() => 
  [...filteredTokens.value.afterTopP].sort((a, b) => b.prob - a.prob)
)

// Ajout d'un état de chargement
const isLoading = ref(true)

// État pour la dialog
const showInfo = ref(false)

const filterEffects = computed(() => {
  const effects = []
  const levels = [150, 250, 350] // Y positions des filtres

  // Effet pour la température
  effects.push({
    path: `M 100,${levels[0]} Q 200,${levels[0] + 20} 300,${levels[0]}`,
    color: '#93c5fd'
  })

  // Effet pour le Top K
  effects.push({
    path: `M 120,${levels[1]} Q 200,${levels[1] - 20} 280,${levels[1]}`,
    color: '#3b82f6'
  })

  // Effet pour le Top P
  effects.push({
    path: `M 140,${levels[2]} Q 200,${levels[2] + 20} 260,${levels[2]}`,
    color: '#1d4ed8'
  })

  return effects
})

// Ajouter ces fonctions avant les computed properties

// Fonction pour appliquer la température aux probabilités
const applyTemperature = (tokens: Prediction[], temp: number): Token[] => {
  if (temp <= 0.1) {
    // Cas très conservateur : on retourne uniquement le token le plus probable
    const maxToken = [...tokens].sort((a, b) => b.prob - a.prob)[0];
    return [{
      token: maxToken.word,
      prob: 1,
      description: maxToken.description
    }];
  }

  // Appliquer la température
  const logits = tokens.map(t => Math.log(t.prob));
  const scaledLogits = logits.map(l => l / temp);
  const maxLogit = Math.max(...scaledLogits);
  
  // Calcul du softmax avec température
  const expLogits = scaledLogits.map(l => Math.exp(l - maxLogit));
  const sumExp = expLogits.reduce((a, b) => a + b, 0);
  const newProbs = expLogits.map(exp => exp / sumExp);

  // Retourner les tokens avec leurs nouvelles probabilités
  return tokens.map((t, i) => ({
    token: t.word,
    prob: newProbs[i],
    description: t.description
  }));
};

// Fonction pour appliquer le filtrage Top-K
const applyTopK = (tokens: Token[], k: number): Token[] => {
  // Trier par probabilité décroissante et prendre les k premiers
  const topK = [...tokens]
    .sort((a, b) => b.prob - a.prob)
    .slice(0, k);
  
  // Renormaliser les probabilités
  const sum = topK.reduce((acc, t) => acc + t.prob, 0);
  return topK.map(t => ({
    ...t,
    prob: t.prob / sum
  }));
};

// Fonction pour appliquer le filtrage Top-P (nucleus sampling)
const applyTopP = (tokens: Token[], p: number): Token[] => {
  // Trier par probabilité décroissante
  const sorted = [...tokens].sort((a, b) => b.prob - a.prob);
  
  // Calculer les probabilités cumulées
  let cumSum = 0;
  const selected: Token[] = [];
  
  for (const token of sorted) {
    cumSum += token.prob;
    selected.push(token);
    if (cumSum >= p) break;
  }
  
  // Renormaliser les probabilités
  const sum = selected.reduce((acc, t) => acc + t.prob, 0);
  return selected.map(t => ({
    ...t,
    prob: t.prob / sum
  }));
};

// Fonction utilitaire pour le tooltip
const getTokenTooltip = (token: Token) => {
  const percentage = (token.prob * 100).toFixed(1);
  return `${token.token} (${percentage}%)${token.description ? `\n${token.description}` : ''}`;
};

// Ajouter un ref pour le mot actuellement affiché
const displayedWord = ref<string | null>(null);

// Modifier le computed selectedWord pour qu'il retourne seulement les mots possibles
const selectedWords = computed(() => {
  const currentTokens = filteredTokens.value.afterTopP;
  if (currentTokens.length === 0) return [];
  
  return currentTokens.map(token => ({
    word: token.token,
    probability: token.prob
  }));
});

// Ajouter une fonction utilitaire pour la sélection pondérée
const weightedRandomChoice = (words: { word: string, probability: number }[]) => {
  const totalProb = words.reduce((sum, w) => sum + w.probability, 0);
  const randomPoint = Math.random() * totalProb;
  
  let accumulator = 0;
  for (const word of words) {
    accumulator += word.probability;
    if (randomPoint <= accumulator) {
      return word.word;
    }
  }
  
  // Fallback au premier mot si jamais on n'a rien trouvé
  return words[0].word;
};

// Ajouter la fonction selectRandomWord
const selectRandomWord = () => {
  if (selectedWords.value.length === 0) {
    displayedWord.value = null;
    return;
  }

  // Sélection aléatoire pondérée
  displayedWord.value = weightedRandomChoice(selectedWords.value);
};

// Modifier le watcher pour utiliser des délais plus longs
watch([temperature, topK, topP], () => {
  if (wordChangeInterval.value) {
    clearInterval(wordChangeInterval.value);
  }

  // Phase 1 : Plusieurs sélections rapides
  const phase1 = setInterval(() => {
    selectRandomWord();
  }, 200); // Toutes les 200ms

  // Après 1.5 secondes, passer à la phase 2
  setTimeout(() => {
    clearInterval(phase1);
    
    // Phase 2 : Sélections plus lentes
    const phase2 = setInterval(() => {
      selectRandomWord();
    }, 400); // Toutes les 400ms
    
    // Après 1 seconde supplémentaire, faire la sélection finale
    setTimeout(() => {
      clearInterval(phase2);
      selectRandomWord(); // Sélection finale
    }, 1000);
    
  }, 1500);
}, { immediate: true });

// Nettoyer l'intervalle lors du démontage du composant
onUnmounted(() => {
  if (wordChangeInterval.value) {
    clearInterval(wordChangeInterval.value);
  }
});

// Après la définition des scénarios et avant les computed properties
const selectScenario = (scenario: string) => {
  if (scenarios[scenario]) {
    selectedScenario.value = scenario;
    // Réinitialiser les paramètres à leurs valeurs par défaut
    temperature.value = 0.7;
    topK.value = 5;
    topP.value = 0.8;
  }
};

onMounted(() => {
  isLoading.value = false
})

onUnmounted(() => {
  // Plus besoin de cleanup d'animation
})
</script>

<style scoped>
.token-point {
  animation: 
    gentle-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite,
    fall-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: var(--delay);
}

@keyframes fall-in {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation de l'entonnoir */
.funnel-path {
  animation: funnel-pulse 2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes funnel-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}

/* Effet des filtres */
.filter-line {
  animation: filter-wave 2s ease-in-out infinite;
  stroke-dasharray: 10;
  opacity: 0.5;
}

@keyframes filter-wave {
  0% { stroke-dashoffset: 20; }
  100% { stroke-dashoffset: 0; }
}

/* Transition pour les changements de paramètres */
.parameter-change {
  transition: all 0.3s ease-in-out;
}

/* Animation pour les nouveaux tokens */
.token-enter-active,
.token-leave-active {
  transition: all 0.3s ease-out;
}

.token-enter-from,
.token-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Ajout d'animations pour les transitions */
.text-sm {
  transition: all 0.2s ease-in-out;
}

/* Animation pour les nouveaux tokens */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-1 > * {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Animation pour le changement de scénario */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles pour la dialog */
:deep(.dialog-content) {
  @apply prose prose-sm dark:prose-invert max-w-none;
}

/* Ajustements spécifiques pour la prose dans la dialog */
:deep(.prose) {
  @apply prose-headings:mb-3 prose-p:mb-3 prose-ul:mb-3 prose-ol:mb-3;
}

/* Modification des styles des cartes pour plus de contraste */
:deep(.card) {
  @apply bg-white dark:bg-[#1e1e1e] shadow-sm border-0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Amélioration du contraste pour les éléments de l'interface */
:deep(.bg-muted) {
  @apply bg-gray-50 dark:bg-gray-800;
}

:deep(.border) {
  @apply border-gray-100 dark:border-gray-800;
}

/* Effet de typing */
.typing-effect {
  position: relative;
  display: inline-block;
}

.cursor {
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 70%;
  background-color: currentColor;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

/* Animation de shimmer pour la barre de progression */
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Transition fluide pour les changements de probabilité */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.selection-animation {
  display: inline-block;
  animation: selection 0.3s ease-in-out;
}

@keyframes selection {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  50% {
    opacity: 0.5;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modifier l'animation du curseur pour qu'elle soit plus visible */
.cursor {
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 70%;
  background-color: currentColor;
  animation: blink 0.7s step-end infinite;
}

.blink-cursor {
  display: inline-block;
  color: currentColor;
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style> 