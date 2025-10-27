import pc from "picocolors"

type ColorFunc = (str: string | number) => string

export type FamilyKind = {
  name: string
  display: string
  color: ColorFunc
}

export const familyKinds: readonly FamilyKind[] = [
  {
    name: "Procedural",
    display: "Procedural",
    color: pc.yellow,
  },
  {
    name: "ProceduralAccount",
    display: "Procedural Account",
    color: pc.cyan,
  },
  {
    name: "ProceduralPersonal",
    display: "Procedural Personal",
    color: pc.magenta,
  },
]
