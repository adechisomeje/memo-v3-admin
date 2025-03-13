import { axiosClient } from '.'

interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  adminRole: string
  profilePicture: string
}

interface LoginResponse {
  message: string
  data: {
    token: string
    admin: Admin
  }
}

export async function login(data: { email: string; password: string }) {
  const response = await axiosClient.post<LoginResponse>(
    '/auth/admin/signin',
    data
  )

  return response.data
}
