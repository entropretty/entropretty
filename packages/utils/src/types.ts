export type Seed = number[] | Uint8Array
/**
 * Random entropy of 32 bits represented in bytes.
 *
 * 32 Bit / 4 bytes / 4 elements between 0 and 255
 */

export type ProceduralSeed = Seed

/**
 * PersonalId of the user. A u64 number represented in bytes.
 *
 * 64 Bit / 8 bytes / 8 elements between 0 and 255
 */
export type ProceduralPersonalSeed = Seed

/**
 * AccountId of the user represented as 32 bytes
 *
 * 256 Bit / 32 bytes / 32 elements between 0 and 255
 */
export type ProceduralAccountSeed = Seed

export type FamilyKind =
  | "Procedural"
  | "ProceduralPersonal"
  | "ProceduralAccount"

export type DrawFn = (
  context: CanvasRenderingContext2D, // | OffscreenCanvasRenderingContext2D,
  seed: ProceduralSeed,
) => void

export interface SchemaMetadata {
  artist: string
  kind: FamilyKind
  name: string
}

export interface Schema extends SchemaMetadata {
  draw: DrawFn
}
