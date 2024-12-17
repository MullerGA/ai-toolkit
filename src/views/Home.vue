<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-12">Parcours d'apprentissage LLM</h1>
    
    <div class="relative max-w-6xl mx-auto">
      <!-- Timeline verticale -->
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 ml-8"></div>

      <!-- Section Base -->
      <div class="flex mb-20">
        <div class="relative">
          <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            Base
          </div>
          <div class="absolute left-16 top-8 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        <div class="ml-12 flex-1">
          <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
            Comprendre le fonctionnement des modèles IA Generatifs
          </h2>
          <div class="grid grid-cols-2 gap-6">
            <!-- Bloc Traitement des Données -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col">
              <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                Traitement des Données
              </h3>
              <div class="steps-container mb-4 flex-grow">
                <div class="relative w-full px-8">
                  <!-- Ligne de connexion -->
                  <div class="absolute top-5 left-12 right-12 h-0.5 bg-blue-300"></div>
                  
                  <!-- Conteneur des étapes avec espacement égal -->
                  <div class="relative flex justify-between items-center gap-8">
                    <div class="flex-1 flex justify-center">
                      <StepCircle number="1" color="blue" label="Tokenisation" compact />
                    </div>
                    <div class="flex-1 flex justify-center">
                      <StepCircle number="2" color="green" label="Embeddings" compact />
                    </div>
                    <div class="flex-1 flex justify-center">
                      <StepCircle number="3" color="orange" label="Attention" compact />
                    </div>
                  </div>
                </div>
              </div>
              <ExploreButton @click="router.push('/data-processing')" compact />
            </div>

            <!-- Bloc Génération de Texte -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col">
              <h3 class="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">
                Génération de Texte
              </h3>
              <div class="flex justify-center mb-4 flex-grow">
                <StepCircle number="4" color="purple" label="Génération" compact />
              </div>
              <ExploreButton @click="router.push('/llm-visualization')" compact />
            </div>
          </div>
        </div>
      </div>

      <!-- Section Interaction -->
      <div class="flex mb-20">
        <div class="relative">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            Inter
          </div>
          <div class="absolute left-16 top-8 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        <div class="ml-12 flex-1">
          <h2 class="text-2xl font-semibold mb-6 text-green-600 dark:text-green-400">
            Intéragir avec les modèles IA Generatifs
          </h2>
          <div class="grid grid-cols-2 gap-6">
            <!-- Bloc Prompting -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col">
              <h3 class="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                Prompting
              </h3>
              <div class="steps-container mb-4 flex-grow">
                <div class="relative w-full px-8">
                  <!-- Ligne de connexion -->
                  <div class="absolute top-5 left-12 right-12 h-0.5 bg-indigo-300"></div>
                  
                  <!-- Points de progression -->
                  <div class="relative flex justify-between items-center">
                    <div class="flex-1 flex justify-center">
                      <StepCircle number="5" color="indigo" label="Prompting" compact />
                    </div>
                  </div>
                </div>
              </div>
              <ExploreButton @click="router.push('/prompting')" compact />
            </div>

            <!-- Bloc Contexte -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col">
              <h3 class="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
                Contexte
              </h3>
              <div class="steps-container mb-4 flex-grow">
                <div class="relative w-full px-8">
                  <!-- Ligne de connexion -->
                  <div class="absolute top-5 left-12 right-12 h-0.5 bg-cyan-300"></div>
                  
                  <!-- Points de progression -->
                  <div class="relative flex justify-between items-center">
                    <div class="flex-1 flex justify-center">
                      <StepCircle number="6" color="cyan" label="Contexte" compact />
                    </div>
                  </div>
                </div>
              </div>
              <ExploreButton @click="router.push('/context')" compact />
            </div>

            <!-- Chain of Thought et Templates restent en format carte -->
            <ModuleCard 
              title="Chain of Thought" 
              description="Raisonnement par étapes"
              icon="LightBulb"
              color="green"
              comingSoon
            />
            <ModuleCard 
              title="Templates" 
              description="Collection de prompts prêts à l'emploi"
              icon="Template"
              color="green"
              :comingSoon="false"
              @click="router.push('/prompt-templates')"
            />
          </div>
        </div>
      </div>

      <!-- Section Extensions -->
      <div class="flex">
        <div class="relative">
          <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
            Ext
          </div>
          <div class="absolute left-16 top-8 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        <div class="ml-12 flex-1">
          <h2 class="text-2xl font-semibold mb-6 text-orange-600 dark:text-orange-400">
            Enrichir les capacités
          </h2>
          <div class="grid grid-cols-3 gap-6">
            <ModuleCard 
              title="RAG" 
              description="Augmenter les connaissances"
              icon="Database"
              color="orange"
              comingSoon
            />
            <ModuleCard 
              title="Agents" 
              description="Ajouter des actions"
              icon="Robot"
              color="orange"
              comingSoon
            />
            <ModuleCard 
              title="Outils" 
              description="Étendre les fonctionnalités"
              icon="Tools"
              color="orange"
              comingSoon
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { defineComponent, h } from 'vue'

