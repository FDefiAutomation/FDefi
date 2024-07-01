<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title
          >FDefi Bot
          <span style="font-size: 0.7em; color: #d4d4d4"
            >v 0.0.6 (Beta)</span
          ></q-toolbar-title
        >
        <q-btn to="/" flat round dense icon="home" />
        <q-btn to="/help" flat round dense icon="help" />
        <q-btn to="/strategies" flat round dense icon="trending_up" />
        <q-btn to="/checkpair" flat round dense icon="star" />
        <q-btn to="/settings" flat round dense icon="settings" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { QLayout } from "quasar"; // Import the necessary Quasar components

export default defineComponent({
  components: {
    QLayout, // Register the QLayout component
    // Register other Quasar components as needed
  },
});
</script>
