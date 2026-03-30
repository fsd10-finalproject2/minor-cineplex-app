<script setup lang="ts">
import { computed } from "vue";
import XIcon from "@/assets/icons/XIcon.vue";

const props = defineProps<{
    toast: {
        id: number;
        title: string;
        description?: string;
        variant?: "success" | "error";
    };
}>();

defineEmits(["close"]);

const variantClass = computed(() => {
    const variantStatus = {
        success: "bg-green-50 opacity-90 text-white",
        error: "bg-red-50 opacity-90 text-white",
    } as const
    console.log(variantStatus[props.toast.variant ?? "success"]);
    console.log(props.toast.variant);
    return variantStatus[props.toast.variant ?? "success"]
});

</script>

<template>
    <div :class="[
        'p-4 px-5 rounded-sm shadow-lg text-white flex flex-col gap-1 w-[350px] sm:w-[480px] sm:h-[100px] shrink-0',
        variantClass
    ]">
        <div class="flex justify-between items-center">
            <h3 class="style-body-1-medium">{{ toast.title }}</h3>
            <button @click="$emit('close')">
                <XIcon />
            </button>
        </div>

        <p v-if="toast.description" class="style-body-2-regular opacity-90">
            {{ toast.description }}
        </p>
    </div>
</template>