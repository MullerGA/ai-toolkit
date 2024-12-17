<template>
  <!-- Navbar globale -->
  <nav class="main-navbar">
    <div class="container mx-auto px-6 flex justify-between items-center h-16">
      <!-- Logo Magora -->
      <div class="flex items-center gap-2">
        <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">AI</span>
          </div>
          <img 
            src="@/assets/Magora_Logo_RVB_blanc_1.svg" 
            alt="Magora Logo" 
            class="h-6"
          />
        </router-link>
      </div>

      <!-- Navigation droite -->
      <div class="flex items-center gap-6">
        <!-- Support de formation -->
        <Button variant="ghost" class="nav-button group">
          <BookOpenIcon class="w-5 h-5 mr-2" />
          <span>Support de formation</span>
        </Button>

        <!-- Bouton Questions -->
        <Button class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:opacity-90">
          <MessageCircleQuestionIcon class="w-5 h-5 mr-2" />
          <span>Questions ?</span>
        </Button>
      </div>
    </div>
  </nav>

  <!-- Contenu principal -->
  <main class="pt-16 min-h-screen bg-background">
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { BookOpenIcon, MessageCircleQuestionIcon } from 'lucide-vue-next'
</script>

<style>
.main-navbar {
  @apply fixed top-0 left-0 right-0 z-50;
  background-color: #0f172a; /* slate-900 pour un look plus moderne */
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

/* Style des boutons de navigation */
.nav-button {
  @apply text-gray-300 flex items-center;
  transition: all 0.3s ease-in-out; /* Transition plus lente et plus douce */
}

/* Animation subtile au survol */
.nav-button:hover {
  @apply transform scale-105;
  color: rgba(255, 255, 255, 0.9); /* Blanc légèrement transparent au lieu du blanc pur */
}

/* Effet de gradient sur le texte au survol */
.nav-button:hover span {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400;
  opacity: 0.9; /* Légère transparence pour adoucir l'effet */
  transition: opacity 0.3s ease-in-out;
}

/* Ajout d'une transition pour l'icône */
.nav-button svg {
  transition: transform 0.3s ease-in-out;
}

.nav-button:hover svg {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Animation du logo */
.router-link-active .bg-gradient-to-br {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Transition douce pour tous les éléments interactifs */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>