<template>
  <div class="presentation-controls fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
    <div class="navigation-controls flex gap-2 mb-2">
      <Button 
        @click="store.previousSection"
        :disabled="store.currentSection === 0"
        variant="outline"
        size="sm"
      >
        ← Précédent
      </Button>
      <Button 
        @click="store.nextSection"
        :disabled="store.currentSection === store.totalSections - 1"
        variant="outline"
        size="sm"
      >
        Suivant →
      </Button>
    </div>
    <div class="focus-toggle mb-2">
      <Button 
        @click="store.toggleFocusMode" 
        variant="outline"
        size="sm"
        class="w-full"
      >
        {{ store.isFocusMode ? 'Quitter le mode focus (f)' : 'Mode focus (f)' }}
      </Button>
    </div>
    <div class="navigation-help text-xs text-slate-600 dark:text-slate-400">
      <p>← → : Navigation</p>
      <p>F : Mode focus</p>
      <p>Échap : Quitter</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { usePresentationStore } from '@/stores/presentation'

const store = usePresentationStore()
</script>