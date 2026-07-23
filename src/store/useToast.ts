import { create } from "zustand";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: number;
  message: string;
  tone: "default" | "error";
  action?: ToastAction;
}

interface ToastStore {
  toasts: Toast[];
  push: (message: string, opts?: { tone?: "default" | "error"; action?: ToastAction; duration?: number }) => void;
  dismiss: (id: number) => void;
}

let seq = 0;

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, opts = {}) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone: opts.tone ?? "default", action: opts.action }] }));
    const duration = opts.duration ?? (opts.action ? 5000 : 2600);
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/// Fire a toast from anywhere (event handlers, non-component code).
export const toast = (message: string, opts?: Parameters<ToastStore["push"]>[1]) =>
  useToast.getState().push(message, opts);
