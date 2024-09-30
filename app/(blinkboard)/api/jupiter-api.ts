// Define a type for the swap rate response
interface SwapRate {
  inputAmount: number;
  outputAmount: number;
  price: number;
  // Add any additional fields you expect from the response
}

export async function getSwapRate(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps = 50 // Default value for slippage
): Promise<SwapRate | null> {
  const url = `https://quote-api.jup.ag/v4/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch swap rate');
    }
    
    const data = await response.json();

    // Validate response structure
    if (data.data) {
      return data.data; // Ensure to return the expected fields
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error('Error fetching swap rate:', error);
    return null; // Return null or handle error as needed
  }
}
