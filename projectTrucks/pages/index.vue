<script setup lang="ts">
import * as Enums from '@/Enums'
</script>

<template>
    <filterComponent></filterComponent>
    <ProductViewer :viewer-type="Enums.typeOfProduct.global"></ProductViewer>
</template>
