<script setup lang="ts">
// Optional live embed of a demo page. Requires the Next.js app on :3000.
const props = defineProps<{ slug: string }>()
const url = `http://localhost:3000/${props.slug}`
</script>

<template>
  <iframe :src="url" class="demo-frame" loading="lazy" />
</template>

<style scoped>
.demo-frame {
  width: 100%;
  height: 420px;
  border: 1px solid var(--iu-border);
  border-radius: 0.75rem;
  background: white;
}
</style>
