import { describe, it, expect } from "vitest"
import {
  bytesToNibbles,
  bit,
  bits,
  numeric,
  randomGenerator,
  sfc32,
} from "./functions"
import { COLORS } from "./colors"

describe("prelude functions", () => {
  describe("bytesToNibbles", () => {
    it("should convert bytes to nibbles correctly", () => {
      const input = [0xab, 0xcd]
      const result = bytesToNibbles(input)
      expect(result).toEqual([10, 11, 12, 13]) // A,B,C,D in decimal
    })
  })

  describe("bit", () => {
    it("should extract correct bit from byte", () => {
      const input = [0b10101010]
      expect(bit(input, 0)).toBe(0)
      expect(bit(input, 1)).toBe(1)
      expect(bit(input, 2)).toBe(0)
      expect(bit(input, 3)).toBe(1)
    })
  })

  describe("bits", () => {
    it("should extract range of bits correctly", () => {
      const input = [0xff, 0x00]
      expect(bits(input, 0, 8)).toBe(255)
      expect(bits(input, 8, 16)).toBe(0)
    })
  })

  describe("numeric", () => {
    it("should convert bytes to bigint", () => {
      const input = [0x01, 0x02]
      expect(numeric(input)).toBe(258n) // 0x0102 in decimal
    })

    it("should throw error for too long input", () => {
      const input = Array(65).fill(0) // 65 bytes is over the 64 byte limit
      expect(() => numeric(input)).toThrow()
    })
  })

  describe("randomGenerator", () => {
    it("should generate numbers between 0 and 1", () => {
      const seed = [1, 2, 3, 4]
      const rng = randomGenerator(seed)
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    })
  })

  describe("sfc32", () => {
    it("should generate numbers between 0 and 1", () => {
      const rng = sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, 0)
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    })
  })

  describe("COLORS", () => {
    it("should have correct color values", () => {
      expect(COLORS.black).toBe("#000000")
      expect(COLORS.white).toBe("#fff")
      expect(COLORS.light).toBe("#aaa")
      expect(COLORS.dark).toBe("#666")
    })
  })
})
