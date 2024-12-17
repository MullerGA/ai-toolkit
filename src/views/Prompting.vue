<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-7xl mx-auto">
      <CardHeader class="pb-4 border-b">
        <div class="flex justify-between items-start">
          <div>
            <CardTitle>Guide de Prompting</CardTitle>
            <CardDescription>
              Apprenez à construire des prompts efficaces étape par étape
            </CardDescription>
          </div>
          <Button variant="outline" @click="showInfo = true">
            En savoir plus
          </Button>
        </div>
      </CardHeader>

      <div class="p-6">
        <!-- Navigation des concepts -->
        <div class="mb-8">
          <div class="flex gap-4">
            <Button 
              v-for="concept in concepts" 
              :key="concept.id"
              variant="outline"
              :class="{ 'bg-primary text-primary-foreground': selectedConcept === concept.id }"
              @click="selectConcept(concept.id)"
            >
              {{ concept.title }}
            </Button>
          </div>
        </div>

        <!-- Section de redirection vers les templates -->
        <div class="mb-8 p-6 bg-muted/50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium">Besoin de templates prêts à l'emploi ?</h3>
              <p class="text-sm text-muted-foreground">
                Découvrez notre collection de prompts prédéfinis pour différents cas d'usage
              </p>
            </div>
            <Button @click="router.push('/prompt-templates')" class="ml-4">
              Voir les Templates
            </Button>
          </div>
        </div>

        <!-- Nouvelle section pour le texte à analyser -->
        <div class="mb-8">
          <Button 
            variant="outline" 
            class="w-full mb-4"
            @click="showAnalysisText = !showAnalysisText"
          >
            {{ showAnalysisText ? 'Masquer' : 'Afficher' }} le texte à analyser
          </Button>
          
          <div v-if="showAnalysisText" 
               class="bg-muted p-6 rounded-lg transition-all duration-300"
               :class="{ 'opacity-0 h-0': !showAnalysisText, 'opacity-100': showAnalysisText }"
          >
            <h4 class="font-medium mb-4">Analyse de l'Impact des Tendances Touristiques sur la Performance du Secteur Hôtelier en France - 2024</h4>
            <div class="prose dark:prose-invert max-w-none">
              <p class="whitespace-pre-line">{{ analysisText }}</p>
            </div>
          </div>
        </div>

        <!-- Affichage du concept sélectionné -->
        <div v-if="selectedConcept">
          <div class="bg-muted/50 rounded-lg p-6">
            <p class="text-lg text-muted-foreground mb-6">{{ getCurrentConcept?.description }}</p>

            <!-- Exemples en ligne -->
            <div v-if="selectedConcept === 'anatomy'" class="relative">
              <Carousel class="w-full">
                <CarouselContent>
                  <CarouselItem v-for="(example, index) in getCurrentConcept?.examples" 
                                :key="index"
                                class="md:basis-1/3">
                    <div class="p-1">
                      <div class="bg-card p-6 rounded-lg">
                        <h5 class="font-medium mb-4">{{ example.title }}</h5>

                        <!-- Échange Humain/IA -->
                        <div class="space-y-4">
                          <div class="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div class="font-medium text-sm mb-2">Humain:</div>
                            <div class="whitespace-pre-line">{{ example.prompt }}</div>
                          </div>
                          <div class="bg-blue-200 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div class="font-medium text-sm mb-2">IA:</div>
                            <div class="whitespace-pre-line">{{ example.response }}</div>
                          </div>
                        </div>

                        <!-- Points clés avec positif/négatif -->
                        <div class="mt-4 space-y-4">
                          <div>
                            <div class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Points forts:</div>
                            <ul class="space-y-1">
                              <li v-for="(point, pIndex) in example.positivePoints" 
                                  :key="pIndex"
                                  class="flex items-start gap-2 text-sm">
                                <PlusCircleIcon class="w-4 h-4 text-blue-500 mt-1" />
                                <span>{{ point }}</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Limites:</div>
                            <ul class="space-y-1">
                              <li v-for="(point, pIndex) in example.negativePoints" 
                                  :key="pIndex"
                                  class="flex items-start gap-2 text-sm">
                                <MinusCircleIcon class="w-4 h-4 text-red-500 mt-1" />
                                <span>{{ point }}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            <div v-else class="grid grid-cols-2 gap-8">
              <div v-for="(example, index) in getCurrentConcept?.examples" 
                   :key="index"
                   class="col-span-2 bg-card rounded-lg p-6">
                <!-- En-tête avec numéro et titre -->
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                    {{ index + 1 }}
                  </div>
                  <h5 class="text-lg font-medium">{{ example.title }}</h5>
                </div>

                <!-- Modification du conteneur pour Prompt et Réponse -->
                <div class="grid grid-cols-2 gap-6">
                  <!-- Colonne Prompt -->
                  <div class="flex flex-col h-full">
                    <div class="space-y-4">
                      <div class="font-medium text-sm text-primary">Prompt</div>
                      <div class="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-4 rounded-lg min-h-[200px]">
                        <div class="whitespace-pre-line">{{ example.prompt }}</div>
                      </div>
                    </div>
                    <!-- Points forts du prompt en bas -->
                    <div class="mt-auto pt-4">
                      <div class="text-sm font-medium text-green-600 mb-2">Points forts:</div>
                      <ul class="space-y-1">
                        <li v-for="(point, pIndex) in example.positivePoints" 
                            :key="pIndex"
                            class="flex items-start gap-2 text-sm">
                          <PlusCircleIcon class="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>{{ point }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Colonne Réponse -->
                  <div class="flex flex-col h-full">
                    <div class="space-y-4">
                      <div class="font-medium text-sm text-primary">Résultat</div>
                      <div class="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 p-4 rounded-lg min-h-[200px]">
                        <div class="whitespace-pre-line">{{ showRealResult ? getRealResult(example) : example.response }}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        class="w-full"
                        @click="showRealResult = !showRealResult"
                      >
                        {{ showRealResult ? 'Voir exemple générique' : 'Voir résultat réel' }}
                      </Button>
                    </div>
                    <!-- Limites en bas -->
                    <div class="mt-auto pt-4">
                      <div class="text-sm font-medium text-red-600 mb-2">Limites:</div>
                      <ul class="space-y-1">
                        <li v-for="(point, pIndex) in example.negativePoints" 
                            :key="pIndex"
                            class="flex items-start gap-2 text-sm">
                          <MinusCircleIcon class="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span>{{ point }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/24/solid'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useRouter } from 'vue-router'

