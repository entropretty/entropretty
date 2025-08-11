import { describe, it, expect } from "vitest"
import {
  bytesToNibbles,
  bytesToQuarterBytes,
  bytesToBits,
  bit,
  bits,
  numeric,
  randomGenerator,
  sfc32,
  map,
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

  describe("bytesToQuarterBytes", () => {
    it("should convert bytes to quarter-bytes correctly", () => {
      // Test with 0xFF (11111111 in binary)
      const input = [0xff]
      const result = bytesToQuarterBytes(input)
      expect(result).toEqual([3, 3, 3, 3]) // Each 2-bit pair is 11 = 3
    })

    it("should handle different bit patterns", () => {
      // Test with 0xE4 (11100100 in binary)
      // 11 = 3, 10 = 2, 01 = 1, 00 = 0
      const input = [0xe4]
      const result = bytesToQuarterBytes(input)
      expect(result).toEqual([3, 2, 1, 0])
    })

    it("should handle multiple bytes", () => {
      // Test with 0x0F, 0xF0
      // 0x0F = 00001111 -> 00, 00, 11, 11 = 0, 0, 3, 3
      // 0xF0 = 11110000 -> 11, 11, 00, 00 = 3, 3, 0, 0
      const input = [0x0f, 0xf0]
      const result = bytesToQuarterBytes(input)
      expect(result).toEqual([0, 0, 3, 3, 3, 3, 0, 0])
    })

    it("should handle zero byte", () => {
      const input = [0x00]
      const result = bytesToQuarterBytes(input)
      expect(result).toEqual([0, 0, 0, 0])
    })

    it("should handle alternating bit pattern", () => {
      // Test with 0xAA (10101010 in binary)
      // 10 = 2, 10 = 2, 10 = 2, 10 = 2
      const input = [0xaa]
      const result = bytesToQuarterBytes(input)
      expect(result).toEqual([2, 2, 2, 2])
    })

    it("should return correct array length", () => {
      const input = [0x12, 0x34, 0x56]
      const result = bytesToQuarterBytes(input)
      expect(result.length).toBe(12) // 3 bytes * 4 quarter-bytes per byte
    })

    it("should handle all possible quarter-byte values", () => {
      // Test with 0x1B (00011011 in binary)
      // 00 = 0, 01 = 1, 10 = 2, 11 = 3
      const input = [0x1b]
      const result = bytesToQuarterBytes(input)
      expect(result).toEqual([0, 1, 2, 3])
    })
  })

  describe("bytesToBits", () => {
    it("should convert bytes to bits correctly", () => {
      // Test with 0xFF (11111111 in binary)
      const input = [0xff]
      const result = bytesToBits(input)
      expect(result).toEqual([1, 1, 1, 1, 1, 1, 1, 1])
    })

    it("should handle zero byte", () => {
      // Test with 0x00 (00000000 in binary)
      const input = [0x00]
      const result = bytesToBits(input)
      expect(result).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
    })

    it("should handle alternating bit pattern", () => {
      // Test with 0xAA (10101010 in binary)
      const input = [0xaa]
      const result = bytesToBits(input)
      expect(result).toEqual([1, 0, 1, 0, 1, 0, 1, 0])
    })

    it("should handle reverse alternating bit pattern", () => {
      // Test with 0x55 (01010101 in binary)
      const input = [0x55]
      const result = bytesToBits(input)
      expect(result).toEqual([0, 1, 0, 1, 0, 1, 0, 1])
    })

    it("should handle multiple bytes", () => {
      // Test with 0x0F, 0xF0
      // 0x0F = 00001111 -> [0, 0, 0, 0, 1, 1, 1, 1]
      // 0xF0 = 11110000 -> [1, 1, 1, 1, 0, 0, 0, 0]
      const input = [0x0f, 0xf0]
      const result = bytesToBits(input)
      expect(result).toEqual([0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0])
    })

    it("should handle specific bit patterns", () => {
      // Test with 0x81 (10000001 in binary)
      const input = [0x81]
      const result = bytesToBits(input)
      expect(result).toEqual([1, 0, 0, 0, 0, 0, 0, 1])
    })

    it("should return correct array length", () => {
      const input = [0x12, 0x34, 0x56]
      const result = bytesToBits(input)
      expect(result.length).toBe(24) // 3 bytes * 8 bits per byte
    })

    it("should handle all bits in sequence", () => {
      // Test with 0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01
      // These represent individual bit positions: 10000000, 01000000, etc.
      const input = [0x80, 0x40, 0x20, 0x10]
      const result = bytesToBits(input)
      expect(result).toEqual([
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0, // 0x80
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0, // 0x40
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0, // 0x20
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0, // 0x10
      ])
    })

    it("should handle complex bit pattern", () => {
      // Test with 0xC3 (11000011 in binary)
      const input = [0xc3]
      const result = bytesToBits(input)
      expect(result).toEqual([1, 1, 0, 0, 0, 0, 1, 1])
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

  describe("map", () => {
    it("should map value from one range to another (basic case)", () => {
      // Example from p5.js docs: map(2, 0, 10, 0, 100) should return 20
      expect(map(2, 0, 10, 0, 100)).toBe(20)
    })

    it("should handle mapping with positive values", () => {
      expect(map(5, 0, 10, 0, 100)).toBe(50)
      expect(map(7.5, 0, 10, 0, 100)).toBe(75)
      expect(map(0, 0, 10, 0, 100)).toBe(0)
      expect(map(10, 0, 10, 0, 100)).toBe(100)
    })

    it("should handle mapping with negative values", () => {
      expect(map(-5, -10, 0, 0, 100)).toBe(50)
      expect(map(-2, -10, 10, -50, 50)).toBe(-10) // -2 maps to -10 in the output range
      expect(map(0, -10, 10, -100, 100)).toBe(0)
    })

    it("should handle reverse mapping (larger to smaller range)", () => {
      expect(map(2, 0, 10, 100, 0)).toBe(80)
      expect(map(5, 0, 10, 100, 0)).toBe(50)
    })

    it("should handle values outside input range without bounds", () => {
      // map(11, 0, 10, 0, 100, false) should return 110 (outside target range)
      expect(map(11, 0, 10, 0, 100, false)).toBeCloseTo(110)
      expect(map(-1, 0, 10, 0, 100, false)).toBeCloseTo(-10)
    })

    it("should constrain values by default (withinBounds defaults to true)", () => {
      // map(11, 0, 10, 0, 100) should return 100 (constrained by default)
      expect(map(11, 0, 10, 0, 100)).toBe(100)
      expect(map(-1, 0, 10, 0, 100)).toBe(0)
      expect(map(15, 0, 10, 0, 100)).toBe(100)
    })

    it("should constrain values when withinBounds is explicitly true", () => {
      // map(11, 0, 10, 0, 100, true) should return 100 (constrained)
      expect(map(11, 0, 10, 0, 100, true)).toBe(100)
      expect(map(-1, 0, 10, 0, 100, true)).toBe(0)
      expect(map(15, 0, 10, 0, 100, true)).toBe(100)
    })

    it("should handle reverse output range with bounds", () => {
      // When output range is reversed (100 to 0), bounds should still work
      expect(map(11, 0, 10, 100, 0, true)).toBe(0)
      expect(map(-1, 0, 10, 100, 0, true)).toBe(100)
    })

    it("should handle floating point precision", () => {
      expect(map(0.5, 0, 1, 0, 10)).toBeCloseTo(5)
      expect(map(0.25, 0, 1, 0, 100)).toBeCloseTo(25)
    })

    it("should handle edge cases with same input and output ranges", () => {
      expect(map(5, 0, 10, 0, 10)).toBe(5)
      expect(map(7, 0, 10, 0, 10)).toBe(7)
    })

    it("should handle different range orientations", () => {
      // Input range: 0 to 10, Output range: 50 to 25 (decreasing)
      expect(map(0, 0, 10, 50, 25)).toBe(50)
      expect(map(10, 0, 10, 50, 25)).toBe(25)
      expect(map(5, 0, 10, 50, 25)).toBe(37.5)
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
