export type BookType = {
  id: string,
  title: string,
  image: string,
  date: string,
}

export type VideosType = {
  title: string,
  src: string,
  date: string,
}

export type ArticleType = {
  title: string,
  src: string,
  date: string,
}

export type PracticalType = {
  title: string,
  filename: string,
  date: string,
}

export type LibraryType = {
  books: BookType[],
  videos: VideosType[],
  practicals: PracticalType[],
  articles: ArticleType[],
}
