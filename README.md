
![Hero Image](hero.gif)

Use entropretty:

```sh
npm create entropretty@latest
```

---

This repository is a monorepository consisting of the following projects:

+ [`packages/entropretty-editor`](https://github.com/peetzweg/entropretty-tools/tree/main/packages/entropretty-editor) - web schema renderer
+ [`packages/@entropretty/utils`](https://github.com/peetzweg/entropretty-tools/tree/main/packages/@entropretty/utils) - collection of helper functions to use during drawing
+ [`packages/entropretty-cli`](https://github.com/peetzweg/entropretty-tools/tree/main/packages/entropretty-cli) - cli tool for bundling, testing, hosting the editor locally
+ [`packages/create-entropretty`](https://github.com/peetzweg/entropretty-tools/tree/main/packages/create-entropretty) - cli tool to create new entropretty workspaces
+ [`apps/entropretty-gallery`](https://github.com/peetzweg/entropretty-tools/tree/main/apps/entropretty-gallery) - the website informing about entropretty and exploring submitted designs

## Getting Started

This monorepo is using [`pnpm`](https://pnpm.io/).

```sh
pnpm install
```

---

Working on the `editor`:

```sh
pnpm dev:entropretty-editor
```

Working on the `website`:

```sh
pnpm dev:entropretty-gallery
```

Working on the `utils`:

```sh
pnpm watch
```

Working on the `cli`:

```sh
pnpm watch
```