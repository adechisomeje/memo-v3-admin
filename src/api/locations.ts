// api/locations.ts
import { axiosClient } from '.'

// Types
export type Country = {
  _id: string
  name: string
  code: string
  active: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type State = {
  _id: string
  name: string
  country: string | Country
  active: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type City = {
  _id: string
  name: string
  state: string | State
  country: string | Country
  active: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type LocationResponse<T> = {
  statusCode: number
  data: T
  message: string
}

export type LocationsListResponse<T> = {
  statusCode: number
  data: T[]
  total: number
  page: number
  limit: number
  message: string
}

// Country API functions
export const getAllCountries = async () => {
  const response = await axiosClient.get<LocationsListResponse<Country>>(
    'locations/countries'
  )
  return response.data
}

export const addCountry = async (data: { name: string; code: string; active: boolean }) => {
  const response = await axiosClient.post<LocationResponse<Country>>(
    '/admin/locations/countries',
    data
  )
  return response.data
}

export const updateCountry = async (id: string, data: { name?: string; code?: string; active?: boolean }) => {
  const response = await axiosClient.patch<LocationResponse<Country>>(
    `/admin/locations/countries/${id}`,
    data
  )
  return response.data
}

export const deleteCountry = async (id: string) => {
  const response = await axiosClient.delete<LocationResponse<Country>>(
    `/admin/locations/countries/${id}`
  )
  return response.data
}

// State API functions
export const getAllStates = async () => {
  const response = await axiosClient.get<LocationsListResponse<State>>(
    'locations/states'
  )
  return response.data
}

export const addState = async (data: { name: string; country: string; active: boolean }) => {
  const response = await axiosClient.post<LocationResponse<State>>(
    '/admin/locations/states',
    data
  )
  return response.data
}

export const updateState = async (id: string, data: { name?: string; country?: string; active?: boolean }) => {
  const response = await axiosClient.patch<LocationResponse<State>>(
    `/admin/locations/states/${id}`,
    data
  )
  return response.data
}

export const deleteState = async (id: string) => {
  const response = await axiosClient.delete<LocationResponse<State>>(
    `/admin/locations/states/${id}`
  )
  return response.data
}

// City API functions
export const getAllCities = async () => {
  const response = await axiosClient.get<LocationsListResponse<City>>(
    'locations/cities'
  )
  return response.data
}

export const addCity = async (data: { name: string; state: string; country: string; active: boolean }) => {
  const response = await axiosClient.post<LocationResponse<City>>(
    '/admin/locations/cities',
    data
  )
  return response.data
}

export const updateCity = async (id: string, data: { name?: string; state?: string; country?: string; active?: boolean }) => {
  const response = await axiosClient.patch<LocationResponse<City>>(
    `/admin/locations/cities/${id}`,
    data
  )
  return response.data
}

export const deleteCity = async (id: string) => {
  const response = await axiosClient.delete<LocationResponse<City>>(
    `/admin/locations/cities/${id}`
  )
  return response.data
}

// In your api/locations.ts file, add these functions:
export const getCitiesByState = async (stateId: string) => {
  const response = await axiosClient.get<LocationsListResponse<City>>(
    `/admin/locations/cities?state=${stateId}`
  );
  return response.data;
};

export const getCitiesByCountry = async (countryId: string) => {
  const response = await axiosClient.get<LocationsListResponse<City>>(
    `/admin/locations/cities?country=${countryId}`
  );
  return response.data;
};

export const getCitiesByCountryAndState = async (countryId: string, stateId: string) => {
  const response = await axiosClient.get<LocationsListResponse<City>>(
    `/locations/cities?stateId=${stateId}&countryId=${countryId}`
  );
  return response.data;
};