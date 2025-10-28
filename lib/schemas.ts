import { z } from "zod"

// 공통 첨부파일 스키마
export const attachmentSchema = z.object({
  name: z.string().min(1, "파일명은 필수입니다"),
  url: z.string().url("올바른 URL 형식이어야 합니다"),
  size: z.number().min(0, "파일 크기는 0 이상이어야 합니다"),
  type: z.string().min(1, "파일 타입은 필수입니다")
})

// 공통 링크 스키마
export const linkSchema = z.object({
  title: z.string().min(1, "링크 제목은 필수입니다"),
  url: z.string().url("올바른 URL 형식이어야 합니다"),
  description: z.string().optional()
})

// 공지사항 생성 스키마
export const noticeCreateSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자 이하여야 합니다"),
  content: z.string().min(1, "내용은 필수입니다").max(10000, "내용은 10000자 이하여야 합니다"),
  category: z.enum(["notice", "press"]).default("notice"),
  published: z.boolean().default(true),
  attachments: z.array(attachmentSchema).default([]),
  links: z.array(linkSchema).default([])
})

// 보도자료 생성 스키마
export const pressCreateSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자 이하여야 합니다"),
  content: z.string().min(1, "내용은 필수입니다").max(10000, "내용은 10000자 이하여야 합니다"),
  sourceUrl: z.string().url("올바른 URL 형식이어야 합니다").optional(),
  published: z.boolean().default(true),
  attachments: z.array(attachmentSchema).default([]),
  links: z.array(linkSchema).default([])
})

// 갤러리 생성 스키마
export const galleryCreateSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자 이하여야 합니다"),
  caption: z.string().max(1000, "설명은 1000자 이하여야 합니다").optional(),
  imageUrl: z.string().url("올바른 이미지 URL이어야 합니다"),
  attachments: z.array(attachmentSchema).default([])
})

// 자료실 생성 스키마
export const resourceCreateSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자 이하여야 합니다"),
  fileUrl: z.string().url("올바른 파일 URL이어야 합니다"),
  attachments: z.array(attachmentSchema).default([])
})
