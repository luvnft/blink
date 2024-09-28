import axios from 'axios'

export interface UserAccount {
  id: string
  name: string
  email: string
  account: {
    avatar: string
    walletAddress: string
  }
}

export const userService = {
  async getUserAccount(): Promise<UserAccount> {
    const response = await axios.get('/api/user/account')
    return response.data.user
  },

  async updateUserAccount(data: Partial<UserAccount>): Promise<UserAccount> {
    const response = await axios.put('/api/user/account', data)
    return response.data.user
  },
}