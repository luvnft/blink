import { PublicKey } from '@solana/web3.js';
import { z } from 'zod';
import { isValidSignature } from '@solana/web3.js';
import { supabase } from './supabase-client';
import bs58 from 'bs58';

// 1. Ensure wallet address format is valid
export const isValidWalletAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

// 2. Validate email format
export const emailSchema = z.string().email();

export const isValidEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
};

// 3. Check password strength
export const isStrongPassword = (password: string): boolean => {
  const minLength = 12; // Increased from 8 to 12 for better security
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonAlphas = /\W/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasNonAlphas
  );
};

// 4. Verify transaction signatures
export const verifyTransactionSignature = async (
  signature: string,
  publicKey: string,
  message: string
): Promise<boolean> => {
  try {
    const publicKeyObj = new PublicKey(publicKey);
    const signatureBuffer = bs58.decode(signature);
    const messageBuffer = Buffer.from(message);

    return await PublicKey.isOnCurve(publicKeyObj.toBuffer()) && isValidSignature(messageBuffer, signatureBuffer, publicKeyObj);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

// 5. Validate NFT metadata format
export const isValidNFTMetadata = (metadata: any): boolean => {
  const schema = z.object({
    name: z.string().min(1),
    symbol: z.string().min(1),
    description: z.string(),
    image: z.string().url(),
    external_url: z.string().url().optional(),
    attributes: z.array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number()]),
      })
    ),
    properties: z.object({
      files: z.array(z.object({
        uri: z.string().url(),
        type: z.string(),
      })),
      category: z.string(),
      creators: z.array(z.object({
        address: z.string(),
        share: z.number().min(0).max(100),
      })),
    }),
  });

  try {
    schema.parse(metadata);
    return true;
  } catch (error) {
    console.error('Invalid NFT metadata:', error);
    return false;
  }
};

// 6. Validate product inventory before order placement
export const validateProductInventory = async (
  productId: string,
  quantity: number
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('products')
    .select('inventory')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product inventory:', error);
    return false;
  }

  return data.inventory >= quantity;
};

// 7. Check discount code validity and usage limits
export const validateDiscountCode = async (
  code: string,
  userId: string
): Promise<boolean> => {
  const { data: discount, error } = await supabase
    .from('discounts')
    .select('*')
    .eq('code', code)
    .single();

  if (error || !discount) {
    console.error('Error fetching discount code:', error);
    return false;
  }

  const now = new Date();
  const startDate = new Date(discount.startDate);
  const endDate = new Date(discount.endDate);

  if (now < startDate || now > endDate) {
    return false;
  }

  if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
    return false;
  }

  // Check if the user has already used this discount code
  const { data: userUsage, error: userUsageError } = await supabase
    .from('discount_usage')
    .select('*')
    .eq('discountId', discount.id)
    .eq('userId', userId);

  if (userUsageError) {
    console.error('Error fetching user discount usage:', userUsageError);
    return false;
  }

  return userUsage.length === 0;
};

// 8. Ensure review ratings are within valid range (e.g., 1-5)
export const isValidReviewRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

// 9. Validate Blink content
export const isValidBlinkContent = (content: string): boolean => {
  const minLength = 10;
  const maxLength = 280;
  return content.length >= minLength && content.length <= maxLength;
};

// 10. Validate transaction amount
export const isValidTransactionAmount = (amount: number): boolean => {
  return amount > 0 && Number.isFinite(amount);
};

// Helper function to validate all fields of a user input
export const validateUserInput = (input: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidWalletAddress(input.walletAddress)) {
    errors.push('Invalid wallet address');
  }

  if (!isValidEmail(input.email)) {
    errors.push('Invalid email format');
  }

  if (!isStrongPassword(input.password)) {
    errors.push('Password does not meet strength requirements');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate all fields of an NFT input
export const validateNFTInput = (input: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidNFTMetadata(input.metadata)) {
    errors.push('Invalid NFT metadata format');
  }

  if (!isValidWalletAddress(input.creatorAddress)) {
    errors.push('Invalid creator wallet address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate all fields of an order input
export const validateOrderInput = async (input: any): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  for (const item of input.items) {
    const isValidInventory = await validateProductInventory(item.productId, item.quantity);
    if (!isValidInventory) {
      errors.push(`Insufficient inventory for product ${item.productId}`);
    }
  }

  if (input.discountCode) {
    const isValidDiscount = await validateDiscountCode(input.discountCode, input.userId);
    if (!isValidDiscount) {
      errors.push('Invalid or expired discount code');
    }
  }

  if (!isValidTransactionAmount(input.totalAmount)) {
    errors.push('Invalid transaction amount');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate a review input
export const validateReviewInput = (input: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidReviewRating(input.rating)) {
    errors.push('Invalid review rating');
  }

  if (input.content && !isValidBlinkContent(input.content)) {
    errors.push('Invalid review content length');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate a Blink input
export const validateBlinkInput = (input: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidBlinkContent(input.content)) {
    errors.push('Invalid Blink content length');
  }

  if (!isValidWalletAddress(input.creatorAddress)) {
    errors.push('Invalid creator wallet address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};