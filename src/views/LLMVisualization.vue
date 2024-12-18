<template>
  <div class="min-h-screen bg-[#f8f9fa] dark:bg-[#1a1a1a]">
    <div class="container mx-auto px-4 py-8">
      <Card v-if="!isLoading" class="w-full max-w-7xl mx-auto">
        <CardHeader class="pb-4 border-b">
          <div class="flex justify-between items-start">
            <div>
              <CardTitle>L'Entonnoir de Décision LLM</CardTitle>
              <CardDescription>
                Visualisez comment les paramètres influencent la génération de texte
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
                </div>
              </CardContent>
            </div>

            <!-- Contrôles -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium mb-2">Paramètres</h3>
              <CardContent class="border rounded-lg p-6 shadow-sm">
                <div class="space-y-8">
                  <div class="space-y-2">
                    <Label>Température: {{ temperature.toFixed(2) }}</Label>
                    <Slider
                      :model-value="[temperature]"
                      @update:model-value="value => temperature = value[0]"
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
                      @update:model-value="value => topK = value[0]"
                      :min="1"
                      :max="10"
                      :step="1"
                      class="w-full"
                    />
                    <p class="text-xs text-muted-foreground">
                      Limite le nombre de tokens
                    </p>
                  </div>

                  <div class="space-y-2">
                    <Label>Top P: {{ topP.toFixed(2) }}</Label>
                    <Slider
                      :model-value="[topP]"
                      @update:model-value="value => topP = value[0]"
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
              </CardContent>
            </div>

            <!-- Distribution initiale -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium mb-2">Données</h3>
              <CardContent class="border rounded-lg p-4 shadow-sm">
                <Collapsible>
                  <CollapsibleTrigger class="flex items-center gap-2 text-sm hover:text-primary w-full">
                    <ChevronRightIcon
                      class="h-4 w-4 transition-transform duration-200"
                      :class="{ 'rotate-90': isOpen }"
                    />
                    <span>Distribution initiale</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ScrollArea class="h-[200px] mt-4">
                      <div class="space-y-2 pr-4">
                        <div v-for="token in baseTokens" :key="token.token" 
                             class="text-sm flex justify-between items-center px-3 py-2 hover:bg-muted/50 rounded-md">
                          <span>{{ token.token }}</span>
                          <span>{{ (token.prob * 100).toFixed(1) }}%</span>
                        </div>
                      </div>
                    </ScrollArea>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </div>
          </div>

          <!-- Colonne centrale : Visualisation -->
          <div class="md:col-span-6">
            <!-- Phrase d'exemple -->
            <CardContent class="pb-6">
              <div class="bg-muted p-6 rounded-lg shadow-sm">
                <p class="text-lg font-medium">{{ currentScenario.prompt }}<span class="text-primary font-bold"> ...</span></p>
                <p class="text-sm text-muted-foreground mt-3">{{ currentScenario.description }}</p>
              </div>
            </CardContent>

            <!-- Entonnoir -->
            <CardContent>
              <div class="h-[600px] bg-card rounded-lg border shadow-sm relative">
                <svg viewBox="0 0 400 400" class="w-full h-full">
                  <!-- Entonnoir -->
                  <path
                    :d="getFunnelPath"
                    fill="#e2e8f0"
                    stroke="#64748b"
                    stroke-width="2"
                  />

                  <!-- Points représentant les tokens par niveau -->
                  <template v-for="(level, levelIndex) in tokenLevels" :key="levelIndex">
                    <circle
                      v-for="(point, i) in level"
                      :key="`${levelIndex}-${i}`"
                      :cx="point.x"
                      :cy="point.y"
                      r="4"
                      :fill="point.color"
                      class="token-point"
                    >
                      <title>{{ point.title }}</title>
                    </circle>
                  </template>
                </svg>

                <!-- Légende -->
                <div class="absolute top-4 right-4 bg-background/80 p-4 rounded-lg shadow-sm">
                  <div class="space-y-2">
                    <p class="text-sm">
                      <span class="inline-block w-3 h-3 rounded-full bg-[#93c5fd] mr-2"></span>
                      Après température: {{ filteredTokens.afterTemp.length }}
                    </p>
                    <p class="text-sm">
                      <span class="inline-block w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></span>
                      Après Top K: {{ filteredTokens.afterTopK.length }}
                    </p>
                    <p class="text-sm">
                      <span class="inline-block w-3 h-3 rounded-full bg-[#1d4ed8] mr-2"></span>
                      Après Top P: {{ filteredTokens.afterTopP.length }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          <!-- Colonne de droite : Résultats -->
          <div class="md:col-span-3">
            <div class="space-y-2">
              <h3 class="text-sm font-medium mb-2">Résultats</h3>
              <CardContent class="h-full border rounded-lg p-6 shadow-sm">
                <ScrollArea class="h-[700px]">
                  <div class="space-y-4 p-4">
                    <!-- Résultats après température -->
                    <div class="space-y-2">
                      <h3 class="font-medium flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-[#93c5fd]"></span>
                        Après température ({{ temperature.toFixed(2) }})
                      </h3>
                      <div class="space-y-1">
                        <div v-for="token in sortedTempTokens.slice(0, 6)" :key="token.token" 
                             class="text-sm flex justify-between px-2 py-1 rounded hover:bg-muted">
                          <span>{{ token.token }}</span>
                          <span class="text-muted-foreground">{{ (token.prob * 100).toFixed(1) }}%</span>
                        </div>
                      </div>
                    </div>

                    <!-- Résultats après Top K -->
                    <div class="space-y-2">
                      <h3 class="font-medium flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                        Après Top K ({{ topK }})
                      </h3>
                      <div class="space-y-1">
                        <div v-for="token in sortedTopKTokens.slice(0, 6)" :key="token.token" 
                             class="text-sm flex justify-between px-2 py-1 rounded hover:bg-muted">
                          <span>{{ token.token }}</span>
                          <span class="text-muted-foreground">{{ (token.prob * 100).toFixed(1) }}%</span>
                        </div>
                      </div>
                    </div>

                    <!-- Résultats après Top P -->
                    <div class="space-y-2">
                      <h3 class="font-medium flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-[#1d4ed8]"></span>
                        Après Top P ({{ topP.toFixed(2) }})
                      </h3>
                      <div class="space-y-1">
                        <div v-for="token in sortedTopPTokens.slice(0, 6)" :key="token.token" 
                             class="text-sm flex justify-between px-2 py-1 rounded hover:bg-muted">
                          <span>{{ token.token }}</span>
                          <span class="text-muted-foreground">{{ (token.prob * 100).toFixed(1) }}%</span>
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
                <li>Sélection basée sur la probabilité cumul��e</li>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
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

const isOpen = ref(false)

const temperature = ref(0.7)
const topK = ref(5)
const topP = ref(0.8)

interface Token {
  token: string;
  prob: number;
  description?: string;
}

interface Scenario {
  id: string;
  prompt: string;
  description: string;
  tokens: Token[];
}

// Définition des scénarios
const scenarios: Record<string, Scenario> = {
  horse: {
    id: 'horse',
    prompt: 'Il court au galop, c\'est un',
    description: 'Prédiction du type d\'animal en fonction du contexte',
    tokens: [
      { token: "cheval", prob: 0.35, description: "Animal le plus probable dans ce contexte" },
      { token: "étalon", prob: 0.25, description: "Spécification masculine du cheval" },
      { token: "poney", prob: 0.12, description: "Variante plus petite" },
      { token: "pur-sang", prob: 0.08, description: "Race spécifique" },
      { token: "mustang", prob: 0.05, description: "Type de cheval sauvage" },
      { token: "coursier", prob: 0.04, description: "Synonyme plus littéraire" },
      { token: "canasson", prob: 0.03, description: "Terme familier" },
      { token: "destrier", prob: 0.02, description: "Terme historique" },
      { token: "palomino", prob: 0.015, description: "Couleur spécifique" },
      { token: "yearling", prob: 0.01, description: "Jeune cheval" },
      { token: "zèbre", prob: 0.008, description: "Autre équidé" },
      { token: "lièvre", prob: 0.007, description: "Autre animal rapide" },
      { token: "guépard", prob: 0.005, description: "Animal rapide mais moins probable" },
      { token: "kangourou", prob: 0.003, description: "Animal qui bondit" },
      { token: "centaure", prob: 0.002, description: "Créature mythologique" }
    ]
  },
  italy: {
    id: 'italy',
    prompt: 'Pour votre séjour en Italie en juillet, nous vous recommandons de visiter',
    description: 'Recommandation de destination en fonction de la saison',
    tokens: [
      { token: "Rome", prob: 0.30, description: "Capitale, centre historique majeur" },
      { token: "Florence", prob: 0.20, description: "Centre de la Renaissance" },
      { token: "Venise", prob: 0.15, description: "Unique, très touristique en été" },
      { token: "Cinque Terre", prob: 0.08, description: "Idéal en été, côte pittoresque" },
      { token: "Toscane", prob: 0.06, description: "Région viticole et culturelle" },
      { token: "Naples", prob: 0.05, description: "Gastronomie et histoire" },
      { token: "Côte Amalfitaine", prob: 0.04, description: "Destination balnéaire prisée" },
      { token: "Sicile", prob: 0.03, description: "Grande île, riche en histoire" },
      { token: "Sardaigne", prob: 0.025, description: "Plages magnifiques, moins touristique" },
      { token: "Bologne", prob: 0.02, description: "Centre gastronomique" },
      { token: "Matera", prob: 0.015, description: "Ville troglodyte unique" },
      { token: "Pouilles", prob: 0.01, description: "Région authentique émergente" },
      { token: "Lac de Côme", prob: 0.008, description: "Destination luxe" },
      { token: "Gênes", prob: 0.005, description: "Port historique" },
      { token: "Dolomites", prob: 0.002, description: "Montagnes, moins adapté en été" }
    ]
  }
};

const selectedScenario = ref('horse')
const currentScenario = computed(() => scenarios[selectedScenario.value])

// Remplacer baseTokens par une computed property
const baseTokens = computed(() => currentScenario.value.tokens)

const selectScenario = (scenario: string) => {
  selectedScenario.value = scenario
  // Réinitialiser les paramètres si nécessaire
  temperature.value = 0.7
  topK.value = 5
  topP.value = 0.8
}

// Amélioration du tooltip pour inclure la description
const getTokenTooltip = (token: Token) => {
  const percentage = (token.prob * 100).toFixed(1)
  return `${token.token} (${percentage}%)${token.description ? `\n${token.description}` : ''}`
}

// Fonction de normalisation
const normalize = (tokens: Token[]): Token[] => {
  const sum = tokens.reduce((acc, t) => acc + t.prob, 0)
  return tokens.map(t => ({
    ...t,
    prob: t.prob / sum
  }))
}

// Ajout d'un seuil de probabilité minimale pour filtrer les tokens négligeables
const PROBABILITY_THRESHOLD = 0.01 // 1%

// Calcul des tokens filtrés à chaque étape
const filteredTokens = computed(() => {
  // 1. Application de la température
  let tempAdjusted: Token[]
  if (temperature.value <= 0.1) {
    // Cas très conservateur (Temperature ≈ 0)
    tempAdjusted = [
      { ...baseTokens.value[0], prob: 0.95 },
      { ...baseTokens.value[1], prob: 0.04 },
      { ...baseTokens.value[2], prob: 0.01 }
    ]
  } else if (temperature.value >= 2.0) {
    // Distribution plus uniforme
    tempAdjusted = baseTokens.value.map(t => ({
      ...t,
      prob: Math.pow(t.prob, 1/temperature.value)
    }))
  } else {
    // Cas normal (ex: temperature = 0.7)
    tempAdjusted = baseTokens.value.map(t => ({
      ...t,
      prob: Math.pow(t.prob, 1/temperature.value)
    }))
  }

  // Normalisation après température
  tempAdjusted = normalize(tempAdjusted)
    .filter(t => t.prob >= PROBABILITY_THRESHOLD)
  tempAdjusted = normalize(tempAdjusted)

  // 2. Application du Top K
  const topKTokens = [...tempAdjusted]
    .sort((a, b) => b.prob - a.prob)
    .slice(0, topK.value)
  const normalizedTopK = normalize(topKTokens)

  // 3. Application du Top P (correction de la logique)
  let cumSum = 0
  const topPTokens: Token[] = []
  
  // Parcours des tokens dans l'ordre décroissant de probabilité
  for (const token of normalizedTopK) {
    topPTokens.push(token)
    cumSum += token.prob
    
    // On s'arrête dès que la somme cumulée dépasse le seuil de Top P
    if (cumSum >= topP.value) {
      break
    }
  }

  // Si aucun token n'a été sélectionné (cas rare), on prend au moins le plus probable
  if (topPTokens.length === 0 && normalizedTopK.length > 0) {
    topPTokens.push(normalizedTopK[0])
  }

  // Normalisation finale
  const finalTokens = normalize(topPTokens)

  return {
    afterTemp: tempAdjusted,
    afterTopK: normalizedTopK,
    afterTopP: finalTokens
  }
})

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

onMounted(() => {
  isLoading.value = false
})

onUnmounted(() => {
  // Plus besoin de cleanup d'animation
})
</script>

<style scoped>
.token-point {
  animation: gentle-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  transition: all 0.5s ease-in-out;
}

@keyframes gentle-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95);
  }
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
</style> 