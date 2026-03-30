import { ref } from "vue";

export type ToastVariant = "success" | "error";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "center";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
};

const toasts = ref<Toast[]>([]);
let id = 0;

export function useToast() {
  const addToast = (toast: Omit<Toast, "id">) => {
    const newToast: Toast = {
      id: id++,
      variant: "success",
      duration: 3000,
      position: "bottom-right",
      ...toast,
    };

    toasts.value.push(newToast);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
}