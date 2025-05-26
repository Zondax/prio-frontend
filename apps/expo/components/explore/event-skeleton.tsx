'use client'

import React from 'react'
import { View } from 'react-native'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface EventSkeletonProps {
  isCompact?: boolean
}

export function EventSkeleton({ isCompact = false }: EventSkeletonProps) {
  return (
    <Card className="relative my-4">
      {/* Image placeholder */}
      <View className={`w-full overflow-hidden rounded-t-lg ${isCompact ? 'h-32' : 'h-48'}`}>
        <Skeleton className="h-full w-full" />
      </View>

      <CardHeader>
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            {/* Title placeholder */}
            <Skeleton className={`h-6 w-3/4 ${isCompact ? 'h-5' : 'h-6'}`} />
          </View>
        </View>
      </CardHeader>

      <CardContent>
        {/* Description placeholder */}
        <View className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </View>

        <View className="space-y-3">
          {/* Date placeholder */}
          <View className="flex-row items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </View>

          {/* Location placeholder */}
          <View className="flex-row items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </View>

          {/* Source placeholder */}
          <View className="flex-row items-center mb-2">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </View>

          {/* Tags placeholder */}
          <View className="flex-row flex-wrap gap-1.5 mt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
