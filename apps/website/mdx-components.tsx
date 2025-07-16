import type { MDXComponents } from "mdx/types";

// Helper function to generate URL-friendly IDs from heading text
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
};

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => {
      const id = generateId(children as string);
      return (
        <h1
          id={id}
          style={{ marginTop: 96 }}
          className="text-2xl font-bold mb-6 scroll-mt-16"
        >
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = generateId(children as string);
      return (
        <h2 id={id} className="text-xl font-semibold mb-4 scroll-mt-16">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = generateId(children as string);
      return (
        <h3 id={id} className="text-xl font-semibold mb-3 scroll-mt-16">
          {children}
        </h3>
      );
    },
    p: ({ children }) => <p className="text-base mb-4">{children}</p>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline text-base"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 mb-4 text-base">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{ marginLeft: 64 }}
        className="list-decimal space-y-2 mb-4 text-base"
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-base">{children}</li>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-2 py-1 text-sm">{children}</code>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-base">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-base">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-base">
        {children}
      </blockquote>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <table className="min-w-full divide-y divide-gray-200 my-4 text-base">
        {children}
      </table>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {children}
      </td>
    ),
    ...components,
  };
}