const selectedConcept = ref('progression')
const router = useRouter()

const concepts = [
  {
    id: 'progression',
    title: 'Progression du Prompting',
    description: 'Évolution d\'un prompt simple vers un prompt avancé',
    examples: [
      {
        title: 'Niveau 1 - Simple',
        prompt: 'Résume ce texte',
        response: 'Un résumé simple du texte en quelques phrases, reprenant uniquement les points essentiels sans structure particulière.',
        positivePoints: [
          'Rapide à écrire',
          'Direct',
          'Facile à comprendre'
        ],
        negativePoints: [
          'Manque de précision',
          'Résultat imprévisible',
          'Pas de contrôle sur le format'
        ]
      },
      {
        title: 'Niveau 2 - Structuré',
        prompt: 'Résume ce texte en 3 points clés, maximum 50 mots par point',
        response: `Point 1 : Présentation des données principales et chiffres clés du sujet.

Point 2 : Analyse des tendances et impacts observés sur le secteur concerné.

Point 3 : Conclusions et implications futures pour les acteurs du marché.`,
        positivePoints: [
          'Structure claire en 3 points',
          'Données clés conservées',
          'Format cohérent'
        ],
        negativePoints: [
          'Perte de certains détails',
          'Structure peut-être trop rigide',
          'Manque de contextualisation'
        ]
      },
      {
        title: 'Niveau 3 - Contextualisé',
        prompt: 'En tant qu\'expert marketing stratégique. \n- Analysez ce document pour le COMEX hôtelier. \n- Transformez les données techniques en insights actionnables. \n- Format : 1 page max structurée en Tendances > Impact > Solutions, avec 3-4 recommandations priorisées et KPIs associés. \n- Privilégiez le langage business et les analogies concrètes.',
        response: `Analyse Stratégique

TENDANCES
• Tendance majeure 1 avec données chiffrées
• Tendance majeure 2 avec comparaison sectorielle
• Tendance majeure 3 avec opportunité identifiée

IMPACT BUSINESS
• Impact 1 sur les opérations
• Impact 2 sur la rentabilité
• Impact 3 sur la stratégie

RECOMMANDATIONS PRIORITAIRES
1. Recommandation stratégique 1
   KPI : Objectif chiffré
2. Recommandation stratégique 2
   KPI : Objectif chiffré
3. Recommandation stratégique 3
   KPI : Objectif chiffré

PILOTAGE RECOMMANDÉ
• Indicateur de suivi 1
• Indicateur de suivi 2
• Indicateur de suivi 3`,
        positivePoints: [
          'Format professionnel adapté au COMEX',
          'Recommandations actionnables avec KPIs',
          'Structure claire et hiérarchisée',
          'Langage business approprié'
        ],
        negativePoints: [
          'Complexité de mise en forme',
          'Nécessite une expertise métier',
          'Temps de préparation plus long'
        ]
      }
    ]
  },
  {
    id: 'anatomy',
    title: 'Anatomie d\'un Prompt',
    description: 'Découvrez les différentes structures possibles d\'un prompt, de la plus simple à la plus élaborée',
    examples: [
      {
        title: 'Structure Basique',
        prompt: 'Instruction/Question\n-------------------\n"Fais X"\n"Quelle est Y ?"\n"Comment faire Z ?"',
        response: 'Exemple :\n"Explique ce qu\'est l\'intelligence artificielle"',
        positivePoints: [
          'Simple et direct',
          'Rapide à écrire',
          'Convient aux questions basiques'
        ],
        negativePoints: [
          'Manque de précision',
          'Pas de contexte',
          'Résultats variables'
        ]
      },
      {
        title: 'Structure avec Format',
        prompt: 'Instruction + Format souhaité\n----------------------------\n"Fais X\nFormat:\n- Point 1\n- Point 2"',
        response: 'Exemple :\n"Explique l\'intelligence artificielle\nFormat:\n- Définition\n- Exemples\n- Applications"',
        positivePoints: [
          'Structure claire',
          'Réponse organisée',
          'Meilleur contrôle du résultat'
        ],
        negativePoints: [
          'Peut être trop rigide',
          'Manque encore de contexte',
          'Limité en personnalisation'
        ]
      },
      {
        title: 'Structure avec Contexte',
        prompt: 'Contexte + Instruction + Format\n------------------------------\n"Contexte : [Information]\nTâche : [Instruction]\nFormat souhaité : [Structure]"',
        response: 'Exemple :\n"Contexte : Présentation à des débutants\nTâche : Explique l\'intelligence artificielle\nFormat : Bullet points simples"',
        positivePoints: [
          'Ajout de contexte',
          'Meilleure adaptation',
          'Résultats plus pertinents'
        ],
        negativePoints: [
          'Plus long à écrire',
          'Peut être surspécifié',
          'Nécessite plus de réflexion'
        ]
      },
      {
        title: 'Structure avec Rôle',
        prompt: 'Rôle + Contexte + Instruction + Format\n------------------------------------\n"En tant que [rôle],\nContexte : [Information]\nTâche : [Instruction]\nFormat attendu : [Structure]"',
        response: 'Exemple :\n"En tant qu\'expert en vulgarisation,\nContexte : Public novice\nTâche : Explique l\'intelligence artificielle\nFormat : Analogies et exemples quotidiens"',
        positivePoints: [
          'Expertise spécifique',
          'Adaptation au public',
          'Résultats plus professionnels'
        ],
        negativePoints: [
          'Complexité accrue',
          'Temps de préparation plus long',
          'Peut être trop détaillé'
        ]
      },
      {
        title: 'Structure Complète',
        prompt: 'Rôle + Expertise + Contexte + Instruction + Contraintes + Format\n-------------------------------------------------------------\n"En tant que [rôle] spécialisé en [domaine],\nContexte : [Information détaillée]\nPublic cible : [Destinataires]\nTâche : [Instruction précise]\nContraintes : [Limites/Exigences]\nFormat attendu :\n1. [Structure]\n2. [Style]\n3. [Longueur]"',
        response: 'Exemple :\n"En tant qu\'expert en IA spécialisé en vulgarisation,\nContexte : Conférence grand public\nPublic cible : Non-techniciens\nTâche : Explique l\'intelligence artificielle\nContraintes : Éviter le jargon technique\nFormat attendu :\n1. Introduction simple\n2. 3 exemples quotidiens\n3. Conclusion pratique\nLongueur : ~300 mots"',
        positivePoints: [
          'Contrôle maximal',
          'Résultats très précis',
          'Adaptation parfaite au besoin'
        ],
        negativePoints: [
          'Très long à préparer',
          'Peut être trop contraignant',
          'Complexité maximale'
        ]
      }
    ]
  }
]

