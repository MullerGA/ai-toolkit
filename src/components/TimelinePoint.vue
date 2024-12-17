<template>
  <div 
    class="timeline-point relative cursor-pointer flex flex-col items-center"
    @click="$emit('click')"
  >
    <div 
      class="w-3 h-3 rounded-full transition-all duration-200 z-10"
      :class="[
        active 
          ? 'bg-blue-500 scale-125' 
          : 'bg-blue-200'
      ]"
    ></div>
    <div 
      class="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-center whitespace-nowrap"
      :class="{ 'font-medium': active }"
    >
      {{ point.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  point: {
    id: string
    label: string
    active: boolean
  }
  active: boolean
  isFirst?: boolean
  isLast?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.timeline-point {
  min-width: 60px;
  flex: 1;
  position: relative;
  z-index: 1;
}
</style> 