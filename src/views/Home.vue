<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
    <div class="container mx-auto px-4 py-16">
      <!-- En-tête -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Formation Intelligence Artificielle
        </h1>
        <p class="text-xl text-slate-600 dark:text-blue-200 max-w-2xl mx-auto">
          Découvrez les fondamentaux des LLM à travers un parcours pédagogique structuré
        </p>
      </div>

      <!-- Parcours de formation vertical -->
      <div class="max-w-4xl mx-auto space-y-8 mb-16">
        <div v-for="(module, moduleIndex) in learningPath" :key="moduleIndex" 
          :data-module="moduleIndex === 0 ? 'introduction' : ''"
          class="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <!-- En-tête du module -->
          <div class="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">{{ moduleIndex + 1 }}</span>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-semibold text-slate-800 dark:text-white">{{ module.title }}</h2>
                <p class="text-slate-600 dark:text-slate-300 mt-1">{{ module.description }}</p>
              </div>
            </div>
          </div>

          <!-- Sous-modules -->
          <div class="p-6 space-y-4">
            <div v-for="(subModule, subIndex) in module.subModules" :key="subIndex"
              class="flex items-start p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
              <div class="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mr-4">
                <span class="text-blue-600 dark:text-blue-400 font-medium">{{ subIndex + 1 }}</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-medium text-slate-800 dark:text-white mb-1">
                  {{ subModule.title }}
                </h3>
                <p class="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  {{ subModule.description }}
                </p>
                <router-link 
                  :to="subModule.route"
                  class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Accéder au module
                  <ChevronRightIcon class="w-4 h-4 ml-1" />
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section objectifs -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-slate-800/30 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Objectifs pédagogiques</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="(objective, index) in learningObjectives" :key="index" 
            class="flex items-start">
            <CheckCircleIcon class="w-6 h-6 text-blue-600 dark:text-blue-500 mr-3 flex-shrink-0 mt-1" />
            <p class="text-slate-700 dark:text-slate-300">{{ objective }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRightIcon, CheckCircleIcon } from 'lucide-vue-next'

const learningPath = [
  {
    title: "Introduction aux LLM",
    description: "Comprendre les fondamentaux des modèles de langage",
    objectives: [
      "Comprendre les principes fondamentaux des LLM",
      "Visualiser le fonctionnement interne",
      "Appréhender le processus de génération",
      "Découvrir la gestion du contexte"
    ],
    subModules: [
      {
        title: "Introduction Générale",
        description: "Les concepts fondamentaux des LLM et leurs applications",
        route: "/introduction",
        sections: [
          "Qu'est-ce qu'un LLM et son fonctionnement",
          "Applications concrètes en entreprise",
          "Concepts clés et fondamentaux"
        ]
      },
      {
        title: "Anatomie d'un LLM",
        description: "Plongée dans la structure interne des modèles de langage",
        route: "/data-processing",
        sections: [
          "Du texte aux tokens : processus de tokenisation",
          "Représentation et relations sémantiques",
          "Structure interne et organisation des connaissances"
        ]
      },
      {
        title: "L'Entonnoir de Décision",
        description: "Comprendre le processus de génération de texte",
        route: "/llm-visualization",
        sections: [
          "Processus de génération et paramètres",
          "Démonstration interactive de l'entonnoir",
          "Points d'attention et bonnes pratiques"
        ]
      },
      {
        title: "Mémoire et Contexte",
        description: "Explorer la gestion du contexte et de la mémoire",
        route: "/context",
        sections: [
          "Gestion de la conversation et du contexte",
          "Démonstration interactive de la mémoire",
          "Limites et considérations pratiques"
        ]
      }
    ]
  },
  {
    title: "Paramètres et Prompting",
    description: "Maîtriser les techniques de prompting",
    subModules: [
      {
        title: "Techniques de Prompting",
        description: "Apprendre les bases du prompting efficace",
        route: "/prompting"
      },
      {
        title: "Templates de Prompts",
        description: "Utiliser des modèles de prompts optimisés",
        route: "/prompt-templates"
      }
    ]
  },
  {
    title: "Applications Pratiques",
    description: "Mise en pratique des concepts",
    subModules: [
      {
        title: "Génération Locale",
        description: "Pratiquer avec la génération locale",
        route: "/local-generation"
      },
      {
        title: "À propos du projet",
        description: "En savoir plus sur le projet",
        route: "/about"
      }
    ]
  }
]

const learningObjectives = [
  "Comprendre en profondeur le fonctionnement des modèles de langage (LLM)",
  "Maîtriser les paramètres de contrôle pour des résultats optimaux",
  "Visualiser l'impact des différents paramètres sur les générations",
  "Développer une approche méthodique de l'utilisation des LLM",
  "Acquérir les bonnes pratiques professionnelles",
  "Être capable d'optimiser les prompts pour des résultats précis"
]
</script>

<style scoped>
/* Animation d'entrée pour les cartes */
.grid > div {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 