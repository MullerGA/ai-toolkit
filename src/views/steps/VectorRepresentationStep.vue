<template>
  <div class="space-y-8">
    <!-- Introduction -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <p class="text-base leading-relaxed">
          Après la tokenisation, chaque token est transformé en 
          <span class="font-medium">vecteur</span> : une série de nombres qui représente sa 
          <span class="italic">position dans un espace multidimensionnel</span>. Cette transformation 
          permet au modèle de capturer les <span class="font-medium text-primary">nuances de sens</span> 
          et les <span class="font-medium">relations</span> entre les tokens.
        </p>
      </CardContent>
    </Card>

    <!-- Sélection du scénario -->
    <div class="flex gap-4 mb-4">
      <Button 
        v-for="s in scenarios" 
        :key="s.id"
        variant="outline"
        :class="{ 'bg-primary text-primary-foreground': currentScenario === s.id }"
        @click="$emit('update:scenario', s.id)"
      >
        {{ s.name }}
      </Button>
    </div>

    <!-- Explications -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <div class="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <h4 class="font-medium text-foreground mb-2">Coordonnées Vectorielles</h4>
            <p>Les coordonnées numériques représentent la position de chaque token dans l'espace vectoriel.
               Chaque vecteur contient 3 dimensions pour cet exemple pédagogique.</p>
          </div>
          <div>
            <h4 class="font-medium text-foreground mb-2">Visualisation Spatiale</h4>
            <p>La représentation en 3D montre comment les tokens se positionnent dans l'espace.
               Plus deux tokens sont proches, plus leur sens est relié.</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Représentation vectorielle -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Représentation vectorielle</h3>
        <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
          <CardContent class="p-6">
            <div class="space-y-2">
              <div 
                v-for="vector in vectors" 
                :key="vector.token" 
                class="flex items-center justify-between p-2 bg-blue-100 
                       dark:bg-blue-900/20 rounded-md hover:shadow-md transition-shadow"
                @click="selectVector(vector)"
                :class="{ 'ring-2 ring-primary': selectedVector?.token === vector.token }"
              >
                <span class="font-medium">{{ vector.token }}</span>
                <span class="font-mono text-sm text-muted-foreground">
                  [{{ vector.values.map(v => v.toFixed(2)).join(', ') }}]
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Visualisation 3D -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Visualisation 3D</h3>
        <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
          <CardContent class="p-6">
            <div 
              ref="container3D" 
              class="h-[300px] w-full relative rounded-md overflow-hidden"
            >
              <!-- Légende -->
              <div class="absolute top-2 right-2 bg-background/80 p-2 rounded text-xs space-y-1">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Représentation vectorielle</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Token sélectionné</span>
                </div>
              </div>
            </div>
            
            <!-- Contrôles -->
            <div class="mt-4 flex gap-4 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                @click="resetCamera"
              >
                Réinitialiser la vue
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                @click="toggleAnimation"
              >
                {{ isAnimating ? 'Arrêter' : 'Animer' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Points clés -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <h4 class="font-medium mb-3">Points essentiels :</h4>
        <ul class="grid md:grid-cols-2 gap-4 text-sm">
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
            <span>Chaque token (pas chaque mot) a sa propre représentation vectorielle</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
            <span>La position dans l'espace reflète le sens et l'usage du token</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
            <span>Les tokens de sens proche se retrouvent proches dans l'espace</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
            <span>Cette représentation permet au modèle de comprendre les nuances et les relations entre tokens</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    <!-- Note technique -->
    <Card class="bg-slate-50 dark:bg-slate-800/50 transition-all hover:shadow-md">
      <CardContent class="p-6">
        <h4 class="font-medium text-primary mb-2">Note technique</h4>
        <p class="text-sm leading-relaxed">
          Dans un LLM réel, ces vecteurs ont typiquement entre 768 et 4096 dimensions, 
          permettant de capturer des relations sémantiques beaucoup plus riches et complexes 
          que notre visualisation 3D simplifiée.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface Token {
  token: string
  vector: number[]
}

interface Scenario {
  id: string
  name: string
  input: string
  tokens: Token[]
  description: string
}

const props = defineProps<{
  scenario: string
  scenarios: Scenario[]
}>()

defineEmits<{
  'update:scenario': [scenarioId: string]
}>()

const currentScenario = computed(() => props.scenario)
const currentScenarioData = computed(() => {
  return props.scenarios.find(s => s.id === currentScenario.value) || props.scenarios[0]
})

// État local
const container3D = ref<HTMLElement | null>(null)
const selectedVector = ref<{ token: string; values: number[] } | null>(null)
const isAnimating = ref(false)

// Configuration Three.js
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let vectorObjects: THREE.Group
let animationFrameId: number

// Adapter les vecteurs en fonction du scénario
const vectors = computed(() => {
  return currentScenarioData.value.tokens.map(token => ({
    token: token.token,
    values: token.vector.map(v => v * 2 - 1) // Normaliser les valeurs entre -1 et 1
  }))
})

// Watcher pour mettre à jour la visualisation 3D quand les vecteurs changent
watch(vectors, () => {
  if (scene && vectorObjects) {
    // Nettoyer les anciens objets
    scene.remove(vectorObjects)
    
    // Créer les nouveaux objets
    createVectorObjects()
  }
}, { deep: true })

// Modification de l'initialisation de la scène 3D
const initThreeJS = () => {
  if (!container3D.value) return

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container3D.value.clientWidth / container3D.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(1.2, 1.2, 1.2)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container3D.value.clientWidth, container3D.value.clientHeight)
  container3D.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minDistance = 0.5
  controls.maxDistance = 4

  // Axes helper
  const axesHelper = new THREE.AxesHelper(0.8)
  scene.add(axesHelper)

  // Grid helper
  const gridHelper = new THREE.GridHelper(1.6, 16)
  scene.add(gridHelper)

  // Création initiale des vecteurs
  createVectorObjects()

  // Animation loop
  animate()
}

// Modification de la création des objets vecteurs
const createVectorObjects = () => {
  // Créer un nouveau groupe
  vectorObjects = new THREE.Group()
  
  // Réinitialiser la sélection
  selectedVector.value = null
  
  vectors.value.forEach((vector) => {
    // Utiliser directement les valeurs du vecteur normalisées
    const [x, y, z] = vector.values
    
    // Ligne du vecteur
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z)
    ])
    
    const material = new THREE.LineBasicMaterial({ 
      color: 0x0066ff,
      linewidth: 2
    })
    
    const line = new THREE.Line(geometry, material)
    
    // Sphère à l'extrémité
    const sphereGeometry = new THREE.SphereGeometry(0.02)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0066ff })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.set(x, y, z)
    
    // Création du label
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      canvas.width = 128
      canvas.height = 32
      context.fillStyle = '#000000'
      context.font = '24px Arial'
      context.textAlign = 'center'
      context.fillText(vector.token, canvas.width / 2, canvas.height / 2)
      
      const texture = new THREE.CanvasTexture(canvas)
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      })
      const label = new THREE.Sprite(labelMaterial)
      label.position.set(x, y + 0.05, z)
      label.scale.set(0.1, 0.025, 1)
      
      const vectorGroup = new THREE.Group()
      vectorGroup.add(line)
      vectorGroup.add(sphere)
      vectorGroup.add(label)
      vectorGroup.userData = { token: vector.token }
      
      vectorObjects.add(vectorGroup)
    }
  })
  
  // Ajouter le nouveau groupe à la scène
  scene.add(vectorObjects)
}

