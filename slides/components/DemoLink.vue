<script setup lang="ts">
// Big "go to the demo" button. The Next.js app must be running on :3000 (pnpm dev).
const props = defineProps<{ slug: string; n?: number }>()
const url = `http://localhost:3000/${props.slug}`
</script>

<template>
  <a :href="url" target="_blank" rel="noopener" class="demo-link">
    <span class="demo-kicker">Demo<template v-if="n"> {{ n }}</template></span>
    <span class="demo-url">localhost:3000/{{ slug }}</span>
  </a>
</template>

<style scoped>
.demo-link {
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem 2rem;
  border-radius: 1rem;
  border: 2px solid var(--iu-accent);
  background: color-mix(in srgb, var(--iu-accent) 12%, transparent);
  text-decoration: none !important;
  border-bottom: 2px solid var(--iu-accent) !important;
}
.demo-kicker {
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--iu-accent);
  font-weight: 700;
}
.demo-url {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.6rem;
  font-weight: 600;
}
</style>
