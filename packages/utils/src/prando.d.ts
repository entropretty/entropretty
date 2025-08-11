// Manual declare this module as tsup otherwise fails dts generation,
// as it's not including external package and the experimental --resolveDts flag
// fails in this project

declare module "prando" {
  export default class Prando {
    constructor(seed?: number | string)

    next(min?: number, max?: number): number
  }
}
