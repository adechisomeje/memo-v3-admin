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
  },
  
  commissions: {
    all: ['commissions', 'all'] as const,
    byCategory: (category: string) => ['commissions', 'category', category] as const,
  },
  
  deletionRequests: {
    all: ['deletionRequests', 'all'] as const,
    detail: (vendorId: string) => ['deletionRequests', 'detail', vendorId] as const,
  },
  
  allProducts: ['allProducts'] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,
} as const;