export const preludeScriptString = `
  const black = "#000000"
  const white = "#fff"
  const light = "#aaa"
  const dark = "#666"

  function getByte(seed, index) {
  return seed[index % seed.length];
}
  function split(seed, parts) {
  const r = [];
  let last = 0;
  for (let i = 0;i < parts; ++i) {
    const next = Math.round((i + 1) * 32 / parts);
    r.push(bits(seed, last, next));
    last = next;
  }
  return r;
}
  function bytesToNibbles(bytes) {
  const nibbles = new Array(bytes.length * 2);
  for (let i = 0;i < bytes.length; i++) {
    const byte = getByte(bytes, i);
    nibbles[i * 2] = byte >> 4 & 15;
    nibbles[i * 2 + 1] = byte & 15;
  }
  return nibbles;
}
  function bit(seed, i) {
  return getByte(seed, Math.floor(i / 8)) >> i % 8 & 1;
}
  function bits(seed, from = 0, to = 32) {
  let r = 0;
  for (let i = from;i < to; ++i)
    r = (r << 1 | bit(seed, i)) >>> 0;
  return r;
}
  function symmetrical(factor, fn, ctx) {
  ctx.translate(50, 50);
  ctx.scale(50, 50);
  for (let i = 0;i < factor; ++i) {
    ctx.save();
    ctx.rotate(Math.PI * 2 * i / factor);
    fn(i);
    ctx.restore();
  }
}
  function strokeEach(array, fn, ctx) {
  array.forEach((element, index) => {
    ctx.beginPath();
    fn(element, index);
    ctx.stroke();
  });
}
  function fillEach(array, fn, ctx) {
  array.forEach((element, index) => {
    ctx.beginPath();
    fn(element, index);
    ctx.fill();
  });
}
  function numeric(seed) {
  if (seed.length > 64)
    throw "Seed too long to safely convert to a bigint";
  let result = 0n;
  for (let i = 0;i < seed.length; i++)
    result = result << 8n | BigInt(getByte(seed, i));
  return result;
}
  function randomGenerator(seed) {
  let a = bits(seed), b = bits(seed), c = bits(seed), d = bits(seed);
  return () => {
    const t = a + b | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = c << 21 | c >>> 11;
    d = d + 1 | 0;
    return ((t + d | 0) >>> 0) / 4294967296;
  };
}
  function sfc32(a, b, c, d) {
  return () => {
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
  function bytesToBits(bytes) {
  const bits = new Array(bytes.length * 8);
  for (let i = 0;i < bytes.length; i++) {
    const byte = getByte(bytes, i);
    bits[i * 8] = byte >> 7 & 1;
    bits[i * 8 + 1] = byte >> 6 & 1;
    bits[i * 8 + 2] = byte >> 5 & 1;
    bits[i * 8 + 3] = byte >> 4 & 1;
    bits[i * 8 + 4] = byte >> 3 & 1;
    bits[i * 8 + 5] = byte >> 2 & 1;
    bits[i * 8 + 6] = byte >> 1 & 1;
    bits[i * 8 + 7] = byte & 1;
  }
  return bits;
}
  function bytesToQuarterBytes(bytes) {
  const quarterBytes = new Array(bytes.length * 4);
  for (let i = 0;i < bytes.length; i++) {
    const byte = getByte(bytes, i);
    quarterBytes[i * 4] = byte >> 6 & 3;
    quarterBytes[i * 4 + 1] = byte >> 4 & 3;
    quarterBytes[i * 4 + 2] = byte >> 2 & 3;
    quarterBytes[i * 4 + 3] = byte & 3;
  }
  return quarterBytes;
}
  function map(value, inputStart, inputStop, outputStart, outputStop, withinBounds = !0) {
  const result = outputStart + (outputStop - outputStart) * ((value - inputStart) / (inputStop - inputStart));
  if (!withinBounds)
    return result;
  const minOutput = Math.min(outputStart, outputStop), maxOutput = Math.max(outputStart, outputStop);
  return Math.max(minOutput, Math.min(maxOutput, result));
}
`