// Animation
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  
  if (isAnimating.value) {
    vectorObjects.rotation.y += 0.01
  }
  
  controls.update()
  renderer.render(scene, camera)
}

// Mise à jour de la fonction selectVector pour gérer les labels
const selectVector = (vector: { token: string; values: number[] }) => {
  selectedVector.value = vector
  
  vectorObjects.children.forEach((group: THREE.Group) => {
    const line = group.children[0] as THREE.Line
    const sphere = group.children[1] as THREE.Mesh
    const label = group.children[2] as THREE.Sprite
    
    if (group.userData.token === vector.token) {
      (line.material as THREE.LineBasicMaterial).color.setHex(0x00ff00)
      ;(sphere.material as THREE.MeshBasicMaterial).color.setHex(0x00ff00)
      label.scale.set(0.12, 0.03, 1) // Label légèrement plus grand quand sélectionné
    } else {
      (line.material as THREE.LineBasicMaterial).color.setHex(0x0066ff)
      ;(sphere.material as THREE.MeshBasicMaterial).color.setHex(0x0066ff)
      label.scale.set(0.1, 0.025, 1)
    }
  })
}

// Mise à jour de la fonction resetCamera
const resetCamera = () => {
  camera.position.set(1.2, 1.2, 1.2)
  camera.lookAt(0, 0, 0)
  controls.reset()
}

const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
}

// Gestion du cycle de vie
onMounted(() => {
  initThreeJS()
  
  // Gestion du redimensionnement
  const handleResize = () => {
    if (!container3D.value) return
    
    camera.aspect = container3D.value.clientWidth / container3D.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container3D.value.clientWidth, container3D.value.clientHeight)
  }
  
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (container3D.value) {
    container3D.value.removeChild(renderer.domElement)
  }
  
  // Nettoyage de la mémoire
  scene.clear()
  renderer.dispose()
})
</script>

<style scoped>
.vector-point {
  transition: all 0.3s ease;
}

.vector-point:hover {
  transform: scale(1.2);
}

/* Ajout de styles pour améliorer la lisibilité des labels */
canvas {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style> 