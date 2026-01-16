import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import React from "react"

const byteSchema = z.object({
  decimal: z.string(),
  hex: z.string(),
})

type ByteFormData = z.infer<typeof byteSchema>

interface ByteManipulatorProps {
  value?: number[]
  placeholder?: number[]
  onChange?: (bytes: number[]) => void
  className?: string
}

export function ByteManipulator({
  value,
  placeholder = [0, 0, 0, 0],
  onChange,
  className,
}: ByteManipulatorProps) {
  const [bytes, setBytes] = useState(value || placeholder)

  useEffect(() => {
    if (value) {
      setBytes(value)
    }
  }, [value])

  const updateByte = (index: number, newValue: number) => {
    const newBytes = [...bytes]
    newBytes[index] = Math.min(255, Math.max(0, newValue))
    setBytes(newBytes)
    onChange?.(newBytes)
  }

  const toggleBit = (byteIndex: number, bitIndex: number) => {
    const byte = bytes[byteIndex]
    const mask = 1 << (7 - bitIndex)
    const newByte = byte ^ mask
    updateByte(byteIndex, newByte)
  }

  const getBit = (byte: number, index: number): number => {
    return (byte >> (7 - index)) & 1
  }

  return (
    <div className={cn("inline-flex flex-col", className)}>
      {bytes.map((byte, byteIndex) => (
        <ByteRow
          key={byteIndex}
          index={byteIndex}
          value={byte}
          onChange={(newValue) => updateByte(byteIndex, newValue)}
          onToggleBit={(bitIndex) => toggleBit(byteIndex, bitIndex)}
          getBit={(bitIndex) => getBit(byte, bitIndex)}
        />
      ))}
    </div>
  )
}

interface ByteRowProps {
  index: number
  value: number
  onChange: (value: number) => void
  onToggleBit: (bitIndex: number) => void
  getBit: (index: number) => number
}

function ByteRow({
  index,
  value,
  onChange,
  onToggleBit,
  getBit,
}: ByteRowProps) {
  const form = useForm<ByteFormData>({
    resolver: zodResolver(byteSchema),
    defaultValues: {
      decimal: value.toString(),
      hex: value.toString(16).padStart(2, "0"),
    },
  })

  // Update form values whenever the value prop changes
  React.useEffect(() => {
    form.setValue("decimal", value.toString())
    form.setValue("hex", value.toString(16).padStart(2, "0").toLowerCase())
  }, [value, form])

  const hasError = Object.keys(form.formState.errors).length > 0

  return (
    <div
      className={cn(
        "flex items-center space-x-2 border transition-colors",
        hasError ? "border-destructive" : "border-transparent",
      )}
    >
      <span className="font-mono text-xs">{index}:</span>

      <div className="flex -space-x-[1px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              onToggleBit(i)
            }}
            className={cn(
              "hover:bg-border/25 aspect-square h-9 border transition-colors",
              getBit(i) === 1 ? "bg-border" : "bg-transparent",
            )}
            aria-label={`Toggle bit ${i}`}
          >
            <span className="text-sm">{getBit(i)}</span>
          </button>
        ))}
      </div>

      <Form {...form}>
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="hex"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    className="w-12 font-mono uppercase [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="HEX"
                    maxLength={2}
                    value={field.value}
                    onChange={(e) => {
                      let hex = e.target.value.toLowerCase()
                      // Allow only valid hex characters
                      hex = hex.replace(/[^0-9a-f]/g, "")

                      // Always update the form value first
                      field.onChange(hex)

                      // If empty, treat as 0
                      if (hex === "") {
                        onChange(0)
                        return
                      }

                      // For single character input, don't pad with 0
                      // This allows typing sequential characters
                      const parsed = parseInt(hex, 16)
                      if (!isNaN(parsed)) {
                        const newValue = Math.min(255, Math.max(0, parsed))
                        onChange(newValue)
                      }
                    }}
                    onBlur={(e) => {
                      const currentValue = e.target.value.toLowerCase()
                      // On blur, if empty, set to "00"
                      if (!currentValue) {
                        field.onChange("00")
                      } else {
                        // Ensure two digits on blur, but preserve user input
                        field.onChange(currentValue.padStart(2, "0"))
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="decimal"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="DEC"
                    type="number"
                    value={field.value}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      field.onChange(inputValue)

                      // If empty, treat as 0
                      if (inputValue === "") {
                        onChange(0)
                        return
                      }

                      const parsed = parseInt(inputValue)
                      if (!isNaN(parsed)) {
                        const newValue = Math.min(255, Math.max(0, parsed))
                        onChange(newValue)
                      }
                    }}
                    onBlur={(e) => {
                      // On blur, if empty, set to "0"
                      if (!e.target.value) {
                        field.onChange("0")
                      } else {
                        // Ensure valid number on blur
                        field.onChange(value.toString())
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  )
}
