<script setup lang="ts">
import {QuickQRCodeProperties, QuickQRCodeStyling} from "@/container/qrcode/qrcode.ts";
  import {DotOptions, QROptions} from "@/container/qrcode/options.ts";
import QRCodeMetaBuilder from "@/QRCodeMetaBuilder.vue";
import QuickQRFooter from "@/QuickQRFooter.vue";
  let styling = QuickQRCodeStyling.builder()
  .setValue(QuickQRCodeProperties.DOT_OPTIONS,DotOptions.builder().roundSize(false).build())
  .setValue(QuickQRCodeProperties.QR_OPTIONS,QROptions.builder().build())
  .setValue(QuickQRCodeProperties.WIDTH,300)
  .setValue(QuickQRCodeProperties.IMAGE,"https://bus.com")
  .build();
  console.log(styling)

</script>

<template>
  <QRCodeMetaBuilder></QRCodeMetaBuilder>
  <h1 class="btn btn-primary font-bold text-3xl">You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <QuickQRFooter></QuickQRFooter>
</template>

<style scoped></style>
