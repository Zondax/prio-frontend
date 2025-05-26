'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
// Toasts are inherently styled, so I will omit them to keep the page as plain as possible for core components.
// import { toast } from '@/components/ui/use-toast'
// import { Toaster } from '@/components/ui/toaster'

export default function ShadcnFormsInputsPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log('Form Data Submitted (see console):', data)
    // Basic alert instead of styled toast
    alert('Form Data Submitted! Check the console.')
  }

  return (
    <div>
      {/* <Toaster /> */}
      {/* Omitted Toaster to keep page plain */}
      <h1>Shadcn UI - Forms & Inputs (Plain Demo)</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '2rem' }}>
          <h2>Text Inputs</h2>
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Enter your name" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Type your message here." />
          </div>
          <div>
            {' '}
            {/* Last item in this group, no bottom margin */}
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter a password" />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Selection Controls</h2>
          <div style={{ marginBottom: '1rem' }}>
            <Label>Preferred Framework</Label>
            <Select name="framework">
              <SelectTrigger>
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Frontend</SelectLabel>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            {' '}
            {/* Last item in this group, no bottom margin */}
            <Label>Communication Method</Label>
            <RadioGroup defaultValue="email" name="communication">
              <div>
                <RadioGroupItem value="email" id="r-email" /> <Label htmlFor="r-email">Email</Label>
              </div>
              <div>
                <RadioGroupItem value="phone" id="r-phone" /> <Label htmlFor="r-phone">Phone</Label>
              </div>
              <div>
                <RadioGroupItem value="none" id="r-none" /> <Label htmlFor="r-none">None</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Toggles</h2>
          <div style={{ marginBottom: '1rem' }}>
            <Checkbox id="terms" name="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Switch id="marketing-emails" name="marketing-emails" />
            <Label htmlFor="marketing-emails">Marketing emails</Label>
          </div>
          <div>
            {' '}
            {/* Last item in this group, no bottom margin */}
            <Checkbox id="newsletter" name="newsletter" defaultChecked />
            <Label htmlFor="newsletter">Subscribe to newsletter (checked by default)</Label>
          </div>
        </div>

        <div>
          <Button type="submit">Submit All</Button>
        </div>
      </form>
    </div>
  )
}
