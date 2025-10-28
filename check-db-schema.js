// 프로덕션 DB 스키마 확인 스크립트
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_MN9Vd0xHXrzY@ep-steep-leaf-ahvq0gga-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

async function checkDatabaseSchema() {
  try {
    console.log('=== 프로덕션 DB 스키마 확인 ===')
    
    // GalleryItem 테이블의 컬럼 정보 조회
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'GalleryItem' 
      ORDER BY ordinal_position
    `
    
    console.log('GalleryItem 테이블 컬럼들:')
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULL)'} ${col.column_default ? `DEFAULT: ${col.column_default}` : ''}`)
    })
    
    // attachments 컬럼 존재 여부 확인
    const attachmentsColumn = columns.find(col => col.column_name === 'attachments')
    console.log('\nattachments 컬럼 존재 여부:', !!attachmentsColumn)
    
    if (attachmentsColumn) {
      console.log('attachments 컬럼 상세:', {
        name: attachmentsColumn.column_name,
        type: attachmentsColumn.data_type,
        nullable: attachmentsColumn.is_nullable,
        default: attachmentsColumn.column_default
      })
    }
    
  } catch (error) {
    console.error('DB 스키마 확인 오류:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseSchema()
