export default function YYLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-20">
      {children}
    </main>
  )
}
