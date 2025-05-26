'use client'

import React from 'react'
import { View } from 'react-native'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

interface CollectionSkeletonProps {
  index?: number
}

export function CollectionSkeleton({ index = 0 }: CollectionSkeletonProps) {
  return (
    <Card className="relative my-2 overflow-hidden">
      {/* Cover Image Skeleton */}
      <Skeleton className="w-full h-40 rounded-t-lg" />

      {/* Card Header */}
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>

      {/* Card Content */}
      <CardContent>
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-2/3 mb-3" />

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
