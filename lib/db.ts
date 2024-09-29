import { Product } from '@/types/product'

// Mock product data
const mockProducts: Product[] = [
  { id: '1', name: 'BARK Sweater', price: 100, status: 'active', description: 'A cozy and stylish sweater for all occasions.', category: 'Apparel', imageUrl: '/images/products/sweater.png' },
  { id: '2', name: 'BARK Cap', price: 50, status: 'draft', description: 'A trendy cap to complete your look.', category: 'Accessories', imageUrl: '/images/products/cap.png' },
  { id: '3', name: 'NFT Membership', price: 200, status: 'active', description: 'Exclusive membership with access to special NFTs.', category: 'Digital', imageUrl: '/images/products/nft_membership.png' },
  { id: '4', name: 'BARK Coffee Mug', price: 75, status: 'archived', description: 'Enjoy your favorite beverage in style.', category: 'Home', imageUrl: '/images/products/mug.png' },
  { id: '5', name: 'BARK T-shirt', price: 150, status: 'active', description: 'A comfortable t-shirt for everyday wear.', category: 'Apparel', imageUrl: '/images/products/tshirt.png' },
  // Add more mock products as needed
]

export interface GetProductsResult {
  products: Product[]
  newOffset: number
  totalProducts: number
}

export async function getProducts(
  search: string,
  offset: number = 0,
  limit: number = 10
): Promise<GetProductsResult> {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 100))

  let filteredProducts = mockProducts.filter(product => product.status === 'active') // Only include active products

  // Apply search filter if search string is provided
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }

  const totalProducts = filteredProducts.length
  const paginatedProducts = filteredProducts.slice(offset, offset + limit)

  // Check if there are no more products
  if (paginatedProducts.length === 0) {
    return {
      products: [],
      newOffset: offset,
      totalProducts
    }
  }

  return {
    products: paginatedProducts,
    newOffset: offset + paginatedProducts.length,
    totalProducts
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 50))

  const product = mockProducts.find(p => p.id === id)
  return product || null
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 100))

  const newProduct: Product = {
    ...product,
    id: (mockProducts.length + 1).toString()
  }

  mockProducts.push(newProduct)
  return newProduct
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 100))

  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) return null

  const updatedProduct = { ...mockProducts[index], ...updates }
  mockProducts[index] = updatedProduct
  return updatedProduct
}

export async function deleteProduct(id: string): Promise<boolean> {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 100))

  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) return false

  mockProducts.splice(index, 1)
  return true
}
