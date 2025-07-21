export default function RulesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16">{children}</div>
    </div>
  )
}
