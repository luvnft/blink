interface DonationResponse {
    success: boolean;
    message?: string; // Optional field for error messages or feedback
  }
  
  export const processDonation = async (amount: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/v1/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to process donation');
      }
  
      const data: DonationResponse = await response.json();
  
      // Validate response structure
      if (data.success !== undefined) {
        return data.success; // Return the success status
      } else {
        console.error('Unexpected response structure:', data);
        return false; // Handle unexpected response
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      return false; // Return false on error
    }
  }
  