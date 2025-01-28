'use client'
import React from 'react'

const loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div className='animate-spin rounded-full border-t-4 border-blue-500 w-12 h-12'></div>
    <div className="loader">Chargement en cours...</div>
  </div>
  )
}

export default loading
