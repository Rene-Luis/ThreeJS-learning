<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="navbar">
      <div class="navbar__brand">
        Three.js Learning
      </div>

      <nav class="navbar__links">
        <RouterLink to="/">Practica 0</RouterLink>
        <RouterLink to="/cube">Cubo</RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <section class="display">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
}

.navbar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 32px;

  background: #202020;
  color: white;
}

.navbar__brand {
  font-size: 1.2rem;
  font-weight: bold;
}

.navbar__links {
  display: flex;
  gap: 24px;
}

.navbar__links a {
  color: #cccccc;
  text-decoration: none;
}

.navbar__links a:hover {
  color: white;
}

.navbar__links a.router-link-active {
  color: white;
  font-weight: bold;
}

.main-content {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px;
}

.display {
  width: 80%;
  height: calc(100vh - 112px);

  background: white;

  border-radius: 12px;
  overflow: hidden;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>