// In your route.ts file

import { handlers } from '@/auth'

console.log('Handlers:', handlers)
export const { GET, POST } = handlers || {}
