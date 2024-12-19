<template>
  <div class="space-y-8">
    <!-- Titre et introduction -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <h2 class="text-2xl font-semibold mb-4">Introduction au Fonctionnement d'un LLM</h2>
        <p class="text-base text-muted-foreground">
          Découvrez comment un modèle de langage transforme votre texte en réponses cohérentes.
        </p>
      </CardContent>
    </Card>

    <!-- Vue Interactive -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md overflow-hidden">
      <CardContent class="p-6">
        <div class="relative min-h-[400px] flex flex-col items-center">
          <!-- Input -->
          <div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-primary/10 mb-8">
            <h3 class="text-sm font-medium text-primary mb-2 flex items-center gap-2">
              <DocumentTextIcon class="h-4 w-4" />
              Texte d'entrée
            </h3>
            <p class="text-lg font-medium">{{ currentText }}</p>
          </div>

          <!-- Animation du processus -->
          <div class="relative w-full max-w-lg h-52 my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full relative">
                <!-- Grid des étapes -->
                <div class="w-full grid grid-cols-3 gap-16">
                  <!-- Première étape -->
                  <div class="flex flex-col items-center">
                    <div class="process-step" :class="{ 'active': currentStepIndex === 0 }">
                      <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <DocumentTextIcon class="h-8 w-8 text-primary" />
                      </div>
                      <span class="text-sm font-medium text-muted-foreground mt-3">Tokenisation</span>
                    </div>
                  </div>

                  <!-- Deuxième étape -->
                  <div class="flex flex-col items-center">
                    <div class="process-step" :class="{ 'active': currentStepIndex === 1 }">
                      <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <CpuChipIcon class="h-8 w-8 text-primary" />
                      </div>
                      <span class="text-sm font-medium text-muted-foreground mt-3">Traitement</span>
                    </div>
                  </div>

                  <!-- Troisième étape -->
                  <div class="flex flex-col items-center">
                    <div class="process-step" :class="{ 'active': currentStepIndex === 2 }">
                      <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <ChatBubbleBottomCenterTextIcon class="h-8 w-8 text-primary" />
                      </div>
                      <span class="text-sm font-medium text-muted-foreground mt-3">Génération</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Output -->
          <div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-primary/10">
            <h3 class="text-sm font-medium text-primary mb-2 flex items-center gap-2">
              <ChatBubbleBottomCenterTextIcon class="h-4 w-4" />
              Réponse générée
            </h3>
            <div class="min-h-[2rem] flex items-center">
              <p class="text-lg font-medium">
                {{ currentOutput }}
              </p>
            </div>
          </div>

          <!-- Contrôles -->
          <div class="absolute bottom-4 right-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              @click="toggleAnimation"
            >
              <PauseIcon v-if="isPlaying" class="h-4 w-4 mr-2" />
              <PlayIcon v-else class="h-4 w-4 mr-2" />
              {{ isPlaying ? 'Pause' : 'Lecture' }}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              @click="resetAnimation"
            >
              <ArrowPathIcon class="h-4 w-4 mr-2" />
              Recommencer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Points Clés -->
    <div class="grid md:grid-cols-3 gap-6">
      <Card v-for="(point, index) in keyPoints" 
            :key="index"
            class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
        <CardContent class="p-6">
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <component :is="point.icon" class="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 class="font-medium mb-2">{{ point.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ point.description }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Call to Action -->
    <div class="flex justify-center">
      <Button 
        class="group"
        @click="$emit('next')"
      >
        Explorer en détail
        <ArrowRightIcon class="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  DocumentTextIcon, 
  ChatBubbleBottomCenterTextIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  CpuChipIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const isPlaying = ref(true)
const isGenerating = ref(false)
const currentStepIndex = ref(0)
const currentText = ref("Les chercheurs ont découvert...")
const currentOutput = ref("")

const processSteps = [
  { label: 'Tokenisation', icon: DocumentTextIcon },
  { label: 'Traitement', icon: CpuChipIcon },
  { label: 'Génération', icon: ChatBubbleBottomCenterTextIcon }
]

const keyPoints = [
  {
    title: 'Décomposition du Texte',
    description: 'Le modèle découpe le texte en unités de sens pour mieux le comprendre.',
    icon: DocumentTextIcon
  },
  {
    title: 'Analyse Contextuelle',
    description: 'Chaque mot est analysé en tenant compte de son contexte.',
    icon: LightBulbIcon
  },
  {
    title: 'Génération Cohérente',
    description: 'Une réponse est construite en respectant le sens et la grammaire.',
    icon: ChatBubbleLeftRightIcon
  }
]

let animationInterval: number | null = null

const finalOutput = "une nouvelle particule subatomique"
const typingSpeed = 50 // ms par caractère

const typeText = () => {
  currentOutput.value = ""
  isGenerating.value = true
  let currentIndex = 0

  const typeChar = () => {
    if (currentIndex < finalOutput.length) {
      currentOutput.value += finalOutput[currentIndex]
      currentIndex++
      setTimeout(typeChar, typingSpeed)
    } else {
      setTimeout(() => {
        isGenerating.value = false
      }, 1000)
    }
  }

  typeChar()
}

const startAnimation = () => {
  if (animationInterval) return
  
  isPlaying.value = true
  const runStep = () => {
    currentStepIndex.value = (currentStepIndex.value + 1) % processSteps.length
    
    if (currentStepIndex.value === processSteps.length - 1) {
      typeText()
      setTimeout(() => {
        if (isPlaying.value) {
          currentStepIndex.value = 0
          currentOutput.value = ""
          setTimeout(runStep, 500)
        }
      }, 4000)
    } else {
      currentOutput.value = ""
      isGenerating.value = false
      setTimeout(runStep, 500)
    }
  }

  runStep()
}

const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
  isPlaying.value = false
}

const toggleAnimation = () => {
  if (isPlaying.value) {
    stopAnimation()
  } else {
    startAnimation()
  }
}

const resetAnimation = () => {
  stopAnimation()
  currentStepIndex.value = 0
  isGenerating.value = false
  currentOutput.value = ""
  
  setTimeout(() => {
    startAnimation()
  }, 1000)
}

onMounted(() => {
  setTimeout(() => {
    startAnimation()
  }, 1000)
})

onUnmounted(() => {
  stopAnimation()
})

defineEmits(['next'])
</script>

<style scoped>
.processing-animation {
  @apply flex items-center gap-4;
}

.processing-circle {
  @apply w-3 h-3 rounded-full bg-primary;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation-delay: var(--delay);
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: .5;
    transform: scale(1.2);
  }
}

.process-step {
  @apply flex flex-col items-center transition-all duration-300;
  opacity: 0.5;
  transform: scale(0.9);
}

.process-step.active {
  opacity: 1;
  transform: scale(1);
}

.relative.w-full.max-w-lg.h-52 {
  height: 13rem;
}
</style> 