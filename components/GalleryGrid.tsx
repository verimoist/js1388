'use client'

import { Eye } from "lucide-react";
import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Modal from './ui/Modal'

interface GalleryItem {
  id: number
  title: string
  image: string
  description?: string
}

interface GalleryGridProps {
  items: GalleryItem[]
  columns?: 2 | 3 | 4
}

const GalleryGrid = ({ items, columns = 3 }: GalleryGridProps) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (item: GalleryItem, index: number) => {
    setSelectedItem(item)
    setCurrentIndex(index)
  }

  const closeModal = () => {
    setSelectedItem(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % items.length
    setCurrentIndex(nextIndex)
    setSelectedItem(items[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setSelectedItem(items[prevIndex])
  }

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => openModal(item, index)}
          >
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Eye className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedItem}
        onClose={closeModal}
        size="xl"
        className="!max-w-6xl"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="relative">
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedItem.title}
              </h3>
              {selectedItem.description && (
                <p className="text-gray-600">{selectedItem.description}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default GalleryGrid
