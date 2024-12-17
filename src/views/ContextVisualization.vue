<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-7xl mx-auto">
      <CardHeader class="pb-2 border-b">
        <div class="flex justify-between items-start">
          <div>
            <CardTitle>L'Entonnoir de Mémoire LLM</CardTitle>
            <CardDescription>
              Visualisez comment le LLM gère le contexte et la mémoire pendant une conversation
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            En savoir plus
          </Button>
        </div>
      </CardHeader>

      <!-- Timeline -->
      <div class="p-2 bg-white dark:bg-gray-800 mb-2">
        <div class="relative pt-2 pb-2">
          <div class="absolute h-[2px] bg-blue-200 left-0 right-0 top-[12px]"></div>
          <div class="relative flex justify-between">
            <TimelinePoint 
              v-for="(point, index) in timelinePoints" 
              :key="index"
              :point="point"
              :active="currentStep === index"
              @click="setStep(index)"
            />
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="grid grid-cols-12 gap-4 p-4">
        <!-- Zone Conversation (8/12) -->
        <div class="col-span-8">
          <Card class="h-full">
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <div 
                  class="space-y-4 h-[500px] overflow-y-auto conversation-container" 
                  ref="chatContainer"
                >
                  <TransitionGroup 
                    name="message" 
                    tag="div" 
                    class="space-y-4"
                  >
                    <div 
                      v-for="(message, index) in currentConversation" 
                      :key="`${message.id}-${index}`"
                      :class="[
                        'p-4 pt-6 rounded-lg transition-all duration-300',
                        message.sender === 'human' ? 'ml-auto' : '',
                        // Style pour les messages actifs vs inactifs
                        isActiveMessage(index) 
                          ? [
                              'max-w-[85%] scale-100',
                              message.sender === 'human'
                                ? 'bg-blue-100 dark:bg-blue-900/20'
                                : 'bg-white dark:bg-gray-800 shadow-md'
                            ]
                          : [
                              'max-w-[75%] scale-95',
                              message.sender === 'human'
                                ? 'bg-blue-50 dark:bg-blue-900/10'
                                : 'bg-gray-50 dark:bg-gray-800/50',
                              'opacity-60'
                            ]
                      ]"
                    >
                      <div class="relative">
                        <!-- Badge pour le type de message -->
                        <span 
                          :class="[
                            'absolute -top-5 px-2 py-0.5 rounded-full text-xs font-medium',
                            message.sender === 'human' 
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 right-0'
                              : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 left-0'
                          ]"
                        >
                          {{ message.sender === 'human' ? 'Question' : 'Réponse' }}
                        </span>
                        
                        <!-- Contenu du message -->
                        <div class="text-sm message-content">
                          {{ message.content }}
                        </div>
                      </div>
                    </div>
                  </TransitionGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Zone État des Mémoires (4/12) -->
        <div class="col-span-4 space-y-4">
          <!-- Context Window -->
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Context Window</CardTitle>
              <CardDescription class="text-xs">
                Fenêtre de contexte immédiat utilisée par le modèle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <!-- Contexte Actif -->
                <div class="mb-4">
                  <div class="flex items-center mb-2">
                    <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span class="text-xs font-medium text-blue-700 dark:text-blue-300">Contexte Actif</span>
                  </div>
                  <div v-for="(context, idx) in currentState.contextWindow.active" 
                       :key="idx" 
                       class="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
                    {{ context }}
                  </div>
                </div>

                <!-- Contexte Récent -->
                <div v-if="currentState.contextWindow.recent.length > 0">
                  <div class="flex items-center mb-2">
                    <div class="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Contexte Récent</span>
                  </div>
                  <div v-for="(context, idx) in currentState.contextWindow.recent" 
                       :key="idx" 
                       class="mb-2 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-md text-sm text-gray-600 dark:text-gray-400">
                    {{ context }}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Memory Stack -->
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Memory Stack</CardTitle>
              <CardDescription class="text-xs">
                Pile de mémoire hiérarchique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <!-- Haute priorité -->
                <div class="p-2 bg-[#E3F2FD] dark:bg-blue-900/20 rounded-lg">
                  <div class="flex items-center mb-2">
                    <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span class="text-xs font-medium text-blue-700 dark:text-blue-300">Haute priorité</span>
                  </div>
                  <div v-for="(item, idx) in currentState.memoryStack.high" 
                       :key="idx" 
                       class="p-2 bg-white/80 dark:bg-gray-800/80 rounded-md text-sm mb-1">
                    {{ item }}
                  </div>
                </div>

                <!-- Moyenne priorité -->
                <div class="p-2 bg-[#C8E6C9] dark:bg-green-900/20 rounded-lg">
                  <div class="flex items-center mb-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span class="text-xs font-medium text-green-700 dark:text-green-300">Moyenne priorité</span>
                  </div>
                  <div v-for="(item, idx) in currentState.memoryStack.medium" 
                       :key="idx" 
                       class="p-2 bg-white/80 dark:bg-gray-800/80 rounded-md text-sm mb-1">
                    {{ item }}
                  </div>
                </div>

                <!-- Basse priorité -->
                <div class="p-2 bg-[#FFE0B2] dark:bg-orange-900/20 rounded-lg">
                  <div class="flex items-center mb-2">
                    <div class="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span class="text-xs font-medium text-orange-700 dark:text-orange-300">Basse priorité</span>
                  </div>
                  <div v-for="(item, idx) in currentState.memoryStack.low" 
                       :key="idx" 
                       class="p-2 bg-white/80 dark:bg-gray-800/80 rounded-md text-sm mb-1">
                    {{ item }}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TimelinePoint from '@/components/TimelinePoint.vue'