// Composants réutilisables
const StepCircle = defineComponent({
  props: {
    number: { type: String, required: true },
    color: { type: String, required: true },
    label: { type: String, required: true },
    compact: { type: Boolean, default: false }
  },
  setup(props) {
    const getColorClass = (color: string) => {
      const colorMap: Record<string, string> = {
        'blue': 'bg-blue-500 hover:bg-blue-600',
        'green': 'bg-green-500 hover:bg-green-600',
        'orange': 'bg-orange-500 hover:bg-orange-600',
        'purple': 'bg-purple-500 hover:bg-purple-600',
        'indigo': 'bg-indigo-500 hover:bg-indigo-600',
        'cyan': 'bg-cyan-500 hover:bg-cyan-600'
      }
      return colorMap[color] || 'bg-gray-500 hover:bg-gray-600'
    }

    const circleSize = props.compact ? 'w-10 h-10' : 'w-12 h-12'
    const textSize = props.compact ? 'text-xs' : 'text-sm'
    
    return () => h('div', { 
      class: 'flex flex-col items-center relative z-10 cursor-pointer' 
    }, [
      h('div', { 
        class: `${circleSize} ${getColorClass(props.color)} rounded-full flex items-center justify-center text-white mb-2 transition-all duration-200 hover:scale-110`
      }, props.number),
      h('span', { 
        class: `${textSize} whitespace-nowrap` 
      }, props.label)
    ])
  }
})

const ExploreButton = defineComponent({
  props: {
    compact: { type: Boolean, default: false }
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('div', { 
      class: `bg-muted/20 rounded p-${props.compact ? '3' : '4'} text-center` 
    }, [
      h(Button, {
        variant: 'outline',
        class: `${props.compact ? 'mt-2' : 'mt-4'} w-full text-sm`,
        onClick: () => emit('click')
      }, () => 'Explorer')
    ])
  }
})

const ModuleCard = defineComponent({
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    comingSoon: { type: Boolean, default: false }
  },
  setup(props) {
    return () => h('div', {
      class: `bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 relative border-2 border-${props.color}-200 dark:border-${props.color}-900`
    }, [
      h('div', { 
        class: 'flex items-center gap-4 mb-4' 
      }, [
        h('div', {
          class: `w-12 h-12 rounded-full bg-${props.color}-100 dark:bg-${props.color}-900/30 flex items-center justify-center`
        }, [
          h('component', {
            is: props.icon,
            class: `w-6 h-6 text-${props.color}-600 dark:text-${props.color}-400`
          })
        ]),
        h('h3', { 
          class: 'text-lg font-semibold' 
        }, props.title)
      ]),
      h('p', { 
        class: 'text-sm text-muted-foreground mb-4' 
      }, props.description),
      props.comingSoon && h('div', {
        class: 'absolute top-2 right-2 px-2 py-1 bg-muted/20 rounded text-xs'
      }, 'Bientôt disponible')
    ])
  }
})

const router = useRouter()
</script>

<style scoped>
/* Animation pour les cercles d'étapes */
.rounded-full {
  transition: transform 0.2s ease-in-out;
  position: relative;
  z-index: 10;
}

.rounded-full:hover {
  transform: scale(1.1);
}

/* Animation pour les boutons */
.button-hover {
  transition: all 0.2s ease;
}

.button-hover:hover {
  transform: translateY(-2px);
}

/* Effet de survol sur les sections */
.bg-gray-50 {
  transition: all 0.3s ease;
}

.bg-gray-50:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Style pour les lignes de connexion */
.steps-container {
  position: relative;
  margin: 0 auto;
}

/* Amélioration de la ligne de connexion */
.bg-blue-300 {
  transition: all 0.3s ease;
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
}

/* Ajout d'un effet de hover sur les étapes */
.steps-container > div > div {
  transition: all 0.3s ease;
}

.steps-container > div > div:hover {
  transform: translateY(-2px);
}

/* Assurer que le texte ne se wrap pas */
.whitespace-nowrap {
  white-space: nowrap;
}

/* Animation pour les cartes */
.grid > div {
  transition: all 0.3s ease;
}

.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Ajustement des espacements pour la version compacte */
.learning-path-section:first-child {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

/* Nouveaux styles pour la timeline */
.timeline-dot {
  position: absolute;
  left: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: currentColor;
}

/* Ajustement des transitions */
.flex {
  transition: all 0.3s ease;
}

.flex:hover .timeline-dot {
  transform: scale(1.2);
}
</style> 