interface InfoBlockProps {
  children: React.ReactNode
}

export default function InfoBlock({ children }: InfoBlockProps) {
  return (
    <div className="my-6 flex flex-col items-center justify-center border border-blue-200 bg-blue-50 p-4">
      <div className="m-0 flex flex-row p-0 pt-4 text-center text-sm text-blue-700">
        {children}
      </div>
    </div>
  )
}
