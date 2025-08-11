import type { FamilyKind, Seed } from "./types"

export const rng = sfc32(1, 2, 3, 4)

export function getSeed(kind: FamilyKind): Seed {
  return {
    Procedural: getRandomBytes(4, rng),
    ProceduralPersonal: Uint8Array.from([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      ...getRandomBytes(1, rng),
    ]),
    ProceduralAccount: getRandomBytes(32, rng),
  }[kind]
}

export function uint8ArrayToBinaryString(arr: Uint8Array): string {
  let binaryString = ""
  for (let i = 0; i < arr.length; i++) {
    binaryString += arr[i].toString(2).padStart(8, "0")
    if (i < arr.length - 1) {
      binaryString += " "
    }
  }
  return binaryString
}

export function seedToKey(seed: Seed): string {
  return Array.from(seed).join(",")
}

/**
 * Generates a family of seeds for a given kind and size,
 * all seeds are closely related by a few bit mutations
 * Does not contain duplicate seeds.
 *
 * @param kind - The kind of seed to generate
 * @param size - The size of the seed family to generate
 * @returns An array of seeds, does not contain duplicates
 */
export function getSeedFamily(kind: FamilyKind, size: number = 16): Seed[] {
  const seed = getSeed(kind)
  return deriveSeedFamily(seed, { size, maxBits: 3, minBits: 1 })
}

export function mutateSeed(
  seed: Seed,
  options: {
    minBits: number
    maxBits: number
  } = {
    minBits: 1,
    maxBits: 3,
  },
): Seed {
  if (options.minBits > options.maxBits) {
    throw new Error("minBits must be less than maxBits")
  }
  if (options.minBits < 1) {
    throw new Error("minBits must be greater than 0")
  }
  if (options.maxBits < 1) {
    throw new Error("maxBits must be greater than 0")
  }

  const mutatedSeed = Array.from(seed)
  const isProceduralPersonal = seed.length === 8

  if (isProceduralPersonal) {
    const noOfBytes = 4
    const lastBytes = mutatedSeed.slice(-noOfBytes)
    mutateBits(
      Math.max(Math.floor(Math.random() * options.maxBits), options.minBits),
    )(lastBytes)
    mutatedSeed.splice(-noOfBytes, noOfBytes, ...lastBytes)
  } else {
    mutateBits(Math.floor(Math.random() * 3) + 1)(mutatedSeed)
  }

  return mutatedSeed
}

export function deriveSeedFamily(
  seed: Seed,
  options: {
    size: number
    minBits: number
    maxBits: number
  },
): Seed[] {
  const seedFamilyMap = new Map<string, Seed>()
  seedFamilyMap.set(seedToKey(seed), Array.from(seed))

  while (seedFamilyMap.size < options.size) {
    const mutatedSeed = mutateSeed(seed)
    const key = seedToKey(mutatedSeed)
    if (!seedFamilyMap.has(key)) {
      seedFamilyMap.set(key, mutatedSeed)
    }
  }

  return [...seedFamilyMap.values()]
}

function getRandomBytes(bytes: number, rng: () => number): Seed {
  const result = new Uint8Array(bytes)
  for (let i = 0; i < bytes; i++) {
    result[i] = Math.floor(rng() * 255)
  }
  return result
}

function sfc32(a: number, b: number, c: number, d: number): () => number {
  return function () {
    a |= 0
    b |= 0
    c |= 0
    d |= 0
    const t = (((a + b) | 0) + d) | 0
    d = (d + 1) | 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) | 0
    c = (c << 21) | (c >>> 11)
    c = (c + t) | 0
    return (t >>> 0) / 4294967296
  }
}

export function mutateBits(count: number) {
  return (seed: number[]) => {
    for (let b = 0; b < count; ++b) {
      const bit = 2 ** Math.floor(Math.random() * 8)
      const item = Math.floor(Math.random() * 4)
      seed[item] ^= bit
    }
  }
}

export function incrementSeed(seed: Seed): Seed {
  // Create a copy of the seed to avoid modifying the original
  const newSeed = Array.from(seed)

  // Start from least significant bit (right-most)
  for (let byteIndex = newSeed.length - 1; byteIndex >= 0; byteIndex--) {
    // If current byte is less than 255, we can increment it
    if (newSeed[byteIndex] < 255) {
      newSeed[byteIndex]++
      return newSeed
    }
    // If we reach here, we need to carry over to next byte
    newSeed[byteIndex] = 0
  }

  // If we reach here, we've overflowed (all bytes were 255)
  // Return the wrapped around value (all zeros)
  return newSeed
}
