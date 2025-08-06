'use client'
 
import dynamic from 'next/dynamic'
 
const MapClient = dynamic(() => import('@/components/musician-com/MapClient'), {
  ssr: false,
})
export default function MusiciansMap() {
    return (
        <div className="">
            <MapClient />
        </div>
    )
}