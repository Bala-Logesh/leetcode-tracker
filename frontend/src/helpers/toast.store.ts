import { ref, watch, reactive } from 'vue'

export const toastStore = reactive({
  isVisible: false,
  messages: [] as string[],
})

export const globalError = ref<string[] | null>(null)
export const hideAutomatically = ref<boolean>(false)

watch(globalError, (newVal) => {
  if (newVal) {
    toastStore.messages = newVal
    toastStore.isVisible = true

    if (hideAutomatically.value) {
      setTimeout(() => {
        toastStore.isVisible = false
        globalError.value = null
      }, 5000)
    }
  }
})
