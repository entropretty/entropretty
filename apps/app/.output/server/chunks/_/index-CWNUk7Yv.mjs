var rng = sfc32(1, 2, 3, 4);
function getSeed(kind) {
  return {
    Procedural: getRandomBytes(4, rng),
    ProceduralPersonal: [0, 0, 0, 0, 0, 0, 0, ...getRandomBytes(1, rng)],
    ProceduralAccount: getRandomBytes(32, rng)
  }[kind];
}
function seedToKey(seed) {
  return Array.from(seed).join(",");
}
function getSeedFamily(kind, size = 16) {
  const seed = getSeed(kind);
  return deriveSeedFamily(seed, { size });
}
function mutateSeed(seed, options = {
  minBits: 1,
  maxBits: 3
}) {
  if (options.minBits > options.maxBits) {
    throw new Error("minBits must be less than maxBits");
  }
  if (options.minBits < 1) {
    throw new Error("minBits must be greater than 0");
  }
  if (options.maxBits < 1) {
    throw new Error("maxBits must be greater than 0");
  }
  const mutatedSeed = Array.from(seed);
  const isProceduralPersonal = seed.length === 8;
  if (isProceduralPersonal) {
    const noOfBytes = 4;
    const lastBytes = mutatedSeed.slice(-noOfBytes);
    mutateBits(
      Math.max(Math.floor(Math.random() * options.maxBits), options.minBits)
    )(lastBytes);
    mutatedSeed.splice(-noOfBytes, noOfBytes, ...lastBytes);
  } else {
    mutateBits(Math.floor(Math.random() * 3) + 1)(mutatedSeed);
  }
  return mutatedSeed;
}
function deriveSeedFamily(seed, options) {
  const seedFamilyMap = /* @__PURE__ */ new Map();
  seedFamilyMap.set(seedToKey(seed), Array.from(seed));
  while (seedFamilyMap.size < options.size) {
    const mutatedSeed = mutateSeed(seed);
    const key = seedToKey(mutatedSeed);
    if (!seedFamilyMap.has(key)) {
      seedFamilyMap.set(key, mutatedSeed);
    }
  }
  return [...seedFamilyMap.values()];
}
function getRandomBytes(bytes, rng2) {
  const result = Array(bytes).fill(0);
  for (let i = 0; i < bytes; i++) {
    result[i] = Math.floor(rng2() * 255);
  }
  return result;
}
function sfc32(a, b, c, d) {
  return function() {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = c << 21 | c >>> 11;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
}
function mutateBits(count) {
  return (seed) => {
    for (let b = 0; b < count; ++b) {
      const bit3 = 2 ** Math.floor(Math.random() * 8);
      const item = Math.floor(Math.random() * 4);
      seed[item] ^= bit3;
    }
  };
}
function getByte(seed, index) {
  return seed[index % seed.length];
}
function numeric(seed) {
  const MAX_BYTES = 64;
  if (seed.length > MAX_BYTES) {
    throw "Seed too long to safely convert to a bigint";
  }
  let result = 0n;
  for (let i = 0; i < seed.length; i++) {
    result = result << 8n | BigInt(getByte(seed, i));
  }
  return result;
}

export { getSeedFamily as a, deriveSeedFamily as d, getSeed as g, numeric as n, seedToKey as s };
//# sourceMappingURL=index-CWNUk7Yv.mjs.map
