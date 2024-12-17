<template>
  <nav class="border-b">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <RouterLink to="/" class="text-xl font-bold">
          AI Toolkit
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-4">
          <Button variant="ghost" @click="router.push('/')">Accueil</Button>
          <Button variant="ghost" @click="router.push('/demos')">Démos</Button>
          <Button variant="ghost" @click="router.push('/about')">À propos</Button>
        </div>

        <!-- Mobile Navigation -->
        <Sheet>
          <SheetTrigger class="md:hidden">
            <Button variant="ghost" size="icon">
              <Bars3Icon class="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div class="flex flex-col space-y-4 mt-4">
              <Button variant="ghost" @click="navigateTo('/')">Accueil</Button>
              <Button variant="ghost" @click="navigateTo('/demos')">Démos</Button>
              <Button variant="ghost" @click="navigateTo('/about')">À propos</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script> 