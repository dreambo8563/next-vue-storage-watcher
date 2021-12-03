

<template>
  <div>
    {{msg}}
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useLSWatcher } from "./lib/local";
export default defineComponent({
  name: "Home",
 
  setup() {
 

  const ls = useLSWatcher()
    ls.setItem("pp","sdljfsldjf",100)
let msg = ls.getItem("pp")


console.log('msg :>> ', msg);
setTimeout(() => {
    // ls.removeItem("88")
}, 1000);

    return {
    msg
    };
  },
});


</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
