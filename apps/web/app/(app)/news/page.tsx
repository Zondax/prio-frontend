'use client'

import { ArrowUpRight, BookMarked, MessageSquare, ThumbsUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">News</h2>
        <p className="text-muted-foreground">Stay updated with the latest announcements and updates.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'New Feature Release',
            description: 'Introducing our latest platform features and improvements.',
            category: 'Product Update',
            date: 'Just now',
            likes: 24,
            comments: 8,
          },
          {
            title: 'Community Milestone',
            description: 'Celebrating 10,000 active users on our platform!',
            category: 'Announcement',
            date: '2 hours ago',
            likes: 156,
            comments: 32,
          },
          {
            title: 'Platform Maintenance',
            description: 'Scheduled maintenance and performance improvements.',
            category: 'System',
            date: '1 day ago',
            likes: 89,
            comments: 15,
          },
        ].map((post) => (
          <Card key={post.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{post.category}</Badge>
                <Button variant="ghost" size="icon">
                  <BookMarked className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-4">{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{post.date}</span>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
