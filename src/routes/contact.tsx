import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useQuery({ queryKey: ['contact', 'warm'], queryFn: async () => ({ ok: true }) })

  const submit = useMutation({
    mutationFn: async () => {
      await supabase.auth.getSession()
      return { ok: true }
    },
  })

  return (
    <div className="p-6 gap-6">
      <Card className="rounded-[0.5rem] border border-border shadow-sm transition-all duration-200 hover:scale-[1.02]">
        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your project" />
          <Button className="transition-all duration-200" onClick={() => submit.mutate()}>
            {submit.isPending ? 'Sending…' : 'Send message'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
