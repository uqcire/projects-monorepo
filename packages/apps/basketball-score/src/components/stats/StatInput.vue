<script setup>
defineProps({
  label: String,
  modelValue: Number
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input type="number" :value="modelValue" @input="$emit('update:modelValue', $event.target.valueAsNumber)"
      class="input input-bordered">
  </div>
</template>
