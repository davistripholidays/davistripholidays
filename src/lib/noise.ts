/**
 * Deterministic value noise + fractal Brownian motion (fBm).
 *
 * Zero dependencies, seeded and stable across renders — used to generate
 * the low-poly Himalayan terrain in the 3D hero scene.
 *
 * Kept in src/lib so a future design direction can reuse the same terrain
 * generator with different heightmaps/palettes without touching components.
 */

/** Integer lattice hash → pseudo-random [0, 1). Stable for the same inputs. */
function hash2(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smoothstep-style easing for bilinear interpolation. */
function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** 2D value noise in [0, 1). */
export function valueNoise2D(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);

  const u = smooth(xf);
  const v = smooth(yf);

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/**
 * Fractal Brownian motion — layered value noise in roughly [0, 1).
 * @param octaves number of noise layers (4 gives natural mountain detail)
 */
export function fbm(x: number, y: number, octaves = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * valueNoise2D(x * frequency, y * frequency);
    frequency *= 2.03; // irrational-ish step avoids visible lattice alignment
    amplitude *= 0.5;
  }
  return value;
}
