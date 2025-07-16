import React, { createContext, useContext, useMemo, useRef } from "react"
import { AlgorithmService } from "@/services/algorithm-service"

interface ServiceContextType {
  algorithmService: AlgorithmService
}

const Context = createContext<ServiceContextType | null>(null)

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const serviceRef = useRef<AlgorithmService | null>(null)

  if (!serviceRef.current) {
    serviceRef.current = new AlgorithmService()
  }

  const value = useMemo(() => {
    return { algorithmService: serviceRef.current! }
  }, [serviceRef])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useAlgorithmService = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error("useAlgorithmService must be used within a ServiceProvider")
  return context.algorithmService
}
