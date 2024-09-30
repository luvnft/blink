export async function getSwapRate(inputMint: string, outputMint: string, amount: number) {
  const url = `https://quote-api.jup.ag/v4/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch swap rate')
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching swap rate:', error)
    throw error
  }
}