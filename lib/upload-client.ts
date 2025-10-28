export type Uploaded = {
  name: string
  url: string
  contentType?: string
  size?: number
}

export async function uploadToBlob(file: File, folder: 'notice'|'press'|'gallery'|'resources'): Promise<Uploaded> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', folder)
  
  console.log('업로드 요청:', { filename: file.name, folder, size: file.size, type: file.type })
  
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = await res.json()
  
  if (!res.ok) {
    console.error('업로드 실패:', data)
    throw new Error(data?.error || JSON.stringify(data))
  }
  
  console.log('업로드 성공:', data)
  
  return {
    name: data.originalName ?? file.name,
    url: data.url,
    contentType: data.contentType ?? file.type,
    size: data.size ?? file.size
  }
}
