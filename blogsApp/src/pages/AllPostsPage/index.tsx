import { trpc } from '../../lib/trpc'

export const AllPostsPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getPosts.useQuery()

  if (isLoading || isFetching) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div>
      <h1>BLOGS</h1>
      {data.posts.map((post) => {
        return (
          <div key={post.nick}>
            <h2>{post.name}</h2>
            <p>{post.description}</p>
          </div>
        )
      })}
    </div>
  )
}
