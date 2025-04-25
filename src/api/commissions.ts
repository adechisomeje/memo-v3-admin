import { axiosClient } from '.'

export type CommissionSetting = {
  _id: string
  productCategory: string
  commissionPercentage: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type CommissionResponse<T> = {
  statusCode: number
  data: T
  message: string
}

export type CommissionsListResponse<T> = {
  statusCode: number
  data: T[]
  message: string
}

// Commission API functions
export const getAllCommissionSettings = async () => {
  const response = await axiosClient.get<CommissionsListResponse<CommissionSetting>>(
    '/admin/commission-settings'
  )
  return response.data
}

export const getCommissionSettingByCategory = async (category: string) => {
  const response = await axiosClient.get<CommissionResponse<CommissionSetting>>(
    `/admin/commission-settings/${category}`
  )
  return response.data
}

export const updateCommissionSetting = async (
  category: string, 
  data: { commissionPercentage?: number; isActive?: boolean }
) => {
  const response = await axiosClient.patch<CommissionResponse<CommissionSetting>>(
    `/admin/commission-settings/${category}`,
    data
  )
  return response.data
}

export const batchUpdateCommissionSettings = async (
  data: { commissionPercentage: number }
) => {
  const response = await axiosClient.patch<CommissionsListResponse<CommissionSetting>>(
    '/admin/commission-settings/batch-update',
    data
  )
  return response.data
}