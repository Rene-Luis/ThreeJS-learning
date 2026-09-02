<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/three">Three.js</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>