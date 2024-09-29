import prisma from '../lib/db'

export async function ServerComponent() {
  const data = await prisma.yourModel.findMany()
  return <div>{/* Render your data */}</div>
}