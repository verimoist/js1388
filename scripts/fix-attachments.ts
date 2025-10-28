import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// 환경변수 로드
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function fix(model: 'notice'|'galleryItem'|'resource') {
  console.log(`[fix] ${model} 정규화 시작...`)
  
  // @ts-ignore
  const rows = await prisma[model].findMany({ select: { id: true, attachments: true } })
  let fixed = 0
  
  for (const r of rows) {
    const a = (r as any).attachments
    let next: any[] = []
    
    if (a == null) {
      next = []
    } else if (typeof a === 'string') {
      try { 
        next = JSON.parse(a) 
      } catch { 
        console.log(`[fix] ${model} ${r.id}: JSON 파싱 실패, 빈 배열로 설정`)
        next = [] 
      }
    } else if (Array.isArray(a)) {
      next = a
    } else {
      next = []
    }

    // validate each attachment
    next = next.filter(x => x && typeof x.url === 'string' && typeof x.name === 'string')
    
    // @ts-ignore
    await prisma[model].update({ 
      where: { id: r.id }, 
      data: { attachments: next } 
    })
    fixed++
  }
  
  console.log(`[fix] ${model}: ${fixed} rows normalized`)
}

async function main() {
  try {
    console.log('=== 첨부파일 데이터 정규화 시작 ===')
    
    await fix('notice')
    await fix('galleryItem')
    await fix('resource')
    
    console.log('=== 첨부파일 데이터 정규화 완료 ===')
  } catch (error) {
    console.error('정규화 오류:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('정규화 스크립트 완료')
    process.exit(0)
  })
  .catch(e => {
    console.error('정규화 스크립트 실패:', e)
    process.exit(1)
  })
