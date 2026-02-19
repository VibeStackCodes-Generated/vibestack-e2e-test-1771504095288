import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const ping = useMutation({ mutationFn: async () => supabase.auth.getSession() })
  useQuery({ queryKey: ['about', 'warm'], queryFn: async () => ({ ok: true }) })

  return (
    <div className="p-6 gap-6">
      <Card className="rounded-[0.5rem] border border-border shadow-sm transition-all duration-200 hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-3xl font-[family-name:var(--font-display)]">About Public Recipe Book</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Public Recipe Book is a simple, public-facing recipe browsing app where anyone can create, categorize, and view recipes—no account required. Organize dishes with tags, add structured ingredient lists, and keep everything easy to search and revisit. It’s built for quick discovery and practical cooking, from weeknight staples to special-occasion favorites.</p>
          <button className="underline transition-all duration-200" onClick={() => ping.mutate()}>Check session</button>
        </CardContent>
      </Card>
    </div>
  )
}
