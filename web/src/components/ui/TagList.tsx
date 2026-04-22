interface Props {
  tags: string[]
}

export function TagList({ tags }: Props) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
