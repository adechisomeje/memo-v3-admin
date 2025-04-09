export const queryKeys = {
  allCustomers: ['allCustomers'] as const,
  allVendors: ['allVendors'] as const,
  allOrders: ['allOrders'] as const,
  allTransactions: ['allTransactions'] as const,
  allMetrics: ['allMetrics'] as const,
   locations: {
    countries: ['locations', 'countries'] as const,
    states: ['locations', 'states'] as const,
    cities: ['locations', 'cities'] as const,
  }
} as const
