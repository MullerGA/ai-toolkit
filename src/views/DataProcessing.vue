<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-7xl mx-auto">
      <CardHeader class="pb-4 border-b">
        <div class="flex justify-between items-start">
          <div>
            <CardTitle>Anatomie d'un LLM</CardTitle>
            <CardDescription>
              Exploration progressive du fonctionnement d'un modèle de langage
            </CardDescription>
          </div>
          <Button variant="outline" @click="showInfo = true">
            En savoir plus
          </Button>
        </div>
        
        <div class="mt-6">
          <div class="flex justify-between mb-2">
            <span class="text-sm">Étape {{ currentStep }}/{{ totalSteps }}</span>
            <span class="text-sm font-medium">{{ getCurrentStepTitle }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <div v-for="step in totalSteps" 
                 :key="step" 
                 class="flex-1 h-2 rounded-full transition-all duration-300"
                 :class="[
                   step === currentStep ? 'bg-primary' : 
                   step < currentStep ? 'bg-primary/50' : 'bg-muted'
                 ]"
                 @click="navigateToStep(step)"
            />
          </div>
        </div>
      </CardHeader>

      <div class="p-6">
        <component 
          :is="getCurrentStepComponent" 
          :scenario="currentScenario"
          :scenarios="scenarios"
          @update:scenario="currentScenario = $event"
          @next="handleNext"
        />
      </div>
    </Card>

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

import TokenizationStep from './steps/TokenizationStep.vue'
import VectorRepresentationStep from './steps/VectorRepresentationStep.vue'
import AttentionMechanismStep from './steps/AttentionMechanismStep.vue'
import ResponseGenerationStep from './steps/ResponseGenerationStep.vue'
import IntroductiveStep from './steps/IntroductiveStep.vue'

const showInfo = ref(false)
const currentStep = ref(1)
const totalSteps = 5

const steps = [
  {
    id: 1,
    title: 'Vue d\'Ensemble',
    component: IntroductiveStep,
  },
  {
    id: 2,
    title: 'Du Texte aux Tokens',
    component: TokenizationStep,
  },
  {
    id: 3,
    title: 'La Représentation Vectorielle',
    component: VectorRepresentationStep,
  },
  {
    id: 4,
    title: 'Les Mécanismes d\'Attention',
    component: AttentionMechanismStep,
  },
  {
    id: 5,
    title: 'La Génération de Réponses',
    component: ResponseGenerationStep,
  },
]
const scenarios = [
  {
    id: 'simple',
    name: 'Exemple Simple',
    input: 'Le chat dort sur le tapis',
    tokens: [
      { token: 'Le', vector: [0.10, 0.10, 0.10] },
      { token: 'chat', vector: [0.82, 0.45, 0.65] },
      { token: 'dort', vector: [0.35, 0.78, 0.42] },
      { token: 'sur', vector: [0.20, 0.15, 0.25] },
      { token: 'le', vector: [0.10, 0.10, 0.10] },
      { token: 'tap', vector: [0.55, 0.40, 0.70] },
      { token: 'is', vector: [0.45, 0.35, 0.65] }
    ],
    description: "Les articles 'Le' et 'le' partagent le même vecteur, tandis que les parties du mot 'tapis' ont des vecteurs proches mais distincts."
  },
  {
    id: 'science',
    name: 'Découverte Scientifique',
    input: 'Les chercheurs ont découvert une particule subatomique',
    tokens: [
      { token: 'Les', vector: [0.12, 0.08, 0.15] },
      { token: 'cherch', vector: [0.75, 0.85, 0.70] },
      { token: 'eurs', vector: [0.65, 0.75, 0.60] },
      { token: 'ont', vector: [0.25, 0.30, 0.20] },
      { token: 'découv', vector: [0.80, 0.90, 0.75] },
      { token: 'ert', vector: [0.70, 0.80, 0.65] },
      { token: 'une', vector: [0.15, 0.12, 0.18] },
      { token: 'parti', vector: [0.88, 0.92, 0.85] },
      { token: 'cule', vector: [0.82, 0.88, 0.80] },
      { token: 'sub', vector: [0.95, 0.90, 0.92] },
      { token: 'atom', vector: [0.92, 0.95, 0.88] },
      { token: 'ique', vector: [0.85, 0.82, 0.78] }
    ],
    description: "Les tokens scientifiques (atom, sub, parti) sont regroupés dans une région similaire de l'espace vectoriel, tandis que les éléments grammaticaux sont ailleurs."
  },
  {
    id: 'multilingual',
    name: 'Exemple Multilingue',
    input: "L'interface utilisateur est user-friendly",
    tokens: [
      { token: "L'", vector: [0.10, 0.12, 0.08] },
      { token: 'inter', vector: [0.78, 0.82, 0.75] },
      { token: 'face', vector: [0.72, 0.75, 0.70] },
      { token: 'util', vector: [0.65, 0.70, 0.62] },
      { token: 'isa', vector: [0.60, 0.65, 0.58] },
      { token: 'teur', vector: [0.55, 0.60, 0.52] },
      { token: 'est', vector: [0.20, 0.25, 0.18] },
      { token: 'user', vector: [0.85, 0.88, 0.82] },
      { token: 'friendly', vector: [0.82, 0.85, 0.80] }
    ],
    description: "Les tokens anglais (user, friendly) sont proches entre eux, tandis que les tokens français techniques forment un autre groupe cohérent."
  }
];

const getCurrentStepTitle = computed(() => {
  return steps.find(step => step.id === currentStep.value)?.title
})

const getCurrentStepComponent = computed(() => {
  return steps.find(step => step.id === currentStep.value)?.component
})

const currentScenario = ref('simple')

const navigateToStep = (step: number) => {
  currentStep.value = step
}

const handleNext = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
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