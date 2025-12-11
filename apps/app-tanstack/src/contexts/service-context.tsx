import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AlgorithmService } from '@/services/algorithm-service'

interface ServiceContextType {
  algorithmService: AlgorithmService | null
}

const Context = createContext<ServiceContextType>({ algorithmService: null })

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const serviceRef = useRef<AlgorithmService | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only create the AlgorithmService on the client side
    // Workers are not available during SSR
    if (typeof window !== 'undefined' && !serviceRef.current) {
      serviceRef.current = new AlgorithmService()
      setMounted(true)
    }
  }, [])

  const value = useMemo(() => {
    return { algorithmService: serviceRef.current }
  }, [mounted])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useAlgorithmService = () => {
  const context = useContext(Context)
  if (!context.algorithmService) {
    throw new Error(
      'useAlgorithmService must be used within a ServiceProvider and on the client side',
    )
  }
  return context.algorithmService
}

// Safe version that doesn't throw during SSR
export const useAlgorithmServiceSafe = () => {
  const context = useContext(Context)
  return context.algorithmService
}
