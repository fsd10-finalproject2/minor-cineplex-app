<template>
    <div
      v-for="pos in positions"
      :key="pos"
      :class="['fixed z-200 flex flex-col gap-3', positionClass(pos)]"
    >
      <transition-group name="toast" tag="div" class="flex flex-col gap-3">
        <ToastItem
          v-for="toast in groupedToasts[pos]"
          :key="toast.id"
          :toast="toast"
          @close="removeToast(toast.id)"
        />
      </transition-group>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from "vue";
  import { useToast, type Toast } from "@/composables/useToast";
  import ToastItem from "./ToastItem.vue";
  
  const { toasts, removeToast } = useToast();
  
  const positions = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
    "center",
  ];
  
  const groupedToasts = computed(() => {
    const groups: Record<string, Toast[]> = {};
    positions.forEach((pos) => (groups[pos] = [] as Toast[]));
  
    toasts.value.forEach((toast) => {
      const pos = toast.position ?? "bottom-right";
      const list = groups[pos];
      if (list) {
        list.push(toast);
      }
    });
  
    return groups;
  });
  
  const positionClass = (pos: string) => {
    switch (pos) {
      case "top-left":
        return "top-5 left-5";
      case "top-center":
        return "top-5 left-1/2 -translate-x-1/2 items-center";
      case "top-right":
        return "top-5 right-5";
  
      case "bottom-left":
        return "bottom-5 left-5";
      case "bottom-center":
        return "bottom-5 left-1/2 -translate-x-1/2 items-center";
      case "bottom-right":
        return "bottom-5 right-5";
  
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center";
  
      default:
        return "bottom-5 right-5";
    }
  };
  </script>
  
  <style>
  .toast-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }
  .toast-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .toast-leave-from {
    opacity: 1;
  }
  .toast-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }
  </style>