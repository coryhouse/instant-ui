<script setup lang="ts">
// "Go to the demo" link. The Next.js app must be running on :3000 (pnpm dev).
// `corner` renders a compact pill pinned to the slide's top-right corner.
const props = defineProps<{ slug: string; n?: number; corner?: boolean }>()
const url = `http://localhost:3000/${props.slug}`
</script>

<template>
  <a :href="url" target="_blank" rel="noopener" class="demo-link" :class="{ corner }">
    <span class="demo-kicker">Demo<template v-if="n"> {{ n }}</template> ↗</span>
    <span class="demo-url">/{{ slug }}</span>
  </a>
</template>

<style scoped>
.demo-link {
  display: inline-flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 1rem 1.75rem;
  border-radius: 1rem;
  border: 2px solid var(--iu-accent) !important;
  background: color-mix(in srgb, var(--iu-accent) 12%, transparent);
  text-decoration: none !important;
}
.demo-link.corner {
  position: absolute;
  top: 1.75rem;
  right: 2.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 0.75rem;
  z-index: 10;
}
.demo-kicker {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--iu-accent);
  font-weight: 700;
}
.demo-url {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.5rem;
  font-weight: 600;
}
.corner .demo-url {
  font-size: 1rem;
}
</style>
