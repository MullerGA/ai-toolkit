<template>
  <div class="w-full bg-card rounded-lg border shadow-sm p-6">
    <div class="mb-4">
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-medium">Tokenisation du prompt</h4>
        <span class="text-sm text-muted-foreground">
          {{ flattenedTokens.length }} tokens au total
        </span>
      </div>
      <div class="flex flex-wrap gap-3">
        <div v-for="(token, idx) in flattenedTokens" :key="idx"
             class="px-4 py-2 bg-muted rounded-full text-sm">
          <span class="font-medium">{{ token.text }}</span>
          <span class="text-xs text-muted-foreground ml-2">({{ token.word }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  input_tokens: {
    word: string;
    tokens: string[];
  }[];
}

const props = defineProps<Props>();

const flattenedTokens = computed(() => {
  return props.input_tokens.flatMap(word => 
    word.tokens.map(token => ({
      text: token,
      word: word.word
    }))
  );
});
</script> 