const getCurrentConcept = computed(() => {
  return concepts.find(c => c.id === selectedConcept.value)
})

const selectConcept = (id: string) => {
  selectedConcept.value = id
}

const showAnalysisText = ref(false)

const analysisText = `L'élasticité-prix de la demande touristique présente une corrélation négative avec les variables macro-économiques saisonnières, impactant significativement le yield management des établissements hôteliers. L'analyse des données 2020-2024 révèle une volatilité accrue des comportements de réservation, avec un coefficient d'occupation moyen variant de manière inversement proportionnelle aux variations tarifaires (élasticité: -1.4 haute saison, -2.1 basse saison).

La segmentation géographique démontre des disparités entre zones urbaines et côtières, les écarts de RevPAR atteignant 45% en période de pic. Les établissements luxueux présentent une résilience supérieure, leur clientèle démontrant une élasticité-prix de -0.8.

L'intégration des variables météorologiques et événementielles améliore la précision prédictive de 23%. Les algorithmes de revenue management dynamique génèrent une augmentation du TRevPAR de 15%. La digitalisation des canaux de distribution (72% des réservations) impacte directement les coûts d'acquisition client.

Les tendances macro-économiques exercent une pression significative sur les marges opérationnelles (corrélation 0.85). La saisonnalité requiert une gestion sophistiquée des capacités, les nouveaux modèles mathématiques réduisant la marge d'erreur à 8%.

Le tourisme durable influence les comportements, générant une prime tarifaire de 12% pour les établissements éco-certifiés. Cette évolution modifie les paramètres classiques d'élasticité-prix et nécessite une adaptation des stratégies tarifaires.

Les implications managériales suggèrent l'implémentation de systèmes de tarification dynamique intégrant variables macro-économiques et tendances comportementales. L'analyse des mécanismes tarifaires et leur impact sur la performance hôtelière permet d'anticiper les évolutions du marché dans un environnement touristique complexifié.

La synergie entre intelligence artificielle et revenue management traditionnel représente un axe de développement crucial, les algorithmes prédictifs démontrant une efficacité accrue dans l'optimisation des revenus. L'investissement dans la formation des équipes aux méthodologies avancées de yield management constitue un facteur différenciant dans un marché hautement concurrentiel.`

