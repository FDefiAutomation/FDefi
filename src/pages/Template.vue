<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="incrementCounter">Increment Counter</button>
    <button @click="decrementCounter">Decrement Counter</button>
    <p>Counter: {{ counter }}</p>
    <p>Counter doubled: {{ doubledCounter }}</p>
    <p>Watched Value: {{ watchedValue }}</p>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";

export default {
  name: "IndexPage",
  setup() {
    // Message shown when component is mounted
    const message = ref("");

    // Counter variable with increment and decrement functions
    const counter = ref(0);
    function incrementCounter() {
      counter.value++;
    }
    function decrementCounter() {
      counter.value--;
    }

    // Computed property to double the counter value
    const doubledCounter = computed(() => counter.value * 2);

    // Watched variable that toggles based on counter's value
    const watchedValue = ref(false);
    watch(counter, (newValue) => {
      watchedValue.value = newValue % 2 === 0;
    });

    // Set initial message when the component is mounted
    onMounted(() => {
      message.value = "Welcome to Vue 3 with Composition API!";
    });

    // Return refs and methods to be used in the template
    return {
      message,
      counter,
      incrementCounter,
      decrementCounter,
      doubledCounter,
      watchedValue,
    };
  },
};
</script>
<style scoped></style>
