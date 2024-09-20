<script setup>
import { mdiGithub } from '@mdi/js'
import BaseButton from '@/components/BaseButton.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import { gradientBgPinkRed } from '@/colors'
</script>

<template>
  <SectionBanner :class="gradientBgPinkRed">
    <h1 class="text-3xl text-white mb-6">Like the project? Please star on <b>GitHub</b> ;-)</h1>
    <div>
      <BaseButton
        href="https://github.com/justboil/admin-one-vue-tailwind"
        :icon="mdiGithub"
        label="GitHub"
        target="_blank"
        rounded-full
<<<<<<< HEAD
        small
=======
>>>>>>> b9347c5c7043f1a42f8f59e66bb8b7bb60837e7f
      />
    </div>
  </SectionBanner>
</template>
