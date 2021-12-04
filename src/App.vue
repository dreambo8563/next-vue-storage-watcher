

<template>
  <div>
    {{ msg }}
    <div>ss: {{ ssmsg }}</div>
    info:{{ info }}
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useLSWatcher } from "./lib/main";
import { useSSWatcher } from "./lib/main";

export default defineComponent({
  name: "Home",
  setup() {

    const ls = useLSWatcher()
    const ss = useSSWatcher()
    ls.setItem("mm", "aa", 1000)
    ss.setItem("mm", "aa", 5000)
    let msg = ls.getItem("mm")
    let ssmsg = ss.getItem("mm")
    console.log('ssmsg :>> ', ssmsg);
    const info = ls.info("mm")


    setTimeout(() => {
      ls.setItem("mm", [1, 2, 3], 2000)
      ss.setItem("mm", [1, 2, 3], 8000)
      console.log('ssmsg :>> ', ssmsg.value);
    }, 5000);

    console.log('msg :>> ', msg);
    setTimeout(() => {
      ls.removeItem("mm")
      ss.removeItem("mm")
    }, 10000);

    return {
      info,
      msg,
      ssmsg
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
