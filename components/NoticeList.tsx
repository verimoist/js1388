import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';
import Card from './ui/Card';

interface Notice {
  id: string
  title: string
  content: string
  date: string
  views: number
  category: 'notice' | 'press'
}

interface NoticeListProps {
  notices: Notice[]
  showCategory?: boolean
  limit?: number
}

const NoticeList = ({ notices, showCategory = false, limit }: NoticeListProps) => {
  const displayNotices = limit ? notices.slice(0, limit) : notices

  return (
    <div className="space-y-4">
      {displayNotices.map((notice) => (
        <Card key={notice.id} hover className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {showCategory && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    notice.category === 'notice' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {notice.category === 'notice' ? '공지' : '보도자료'}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {notice.date}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-brand-primary transition-colors">
                <Link href={`/news/${notice.id}`}>
                  {notice.title}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {notice.content}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{notice.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{notice.views}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default NoticeList
