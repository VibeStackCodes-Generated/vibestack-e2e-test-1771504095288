import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/recipe-ingredients/')({
  component: RecipeIngredientsPage,
})

function RecipeIngredientsPage() {
  const [search, setSearch] = useState('')
  const { data: rows = [], isPending } = useQuery({
    queryKey: ['recipe_ingredients', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('recipe_ingredients').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
  const filtered = search ? rows.filter((row: Record<string, unknown>) => String(row.quantity ?? '').toLowerCase().includes(search.toLowerCase())) : rows

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-5 text-center">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-display)]">Public Recipe Book</h2>
        <div className="mt-2 flex justify-center gap-6 text-sm"><Link to="/">Home</Link><Link to="/recipes/">Recipes</Link><Link to="/ingredients/">Ingredients</Link><Link to="/recipe-ingredients/">Recipe Ingredients</Link><Link to="/tags/">Tags</Link><Link to="/recipe-tags/">Recipe Tags</Link></div>
      </header>
      <main className="mx-auto max-w-6xl p-6 gap-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-4xl font-[family-name:var(--font-display)]">Recipe Ingredients</h1>
          <Input className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipe ingredients..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((row: Record<string, unknown>) => (
            <Link key={String(row.id)} to={"/recipe-ingredients/" + String(row.id)} className="group block">
              <Card className="rounded-[0.5rem] border border-border shadow-sm transition-all duration-200 hover:scale-[1.02] overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden"><img src={`https://picsum.photos/seed/recipe_ingredients-${String(row.id)}/900/700`} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                <CardHeader><CardTitle className="font-[family-name:var(--font-display)]">{String(row.quantity ?? 'Untitled')}</CardTitle></CardHeader>
                <CardContent className="space-y-1"><p className="text-sm text-muted-foreground">{String(row.recipe_id ?? '—')}</p><p className="text-sm text-muted-foreground">{String(row.ingredient_id ?? '—')}</p></CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
