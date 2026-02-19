import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tags/$id')({
  component: TagDetailPage,
})

function TagDetailPage() {
  const { id } = Route.useParams()
  const { data: row, isPending, error } = useQuery({
    queryKey: ['tags', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('tags').select('*').eq('id', id).single()
      if (error) throw error
      return data as Record<string, unknown>
    },
  })

  if (isPending) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-destructive">{error.message}</div>
  if (!row) return <div className="p-8">Not found</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-5 text-center">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-display)]">Public Recipe Book</h2>
        <div className="mt-2 flex justify-center gap-6 text-sm"><Link to="/">Home</Link><Link to="/recipes/">Recipes</Link><Link to="/ingredients/">Ingredients</Link><Link to="/recipe-ingredients/">Recipe Ingredients</Link><Link to="/tags/">Tags</Link><Link to="/recipe-tags/">Recipe Tags</Link></div>
      </header>
      <article className="mx-auto max-w-3xl p-6 gap-6 py-12 space-y-8">
        
        <h1 className="text-4xl font-[family-name:var(--font-display)]">{String(row.name ?? 'Tag')}</h1>
        <section className="space-y-2"><h2 className="text-xl font-[family-name:var(--font-display)]">Details</h2><dl>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
                <dd className="text-sm mt-1">{String(row.name ?? '—')}</dd>
              </div></dl></section>
        <Link to="/tags/"><Button variant="outline" className="transition-all duration-200">Back to Tags</Button></Link>
      </article>
    </div>
  )
}
