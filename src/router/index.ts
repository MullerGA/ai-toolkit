import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DataProcessing from '@/views/DataProcessing.vue'
import Prompting from '@/views/Prompting.vue'
import PromptTemplates from '@/views/PromptTemplates.vue'
import Introduction from '@/views/Introduction.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/introduction',
      name: 'introduction',
      component: Introduction
    },
    {
      path: '/local-generation',
      name: 'local-generation',
      component: () => import('@/views/LocalGeneration.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/llm-visualization',
      name: 'llm-visualization',
      component: () => import('../views/LLMVisualization.vue')
    },
    {
      path: '/data-processing',
      name: 'data-processing',
      component: DataProcessing
    },
    {
      path: '/prompting',
      name: 'prompting',
      component: Prompting
    },
    {
      path: '/prompt-templates',
      name: 'prompt-templates',
      component: PromptTemplates
    },
    {
      path: '/context',
      name: 'Context',
      component: () => import('@/views/ContextVisualization.vue')
    },
    {
      path: '/local-generation',
      name: 'local-generation',
      component: () => import('@/views/LocalGeneration.vue')
    }
  ]
})

export default router 