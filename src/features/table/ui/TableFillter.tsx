import { useState } from "react"
import { Search } from "lucide-react"

import useTableStore, { SelectTagType } from "../model/useTableStore"
import useQueryTags from "../api/useQueryTags"

import { Input } from "../../../shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select"
import useMutationSearchQuery from "../api/useMutationSearchQuery"
import useMutationPostsByTag from "../api/useMutationPostsByTag"

const TableFillter = () => {
  const { sortBy, setSortBy, sortOrder, setSortOrder, selectedTag, setSelectedTag } = useTableStore()

  const { mutate: mutationSerchQuery } = useMutationSearchQuery()
  const { mutate: mutationPostsByTag } = useMutationPostsByTag()
  const { data: tags } = useQueryTags()

  const [searchQuery, setSearchQuery] = useState("")

  const onEnterSearchInput = () => {
    mutationSerchQuery(searchQuery)
  }

  const onClickTag = (selectedTag: SelectTagType) => {
    setSelectedTag(selectedTag)
    if (selectedTag === "all") {
      return
    }
    mutationPostsByTag(selectedTag)
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && onEnterSearchInput()}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={(selectedTag: SelectTagType) => {
          onClickTag(selectedTag)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags &&
            tags.map((tag) => (
              <SelectItem key={tag.url} value={tag.slug}>
                {tag.slug}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default TableFillter