const showRealResult = ref(false)

const realResults = {
  simple: `Résumé analytique de l'étude sur le secteur hôtelier français en 2024 :
Dynamiques principales :

Élasticité-prix complexe : variations de -1.4 à -2.1 selon les saisons
Disparités géographiques marquées (écarts de RevPAR de 45%)
Hôtels de luxe plus résilients (élasticité-prix de -0.8)

Facteurs stratégiques :

Digitalisation : 72% des réservations en ligne
Revenue management : algorithmes améliorant le TRevPAR de 15%
Variables prédictives (météo, événements) augmentant la précision de 23%

Tendances émergentes :

Tourisme durable : prime tarifaire de 12% pour éco-certification
Intégration croissante de l'intelligence artificielle
Nécessité d'adaptation aux comportements touristiques évolutifs

Enjeu central : optimisation dynamique des stratégies tarifaires dans un environnement touristique complexe et changeant.`,

  structured: `Impact de l'élasticité-prix : La demande touristique varie selon les saisons (-1.4 haute saison, -2.1 basse saison) avec une meilleure résilience du secteur luxe (-0.8). Les écarts de RevPAR entre zones urbaines et côtières atteignent 45% en période de pic.

Digitalisation et revenue management : 72% des réservations sont digitales, impactant les coûts d'acquisition. Les algorithmes de revenue management augmentent le TRevPAR de 15%, tandis que l'intégration des données météo améliore la précision prédictive de 23%.

Évolution du marché : Le tourisme durable génère une prime de 12% pour les établissements éco-certifiés. Les marges opérationnelles sont fortement corrélées aux tendances macro-économiques (0.85), nécessitant une tarification dynamique adaptée.`,

  contextualized: `TENDANCES

Dichotomie croissante du marché : élasticité-prix faible (-0.8) sur le luxe vs forte sensibilité (-2.1) sur le mass-market, comparable au secteur aérien
Digitalisation massive (72% des réservations) transformant la structure des coûts d'acquisition
Prime verte ��mergente (12%) révélant un nouveau levier de valorisation

IMPACT BUSINESS

Volatilité accrue des réservations créant des inefficiences opérationnelles (RevPAR -45% en zones tendues)
Pression sur les marges amplifiant l'importance de l'optimisation tarifaire
Complexification du pricing nécessitant des outils prédictifs sophistiqués

RECOMMANDATIONS PRIORITAIRES

Déployer une tarification hyper-segmentée par micro-marchés
KPI : Réduction de 8% des écarts prévisionnels RevPAR
Automatiser le revenue management via l'IA pour les segments mass-market
KPI : +15% de TRevPAR sur 12 mois
Repositionner 25% du portefeuille sur l'éco-tourisme premium
KPI : Premium prix de 12% vs concurrence
Investir dans la formation revenue management des équipes
KPI : -30% d'écart entre prévisions et réalisé

PILOTAGE RECOMMANDÉ

Dashboard mensuel : élasticité-prix par segment
Suivi hebdomadaire : taux de conversion digital vs coût d'acquisition
Analyse trimestrielle : positionnement prix vs concurrence`
}

const getRealResult = (example: any) => {
  switch (example.title) {
    case 'Niveau 1 - Simple':
      return realResults.simple
    case 'Niveau 2 - Structuré':
      return realResults.structured
    case 'Niveau 3 - Contextualisé':
      return realResults.contextualized
    default:
      return ''
  }
}
</script> 

<style scoped>
/* Modifier les styles */
.bg-opacity-20 {
  transition: all 0.3s ease;
}

.grid-cols-3 > div {
  transition: all 0.3s ease;
}

.grid-cols-3 > div:hover {
  transform: translateY(-4px);
}

.rounded-full {
  transition: all 0.3s ease;
}

.rounded-full:hover {
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(var(--primary), 0.2);
}

/* Animation pour le texte à analyser */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style> 