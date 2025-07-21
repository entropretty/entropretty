import type { MDXComponents } from "mdx/types"

// Helper function to generate URL-friendly IDs from heading text
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing spaces
}

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => {
      const id = generateId(children as string)
      return (
        <h1
          id={id}
          style={{ marginTop: 96 }}
          className="mb-6 scroll-mt-16 text-2xl font-bold"
        >
          {children}
        </h1>
      )
    },
    h2: ({ children }) => {
      const id = generateId(children as string)
      return (
        <h2 id={id} className="mb-4 scroll-mt-16 text-xl font-semibold">
          {children}
        </h2>
      )
    },
    h3: ({ children }) => {
      const id = generateId(children as string)
      return (
        <h3 id={id} className="mb-3 scroll-mt-16 text-xl font-semibold">
          {children}
        </h3>
      )
    },
    p: ({ children }) => <p className="mb-4 text-base">{children}</p>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-base text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-base">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{ marginLeft: 64 }}
        className="mb-4 list-decimal space-y-2 text-base"
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-base">{children}</li>,
    code: ({ children }) => (
      <code className="px-2 py-1 text-base">{children}</code>
    ),
    strong: ({ children }) => (
      <strong className="text-base font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="text-base italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-base italic">
        {children}
      </blockquote>
    ),
    pre: ({ children }) => (
      <pre className="bg-foreground-300 overflow-x-auto rounded-lg p-4">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <table className="my-4 min-w-full divide-y divide-gray-200 text-base">
        {children}
      </table>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {children}
      </td>
    ),
    ...components,
  }
}
