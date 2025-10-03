// Core types for the photo album system

export interface Photo {
  id: string | number
  name?: string
  url: string
  preview?: boolean
  title?: string
  description?: string
  originalName?: string
  size?: number
  uploadedAt?: string
}

export interface Album {
  id: number
  code: string
  title: string
  clientName: string
  clientEmail: string
  totalPhotos: number
  previewPhotos: number
  isPaid: boolean
  createdAt: string
  price: number
  photos: Photo[]
  password?: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  albums: Album[]
  createdAt: string
}

export interface Photographer {
  id: number
  name: string
  email: string
  phone?: string
  studio: string
  albums: Album[]
  totalRevenue: number
  createdAt: string
}

export interface LoginCredentials {
  email?: string
  password: string
  albumCode?: string
}

export interface AlbumStats {
  totalAlbums: number
  paidAlbums: number
  pendingAlbums: number
  totalRevenue: number
  totalPhotos: number
}

export interface PaymentInfo {
  albumId: number
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  paymentMethod: string
  transactionId?: string
  paidAt?: string
}

export interface NotificationToast {
  id?: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  action?: React.ReactElement
}

// Form types
export interface ClientLoginForm {
  albumCode: string
  password: string
}

export interface PhotographerLoginForm {
  email: string
  password: string
}

export interface CreateAlbumForm {
  code: string
  title: string
  clientName: string
  clientEmail: string
  previewPhotos: number
  price: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Settings and configuration
export interface AppSettings {
  allowRegistration: boolean
  maxPhotosPerAlbum: number
  maxPreviewPhotos: number
  defaultPrice: number
  currency: string
  paymentGateway: 'stripe' | 'paypal' | 'mercadopago'
}

export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  darkMode: boolean
}