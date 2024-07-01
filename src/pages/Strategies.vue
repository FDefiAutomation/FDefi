<template>
  <q-page class="q-pa-lg">
    <div class="text-h3">Strategies</div>
    <div class="q-ma-md">
      <p v-if="!showStrategies" class="title text-black text-bold q-pa-md">
        You need "Gold" or "Platinum" plan to have access to strategies.
      </p>

      <p
        v-if="showStrategies"
        class="title q-mt-lg bg-yellow text-black q-pa-md"
      >
        <a
          target="_blank"
          class="black-white"
          href="https://t.me/+7xw3IXanLytlZDlk"
          >https://t.me/+7xw3IXanLytlZDlk</a
        >
      </p>
      <p v-if="showStrategies" class="body-1 q-mt-lg">
        As a reminder, we do not track accounts in any way. Please create
        yourself a new telegram account if you want to be anonymous.
      </p>
      <p v-if="showStrategies" class="body-1 q-mt-lg">
        It is recommended to use telegram desktop app to make it easy to copy
        paste things.
      </p>
    </div>
  </q-page>
</template>
<script>
import { ref, onMounted, computed, watch } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { decryptAES, encryptAES, sha256 } from "../utils/encryption";

export default {
  name: "Strategies",
  setup() {
    const plan = ref("BASIC");
    const showStrategies = ref(false);

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
      try {
        const storedplan = LocalStorage.getItem("plan");
        if (storedplan === null || storedplan === "") {
          plan = "BASIC";
          LocalStorage.set("plan", encryptAES("BASIC"));
        } else {
          plan.value = decryptAES(storedplan);
        }
      } catch (err) {
        console.log(err);
        // this.$q.notify({ message: "failed to load settings", color: "red" });
      }

      if (String(plan.value) === "BASIC") {
        showStrategies.value = false;
      } else {
        showStrategies.value = true;
      }
    });

    // Return refs and methods to be used in the template
    return {
      plan,
      showStrategies,
      incrementCounter,
      decrementCounter,
      doubledCounter,
      watchedValue,
    };
  },
};
</script>
<style scoped></style>
