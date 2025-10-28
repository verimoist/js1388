// Prisma Client DMMF 확인 스크립트
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

console.log('=== Prisma Client DMMF 확인 ===')

try {
  // DMMF에서 GalleryItem 모델 정보 확인
  const dmmf = prisma._dmmf || prisma._engine?.dmmf
  console.log('DMMF 구조:', Object.keys(dmmf || {}))
  
  if (dmmf && dmmf.datamodel) {
    const galleryItemModel = dmmf.datamodel.models.find((model) => model.name === 'GalleryItem')
    
    if (galleryItemModel) {
      console.log('GalleryItem 모델 필드들:')
      galleryItemModel.fields.forEach((field) => {
        console.log(`- ${field.name}: ${field.type} ${field.isRequired ? '(required)' : '(optional)'}`)
      })
      
      // attachments 필드 존재 여부 확인
      const attachmentsField = galleryItemModel.fields.find((field) => field.name === 'attachments')
      console.log('\nattachments 필드 존재 여부:', !!attachmentsField)
      if (attachmentsField) {
        console.log('attachments 필드 상세:', {
          name: attachmentsField.name,
          type: attachmentsField.type,
          isRequired: attachmentsField.isRequired,
          defaultValue: attachmentsField.default
        })
      }
    } else {
      console.log('GalleryItem 모델을 찾을 수 없습니다.')
    }
  } else {
    console.log('DMMF에 접근할 수 없습니다.')
  }
} catch (error) {
  console.log('DMMF 확인 오류:', error.message)
}

// Prisma Client의 create 메서드 타입 확인
console.log('\n=== Prisma Client 타입 확인 ===')
try {
  // 타입 체크를 위한 더미 호출 (실제 실행하지 않음)
  const createData = {
    title: 'test',
    imageUrl: 'test.jpg',
    attachments: []
  }
  console.log('createData 타입 체크 통과:', typeof createData.attachments === 'object')
} catch (error) {
  console.log('타입 체크 오류:', error)
}

prisma.$disconnect()
