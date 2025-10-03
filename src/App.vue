<script setup lang="ts">
  import {QuickQRCodeStyling} from "@/container/qrcode/qrcode.ts";
  import {DotOptions} from "@/container/qrcode/dot_options.ts";
  import {QuickQRCodeProperties} from "@/container/qrcode/qrcode_property.ts";
  import {BackgroundOptions} from "@/container/qrcode/background_options.ts";
  let styling = QuickQRCodeStyling.builder()
  .setValue(QuickQRCodeProperties.DOT_OPTIONS,DotOptions.builder().roundSize(false).build())
  .build();
  console.log(styling)

</script>

<template>
  <h1 class="btn btn-primary font-bold text-3xl">You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
