import { ref, computed, onMounted } from 'vue'
import { pipeline } from '@xenova/transformers'

// Configuration de base
const MODEL_CONFIG = {
  model: 'Xenova/tiny-gpt2',
  revision: 'main',
  quantized: true,
  config: {
    model_url: 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.15.1/models/Xenova/tiny-gpt2/',
    tokenizer_url: 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.15.1/tokenizers/Xenova/tiny-gpt2/'
  }
}

type ModelStatus = 'loading' | 'ready' | 'error'
type DownloadStatus = {
  file: string
  progress: number
  loaded: number
  total: number
}

export function useTextGeneration() {
  const modelStatus = ref<ModelStatus>('loading')
  const loadingProgress = ref(0)
  const isGenerating = ref(false)
  const currentFile = ref('')
  const downloadStatus = ref<DownloadStatus[]>([])
  let generator: any = null

  const modelStatusText = computed(() => {
    if (modelStatus.value === 'loading') {
      return currentFile.value 
        ? `Téléchargement de ${currentFile.value}` 
        : 'Initialisation du modèle...'
    }
    return modelStatus.value === 'ready' ? 'Modèle prêt' : 'Erreur de chargement'
  })

  // Initialisation du modèle
  const initModel = async () => {
    console.log('Initialisation du modèle...')
    try {
      // Réinitialisation des états
      downloadStatus.value = []
      currentFile.value = ''
      
      // Configuration du pipeline avec gestion des erreurs
      generator = await pipeline('text-generation', MODEL_CONFIG.model, {
        progress_callback: (progress: any) => {
          console.log('Progression reçue:', progress)

          // Si progress est un nombre, c'est la progression globale
          if (typeof progress === 'number') {
            loadingProgress.value = Math.round(progress * 100)
            return
          }

          // Si progress est un objet avec status "downloading"
          if (progress?.status === 'downloading' && progress.file) {
            const fileName = progress.file.split('/').pop() || progress.file
            currentFile.value = fileName

            // Mise à jour ou création d'un nouvel état de téléchargement
            const fileStatus = downloadStatus.value.find(d => d.file === progress.file)
            if (fileStatus) {
              fileStatus.progress = (progress.loaded / progress.total) * 100
              fileStatus.loaded = progress.loaded
              fileStatus.total = progress.total
            } else {
              downloadStatus.value.push({
                file: progress.file,
                progress: (progress.loaded / progress.total) * 100,
                loaded: progress.loaded,
                total: progress.total
              })
            }

            // Forcer la réactivité
            downloadStatus.value = [...downloadStatus.value]
          }

          // Si progress a une propriété progress, c'est la progression globale
          if (typeof progress?.progress === 'number') {
            loadingProgress.value = Math.round(progress.progress * 100)
          }
        },
        ...MODEL_CONFIG.config,
        quantized: MODEL_CONFIG.quantized,
        revision: MODEL_CONFIG.revision,
        cache: true,
        local: true
      })
      
      console.log('Modèle chargé avec succès')
      modelStatus.value = 'ready'
    } catch (error) {
      console.error('Erreur d\'initialisation du modèle:', error)
      modelStatus.value = 'error'
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
    }
  }

  // Génération de texte
  const generateText = async (
    prompt: string,
    options: {
      temperature: number
      maxLength: number
      numVariants: number
    }
  ) => {
    if (!generator || modelStatus.value !== 'ready') {
      throw new Error('Modèle non initialisé')
    }

    isGenerating.value = true
    try {
      const results = []
      for (let i = 0; i < options.numVariants; i++) {
        const result = await generator(prompt, {
          max_length: options.maxLength,
          temperature: options.temperature,
          num_return_sequences: 1
        })
        results.push(result[0].generated_text)
      }
      return results
    } finally {
      isGenerating.value = false
    }
  }

  // Initialisation au montage
  onMounted(() => {
    initModel()
  })

  return {
    modelStatus,
    modelStatusText,
    loadingProgress,
    isGenerating,
    generateText,
    downloadStatus,
    currentFile
  }
} 