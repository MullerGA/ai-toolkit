<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-7xl mx-auto border-blue-100 dark:border-blue-900">
      <CardHeader class="pb-4 border-b">
        <div class="flex justify-between items-start">
          <div>
            <CardTitle>Templates de Prompts</CardTitle>
            <CardDescription>
              Collection de modèles de prompts prêts à l'emploi
            </CardDescription>
          </div>
          <Button variant="outline" @click="showInfo = true">
            En savoir plus
          </Button>
        </div>
      </CardHeader>

      <div class="p-6">
        <!-- Filtres -->
        <div class="flex flex-wrap gap-4 mb-8">
          <!-- Catégories -->
          <Select v-model="selectedCategory">
            <SelectTrigger class="w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="academic">Académique</SelectItem>
              <SelectItem value="creative">Créatif</SelectItem>
              <SelectItem value="technical">Technique</SelectItem>
            </SelectContent>
          </Select>

          <!-- Niveau de complexité -->
          <Select v-model="selectedComplexity">
            <SelectTrigger class="w-[200px]">
              <SelectValue placeholder="Complexité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="basic">Basique</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>

          <!-- Tags populaires -->
          <div class="flex flex-wrap gap-2">
            <Badge 
              v-for="tag in popularTags" 
              :key="tag"
              variant="outline"
              class="cursor-pointer"
              :class="{ 'bg-blue-500 text-white': selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </Badge>
          </div>
        </div>

        <!-- Grille de templates -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="template in filteredTemplates" :key="template.id" class="hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900">
            <CardHeader>
              <CardTitle class="text-lg">{{ template.title }}</CardTitle>
              <CardDescription>{{ template.description }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" class="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  {{ tag }}
                </Badge>
              </div>
              <div class="text-sm text-muted-foreground">
                Complexité: {{ template.complexity }}
              </div>
            </CardContent>
            <CardFooter class="flex justify-between">
              <Button variant="outline" size="sm" @click="showPromptPreview(template)">
                Aperçu
              </Button>
              <Button size="sm" @click="copyPrompt(template.prompt)">
                Copier
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const selectedCategory = ref('all')
const selectedComplexity = ref('all')
const selectedTags = ref<string[]>([])

const popularTags = [
  'Analyse',
  'Résumé',
  'Rédaction',
  'Traduction',
  'Brainstorming',
  'Code',
  'Data',
  'Marketing'
]

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

interface Template {
  id: string
  title: string
  description: string
  category: string
  complexity: string
  tags: string[]
  prompt: string
}

const templates: Template[] = [
  {
    id: 'analysis-basic',
    title: 'Analyse de Données Simple',
    description: 'Template basique pour analyser un jeu de données',
    category: 'business',
    complexity: 'basic',
    tags: ['Analyse', 'Data'],
    prompt: 'Analyse ces données et fournis les points clés'
  },
  {
    id: 'summary-advanced',
    title: 'Résumé Structuré',
    description: 'Template avancé pour résumer un document avec structure',
    category: 'academic',
    complexity: 'advanced',
    tags: ['Résumé', 'Rédaction'],
    prompt: 'En tant qu\'expert en synthèse...'
  },
  {
    id: 'code-review',
    title: 'Revue de Code',
    description: 'Template pour analyser et améliorer du code',
    category: 'technical',
    complexity: 'intermediate',
    tags: ['Code', 'Analyse'],
    prompt: 'Examine ce code et suggère des améliorations...'
  },
  {
    id: 'marketing-copy',
    title: 'Copie Marketing',
    description: 'Template pour générer du contenu marketing',
    category: 'business',
    complexity: 'intermediate',
    tags: ['Marketing', 'Rédaction'],
    prompt: 'Crée un texte marketing persuasif...'
  }
]

// Mise à jour de la logique de filtrage
const filteredTemplates = computed(() => {
  return templates.filter(template => {
    const categoryMatch = selectedCategory.value === 'all' || template.category === selectedCategory.value
    const complexityMatch = selectedComplexity.value === 'all' || template.complexity === selectedComplexity.value
    const tagsMatch = selectedTags.value.length === 0 || 
      template.tags.some(tag => selectedTags.value.includes(tag))
    
    return categoryMatch && complexityMatch && tagsMatch
  })
})

// Ajout des fonctions pour la copie et l'aperçu
const copyPrompt = (prompt: string) => {
  navigator.clipboard.writeText(prompt)
  // Ajouter une notification de succès si souhaité
}

const showPromptPreview = (template: Template) => {
  // Implémenter la logique d'aperçu (modal, etc.)
  console.log('Aperçu:', template.prompt)
}
</script> 