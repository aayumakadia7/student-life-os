import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Resource } from '../../types'
import { ExternalLink, FileText, Globe, Video, Code2, BookOpen, Trash2 } from 'lucide-react'

export interface ResourceCardProps {
  resource: Resource
  onDelete?: (id: string) => void
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const typeIcons = {
    PDF: <FileText className="w-4 h-4 text-rose-500" />,
    Website: <Globe className="w-4 h-4 text-sky-500" />,
    YouTube: <Video className="w-4 h-4 text-red-500" />,
    GitHub: <Code2 className="w-4 h-4 text-zinc-400" />,
    Notes: <BookOpen className="w-4 h-4 text-amber-500" />,
    Other: <ExternalLink className="w-4 h-4 text-indigo-500" />,
  }

  return (
    <Card className="flex flex-col justify-between p-4" hoverEffect>
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            {resource.subject}
          </span>
          <Badge variant="secondary" size="sm" className="flex items-center gap-1">
            {typeIcons[resource.type]}
            {resource.type}
          </Badge>
        </div>

        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          {resource.title}
        </h4>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
          {resource.description}
        </p>

        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Open Resource
          <ExternalLink className="w-3 h-3" />
        </a>

        {onDelete && (
          <button
            onClick={() => onDelete(resource.id)}
            className="p-1 text-zinc-400 hover:text-rose-500 rounded-md transition-colors"
            title="Delete Resource"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </Card>
  )
}