import { conversationStates } from '@/data/conversation-states'

const currentStep = ref(0)
const currentPair = ref(0)
const chatContainer = ref<HTMLElement | null>(null)

const timelinePoints = computed(() => {
  return conversationStates.map((state, index) => ({
    id: index.toString(),
    label: state.timelinePoint.label,
    active: index === currentStep.value
  }))
})

const currentState = computed(() => {
  // Si nous sommes à la première étape, retourner un état initial vide
  if (currentStep.value === 0) {
    return {
      contextWindow: {
        active: [],
        recent: []
      },
      memoryStack: {
        high: [],
        medium: [],
        low: []
      }
    }
  }
  // Sinon, retourner l'état du message précédent
  return conversationStates[currentStep.value - 1]
})

// Calcule la conversation actuelle avec la paire question/réponse active
const currentConversation = computed(() => {
  const messages: typeof conversationStates[0]['messages'] = []
  
  // Ajoute tous les messages jusqu'à l'état actuel
  for (let i = 0; i <= currentStep.value; i++) {
    const state = conversationStates[i]
    // Ajoute la question
    if (!messages.some(m => m.id === state.messages[0].id)) {
      messages.push(state.messages[0])
    }
    // Ajoute la réponse si on est sur l'état actuel ou un état passé
    if (state.messages[1] && !messages.some(m => m.id === state.messages[1].id)) {
      messages.push(state.messages[1])
    }
  }
  
  return messages
})

// Modifier la fonction setStep pour un meilleur scroll automatique
const setStep = (step: number) => {
  currentStep.value = step
  nextTick(() => {
    const container = chatContainer.value
    if (container) {
      // Calculer l'index des messages actifs
      const activeIndex = step * 2
      const messages = container.querySelectorAll('.conversation-container > div > div')
      if (messages[activeIndex]) {
        messages[activeIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  })
}

// Ajouter un watcher pour maintenir le scroll sur les messages actifs
watch(currentStep, () => {
  nextTick(() => {
    const container = chatContainer.value
    if (container) {
      const activeMessages = container.querySelectorAll('.scale-100') // Sélectionne les messages actifs
      if (activeMessages.length > 0) {
        const lastActiveMessage = activeMessages[activeMessages.length - 1]
        lastActiveMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  })
})

// Fonction pour déterminer si un message fait partie de la paire active
const isActiveMessage = (index: number) => {
  const activeMessagePairStart = currentStep.value * 2
  return index === activeMessagePairStart || index === activeMessagePairStart + 1
}
</script>

<style scoped>
.memory-stack-item {
  transition: all 0.3s ease;
}

.memory-stack-item:hover {
  transform: translateY(-2px);
}

/* Animations pour les messages */
.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Animations pour les éléments de mémoire */
.memory-enter-active,
.memory-leave-active {
  transition: all 0.3s ease;
}

.memory-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.memory-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Style pour la zone de conversation */
.conversation-container {
  scroll-behavior: smooth;
  scroll-padding: 2rem; /* Ajoute un padding pour le scroll */
}

.conversation-container > div {
  scroll-snap-align: start;
  transition: opacity 0.3s ease;
}

/* Ajustement pour la timeline */
.timeline-point {
  margin-bottom: 2rem; /* Espace pour le texte sous les points */
}

/* Amélioration des transitions */
.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.conversation-container > div {
  transition: all 0.3s ease;
}

/* Ajout d'un effet de profondeur pour les messages inactifs */
.scale-95 {
  transform: scale(0.95) translateY(0);
}

.opacity-40 {
  filter: grayscale(20%);
}

/* Animation des messages */
.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Style pour les messages */
.conversation-container > div > div {
  position: relative;
  transition: all 0.3s ease;
  margin-top: 1rem; /* Espace pour les badges */
}

/* Ajustement des badges */
.conversation-container .absolute {
  z-index: 1;
  transform: translateY(-50%);
}

/* Hover effect sur les messages */
.conversation-container > div > div:hover {
  opacity: 1;
  transform: scale(1);
}

/* Suppression des styles de la barre latérale */
.bg-primary {
  display: none;
}

/* Améliorer le comportement du scroll */
.conversation-container {
  scroll-behavior: smooth;
  scroll-padding: 2rem; /* Ajoute un padding pour le scroll */
}

/* Assurer que les messages actifs sont bien visibles */
.scale-100 {
  z-index: 2;
  position: relative;
}

/* Style pour préserver les sauts de ligne */
.message-content {
  white-space: pre-line;
  word-wrap: break-word;
}
</style> 