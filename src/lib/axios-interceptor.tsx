'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { axiosClient } from '../api'

export default function AxiosInterceptor() {
  const { data: session, status } = useSession()

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config) => {
        if (status === 'authenticated' && session?.accessToken) {
          config.headers['Authorization'] = `Bearer ${session.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle authorization error (e.g., redirect to login)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor)
      axiosClient.interceptors.response.eject(responseInterceptor)
    }
  }, [session, status])

  return null
}
