```vue
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Footer from './components/my-footer.vue'
</script>

<template>
  <div class="app">
    <header class="navbar">
      <div class="navbar__brand">
        IGV - Practice Views
      </div>

      <nav class="navbar__links">
        <RouterLink to="/">Practice 0</RouterLink>
        <RouterLink to="/P1">Practice 1</RouterLink>
        <!--<RouterLink to="/P2">Practice 2</RouterLink>-->
        <RouterLink to="/Transformations">Transformations</RouterLink>
        <RouterLink to="/Cameras">Cameras</RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <section class="display">
        <RouterView />
      </section>
    </main>

    <Footer />
  </div>
</template>

<style>
/* ============================================================
   RESET GENERAL
   ============================================================ */

html,
body,
#app {
  margin: 0;
  padding: 0;

  width: 100%;
  min-height: 100%;

  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  min-height: 100vh;

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Arial,
    sans-serif;

  background: #f3f3f3;
}


/* APLICACIÓN */

.app {
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  background: #f3f3f3;
}


/*  BARRA DE NAVEGACIÓN */

.navbar {
  width: 100%;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 32px;

  background: #202020;
  color: white;

  flex-shrink: 0;
}


/* Título */

.navbar__brand {
  font-size: 1.1rem;
  font-weight: 500;

  letter-spacing: 0.2px;

  white-space: nowrap;
}


/* Contenedor de enlaces */

.navbar__links {
  display: flex;
  align-items: center;

  gap: 24px;
}


/* Enlaces */

.navbar__links a {
  color: #cfcfcf;

  text-decoration: none;

  font-size: 0.95rem;
  font-weight: 400;

  transition:
    color 0.2s ease,
    opacity 0.2s ease;
}


.navbar__links a:hover {
  color: white;
}


/* Ruta actualmente activa */

.navbar__links a.router-link-active {
  color: white;
  font-weight: 500;
}


/* CONTENIDO PRINCIPAL */

.main-content {
  flex: 1;

  display: flex;

  justify-content: center;
  align-items: center;

  width: 100%;

  padding: 24px;
}


/* VISOR */

.display {
  width: min(80%, 1400px);

  height: calc(100vh - 112px);

  position: relative;

  background: white;

  border-radius: 12px;

  overflow: hidden;

  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.12);
}


/* Hace que la vista cargada por RouterView
   pueda ocupar todo el visor */

.display > * {
  width: 100%;
  height: 100%;
}

/*  RESPONSIVE */

@media (max-width: 768px) {

  .navbar {
    height: auto;

    min-height: 64px;

    padding: 12px 16px;

    gap: 16px;
  }

  .navbar__brand {
    font-size: 1rem;
  }

  .navbar__links {
    gap: 14px;
  }

  .navbar__links a {
    font-size: 0.9rem;
  }

  .main-content {
    padding: 12px;
  }

  .display {
    width: 100%;

    height: calc(100vh - 88px);

    border-radius: 8px;
  }
}
</style>
```
