import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/disaster/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/disaster/$id"!</div>
}
