import axios from 'axios'

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY

export async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary}`,
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  })

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
}