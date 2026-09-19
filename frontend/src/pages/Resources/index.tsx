import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Resource, ResourceType } from '../../types'
import { ResourceCard } from '../../components/domain/ResourceCard'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { EmptyState } from '../../components/ui/EmptyState'
import { FolderGit2, Plus, Search } from 'lucide-react'

const RESOURCE_TYPES: ResourceType[] = ['PDF', 'Website', 'YouTube', 'GitHub', 'Notes', 'Other']

export const ResourcesPage: React.FC = () => {
  const { resources, addResource, deleteResource } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formType, setFormType] = useState<ResourceType>('Website')
  const [formUrl, setFormUrl] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formTags, setFormTags] = useState('')

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formUrl.trim()) return

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    addResource({
      title: formTitle,
      subject: formSubject,
      type: formType,
      url: formUrl,
      description: formDescription,
      tags: tagsArray,
    })
    setIsModalOpen(false)
  }

  const filtered = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    if (!matchSearch) return false
    if (selectedType !== 'all' && r.type !== selectedType) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Academic Resources & Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Curated textbooks, video lectures, GitHub repositories, and revision notes
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setFormTitle('')
            setFormSubject('Data Structures')
            setFormType('Website')
            setFormUrl('')
            setFormDescription('')
            setFormTags('')
            setIsModalOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title, subject, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-700 dark:text-zinc-300 w-full sm:w-auto cursor-pointer"
        >
          <option value="all">All Types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-6 h-6" />}
          title="No resources found"
          description="Save bookmarks, PDFs, and repository links to access them easily during exam prep."
          actionLabel="Add Resource"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              onDelete={deleteResource}
            />
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Course Resource"
        description="Save helpful study materials, lecture slides, or GitHub repos"
      >
        <form onSubmit={handleAddResource} className="space-y-4">
          <Input
            label="Resource Title"
            placeholder="e.g. Visualgo Sorting & Graph Visualizer"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Subject"
              placeholder="e.g. Data Structures"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              required
            />
            <Select
              label="Resource Type"
              value={formType}
              onChange={(e) => setFormType(e.target.value as ResourceType)}
              options={RESOURCE_TYPES.map((t) => ({ label: t, value: t }))}
            />
          </div>

          <Input
            label="URL / Web Link"
            type="url"
            placeholder="https://..."
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            required
          />

          <Input
            label="Tags (Comma-separated)"
            placeholder="Visuals, Graphs, Algorithms"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Why this resource is useful, chapter coverage..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Resource</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
