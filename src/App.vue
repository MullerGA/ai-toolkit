<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
</script>