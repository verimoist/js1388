import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

// 공지사항 데이터 가져오기 (캐시 적용)
export const getNotices = unstable_cache(
  async (limit?: number) => {
    return await prisma.notice.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
  },
  ['notices'],
  {
    tags: ['notices'],
    revalidate: 60 // 1분 캐시
  }
)

// 보도자료 데이터 가져오기 (캐시 적용)
export const getPressReleases = unstable_cache(
  async (limit?: number) => {
    return await prisma.notice.findMany({
      where: { 
        published: true,
        category: 'press'
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
  },
  ['press'],
  {
    tags: ['press'],
    revalidate: 60 // 1분 캐시
  }
)

// 갤러리 데이터 가져오기 (캐시 적용)
export const getGalleryItems = unstable_cache(
  async (opts?: { limit?: number; includeHidden?: boolean }) => {
    const where = opts?.includeHidden ? {} : {} // 현재는 필터 없음, 나중에 확장 가능
    return await prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: opts?.limit
    })
  },
  ['gallery'],
  {
    tags: ['gallery'],
    revalidate: 60 // 1분 캐시
  }
)

// 갤러리 캐시 무효화
export const invalidateGallery = () => {
  const { revalidateTag } = require('next/cache')
  revalidateTag('gallery')
}

// 자료실 데이터 가져오기 (캐시 적용)
export const getResources = unstable_cache(
  async (limit?: number) => {
    return await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  },
  ['resources'],
  {
    tags: ['resources'],
    revalidate: 60 // 1분 캐시
  }
)

// 공지사항 상세 가져오기 (캐시 적용)
export const getNoticeById = unstable_cache(
  async (id: string) => {
    return await prisma.notice.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
  },
  ['notice-detail'],
  {
    tags: ['notices'],
    revalidate: 60 // 1분 캐시
  }
)

// 보도자료 상세 가져오기 (캐시 적용)
export const getPressById = unstable_cache(
  async (id: string) => {
    return await prisma.notice.findUnique({
      where: { 
        id,
        category: 'press'
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
  },
  ['press-detail'],
  {
    tags: ['press'],
    revalidate: 60 // 1분 캐시
  }
)
