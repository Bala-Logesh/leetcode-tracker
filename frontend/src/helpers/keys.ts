import type { InjectionKey, Ref } from 'vue'
import type { ITag } from '../types/tags'

export const TagKey = Symbol() as InjectionKey<Ref<ITag[]>>
