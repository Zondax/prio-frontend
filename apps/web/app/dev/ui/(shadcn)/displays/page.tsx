'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShadcnDisplaysPage() {
  return (
    <div>
      <h1>Shadcn UI - Displays (Plain Demo)</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Cards</h2>
        <div style={{ marginBottom: '1rem' }}>
          <Card style={{ width: '350px' }}>
            <CardHeader>
              <CardTitle>Simple Card Title</CardTitle>
              <CardDescription>This is a simple card description.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here. You can put any elements you like.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" style={{ marginRight: '0.5rem' }}>
                Cancel
              </Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card style={{ width: '300px' }}>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Minimal card with just content.</p>
              <div className="mt-2 text-xs text-muted-foreground">Small note here</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Badges</h2>
        <div>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge style={{ backgroundColor: 'blue', color: 'white' }}>Custom Blue</Badge>
        </div>
      </div>

      <div>
        <h2>Avatars</h2>
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://example.com/nonexistent.jpg" alt="Invalid Src" />
            <AvatarFallback>IS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
