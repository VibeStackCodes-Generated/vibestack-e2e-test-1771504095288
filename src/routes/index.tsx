import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const ping = useMutation({ mutationFn: async () => supabase.auth.getSession() })
  const { data: rows = [] } = useQuery({
    queryKey: ['recipes', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase.from('recipes').select('*').limit(9)
      if (error) throw error
      return data ?? []
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-5 text-center">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-display)]">Public Recipe Book</h2>
        <div className="mt-2 flex justify-center gap-6 text-sm"><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/recipes/">Recipes</Link><Link to="/ingredients/">Ingredients</Link><Link to="/recipe-ingredients/">Recipe Ingredients</Link><Link to="/tags/">Tags</Link><Link to="/recipe-tags/">Recipe Tags</Link></div>
      </header>
      <section className="relative h-[70vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1761587412860-222f6ce02f82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NTQ4MTd8MHwxfHNlYXJjaHwxfHxvdmVyaGVhZCUyMHJ1c3RpYyUyMGtpdGNoZW4lMjB0YWJsZSUyMHdpdGglMjBmcmVzaCUyMGluZ3JlZGllbnRzJTIwYW5kJTIwaGFuZHdyaXR0ZW4lMjByZWNpcGUlMjBjYXJkc3xlbnwwfDB8fHwxNzcxNDk3MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Breakfast table set with food and drinks in kitchen." className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-6 gap-6">
          <div className="max-w-3xl text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-display)]">Discover, save, and share recipes worth making again.</h1>
            <p className="mt-4 text-lg text-primary-foreground/90">Browse by tags and ingredients, then build your own public recipe collection.</p>
            <Link to="/recipes/"><Button className="mt-8 transition-all duration-200">Browse recipes</Button></Link>
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-6xl p-6 gap-6 py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-[family-name:var(--font-display)]">Featured Recipes</h2>
          <Button variant="outline" className="transition-all duration-200" onClick={() => ping.mutate()}>Refresh</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rows.map((row: Record<string, unknown>) => (
            <Link key={String(row.id)} to={"/recipes/" + String(row.id)} className="group block">
              <Card className="rounded-[0.5rem] border border-border shadow-sm transition-all duration-200 hover:scale-[1.02] overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">{row.image_url ? <img src={String(row.image_url)} alt={String(row.title ?? '')} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <img src={`https://picsum.photos/seed/recipes-${String(row.id)}/900/700`} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}</div>
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-display)]">{String(row.title ?? 'Untitled')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1"><p className="text-sm text-muted-foreground">{String(row.description ?? '—')}</p><p className="text-sm text-muted-foreground">{String(row.instructions ?? '—')}</p></CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {rows.length === 0 && <p className="mt-6 text-sm text-muted-foreground">No recipes yet—add the first one and start your public cookbook.</p>}
      </main>
      <footer className="relative mt-16 border-t">
        <img src="https://images.unsplash.com/photo-1666013942797-9daa4b8b3b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NTQ4MTd8MHwxfHNlYXJjaHwyfHxvdmVyaGVhZCUyMHJ1c3RpYyUyMGtpdGNoZW4lMjB0YWJsZSUyMHdpdGglMjBmcmVzaCUyMGluZ3JlZGllbnRzJTIwYW5kJTIwaGFuZHdyaXR0ZW4lMjByZWNpcGUlMjBjYXJkc3xlbnwwfDB8fHwxNzcxNDk3MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="a knife and a board on a wooden surface" className="h-52 w-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-sm text-white">Cook, share, repeat.</div>
      </footer>
    </div>
  )
}
