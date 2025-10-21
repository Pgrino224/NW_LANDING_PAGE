// Themis API - currently using mock implementation
// Switch to real API by importing from real implementation instead of mock

import { mockThemisApi } from '../mock/mockThemisApi'

export * from '../mock/mockThemisApi'

// Export mock API as default API for now
export const themisApi = mockThemisApi

// When ready for real API, replace with:
// import { realThemisApi } from './realThemisApi'
// export const themisApi = realThemisApi
