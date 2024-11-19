import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.public.apiBase || 'http://localhost:3000',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 요청 인터셉터
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 토큰이 있다면 헤더에 추가
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // 인증 에러 처리
        navigateTo('/auth/login')
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: axiosInstance
    }
  }
}) 