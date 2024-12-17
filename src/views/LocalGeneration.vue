<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Génération de Texte Local</CardTitle>
        <CardDescription>
          Expérimentez la génération de texte directement dans votre navigateur, sans appel API externe.
          Tout s'exécute localement grâce à Transformer.js.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Statut du Modèle avec plus de détails -->
        <div class="flex flex-col space-y-4">
          <!-- État général -->
          <div class="flex items-center space-x-2">
            <div 
              :class="[
                'w-2 h-2 rounded-full',
                modelStatus === 'ready' ? 'bg-green-500' : 
                modelStatus === 'loading' ? 'bg-yellow-500' : 
                'bg-red-500'
              ]"
            ></div>
            <span class="text-sm font-medium">{{ modelStatusText }}</span>
          </div>

          <!-- Zone de téléchargement -->
          <div v-if="modelStatus === 'loading' && downloadStatus.length > 0" class="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
            <h3 class="text-sm font-medium mb-3">Téléchargement des fichiers</h3>
            <div class="space-y-4">
              <div v-for="(status, index) in downloadStatus" :key="index" class="space-y-2">
                <!-- Nom du fichier et progression -->
                <div class="flex justify-between text-xs">
                  <span class="font-medium">{{ status.file.split('/').pop() }}</span>
                  <span>{{ Math.round(status.progress) }}%</span>
                </div>
                
                <!-- Barre de progression -->
                <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    :style="{ width: `${status.progress}%` }"
                  ></div>
                </div>
                
                <!-- Taille téléchargée -->
                <div class="text-xs text-right text-muted-foreground">
                  {{ formatBytes(status.loaded) }} / {{ formatBytes(status.total) }}
                </div>
              </div>
            </div>

            <!-- Progression globale -->
            <div class="mt-4 pt-4 border-t">
              <div class="flex justify-between text-xs mb-2">
                <span class="font-medium">Progression globale</span>
                <span>{{ Math.round(loadingProgress) }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-green-500 transition-all duration-300 rounded-full"
                  :style="{ width: `${loadingProgress}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Message d'erreur -->
          <div v-if="modelStatus === 'error'" class="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            Une erreur est survenue lors du chargement du modèle. Veuillez rafraîchir la page.
          </div>
        </div>

        <!-- Contenu principal masqué pendant le chargement -->
        <div v-if="modelStatus !== 'loading'" class="space-y-6">
          <!-- Zone de Prompt -->
          <div class="space-y-2">
            <Label for="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              v-model="prompt"
              placeholder="Entrez votre prompt ici... Par exemple: 'Il était une fois'"
              :rows="4"
              :disabled="isGenerating"
            />
            <div class="text-xs text-right text-muted-foreground">
              {{ prompt.length }} caractères
            </div>
          </div>

          <!-- Paramètres -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Température</Label>
              <div class="flex items-center space-x-2">
                <Slider
                  v-model="temperature"
                  class="w-full"
                  :min="0.1"
                  :max="1"
                  :step="0.1"
                  :disabled="isGenerating"
                />
                <span class="text-sm w-12">{{ temperature[0].toFixed(1) }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Longueur maximale</Label>
              <Select v-model="maxLength" :disabled="isGenerating">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une longueur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 tokens</SelectItem>
                  <SelectItem value="100">100 tokens</SelectItem>
                  <SelectItem value="200">200 tokens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Nombre de variantes</Label>
            <div class="flex space-x-2">
              <Button
                v-for="n in 3"
                :key="n"
                variant="outline"
                :class="{ 'bg-primary text-primary-foreground': variants === n }"
                @click="variants = n"
                :disabled="isGenerating"
              >
                {{ n }}
              </Button>
            </div>
          </div>

          <!-- Bouton de Génération -->
          <Button 
            class="w-full"
            :disabled="!canGenerate"
            @click="generateText"
          >
            <Loader2Icon v-if="isGenerating" class="mr-2 h-4 w-4 animate-spin" />
            {{ isGenerating ? 'Génération en cours...' : 'Générer' }}
          </Button>

          <!-- Résultats -->
          <div v-if="results.length > 0" class="space-y-4">
            <div v-for="(result, index) in results" :key="index" class="relative">
              <Card>
                <CardHeader class="pb-2">
                  <div class="flex justify-between items-center">
                    <CardTitle class="text-sm">Variante {{ index + 1 }}</CardTitle>
                    <Button variant="ghost" size="sm" @click="copyToClipboard(result.text)">
                      <CopyIcon class="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription class="text-xs">
                    Généré en {{ result.time }}ms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p class="whitespace-pre-line">{{ result.text }}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <!-- Indicateur de chargement -->
        <div v-else class="flex justify-center py-12">
          <Loader2Icon class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2Icon, CopyIcon } from 'lucide-vue-next'
import { useTextGeneration } from '@/composables/useTextGeneration'

// Fonction pour formater les bytes
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const {
  modelStatus,
  modelStatusText,
  loadingProgress,
  generateText: generate,
  isGenerating,
  downloadStatus,
  currentFile
} = useTextGeneration()

const prompt = ref('')
const temperature = ref<number[]>([0.7])
const maxLength = ref<string>('100')
const variants = ref(1)
const results = ref<Array<{ text: string; time: number }>>([])

const canGenerate = computed(() => {
  return modelStatus.value === 'ready' && 
         prompt.value.trim().length > 0 && 
         !isGenerating.value
})

const generateText = async () => {
  results.value = []
  const startTime = performance.now()
  
  try {
    const generated = await generate(prompt.value, {
      temperature: temperature.value[0],
      maxLength: parseInt(maxLength.value, 10),
      numVariants: variants.value
    })
    
    results.value = generated.map((text: string) => ({
      text,
      time: Math.round(performance.now() - startTime)
    }))
  } catch (error) {
    console.error('Erreur de génération:', error)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Erreur de copie:', error)
  }
}
</script> 