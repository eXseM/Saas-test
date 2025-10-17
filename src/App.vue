<script setup lang="ts">
import AccountForm from '@/components/AccountForm.vue';
</script>

<template>
  <v-app theme="datkTheme">
    <v-main>
      <v-container fluid class="pa-6">
        <AccountForm />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">

.v-application {
  background-color: #121212;
}

.v-card {
  background: #1e1e1e;
}

</style>
