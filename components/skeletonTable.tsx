import React from 'react'
import { Skeleton } from './ui/skeleton'

const SkeletonTable = () => {
  return (
    <div className=" flex flex-col ">

    <div className="w-full  bg-white shadow-md rounded-md">
      <div className="p-5">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {[...Array(4)].map((_, index) => (
                  <th key={index} className="px-6 py-3 text-left">
                    <Skeleton className="h-4 w-24 " />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(4)].map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SkeletonTable
