'use client'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const loading = () => {
  return (
<div className="space-y-6">
            <div className="flex justify-center items-center bg-white">
              <Skeleton className="h-48 w-48 rounded-full" />
              <div className="space-y-2 ml-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Card>
              <CardContent className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <div className="pt-6">
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
  )
}

export default loading
