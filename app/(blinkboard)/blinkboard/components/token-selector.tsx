import React, { useEffect, useState } from 'react'
import { fetchTokenList } from '../api/fetch-token-list'

interface TokenSelectorProps {
  selectedToken: any
  onSelectToken: (token: any) => void
  label: string
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ selectedToken, onSelectToken, label }) => {
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    async function getTokens() {
      const tokenList = await fetchTokenList()
      setTokens(tokenList)
    }
    getTokens()
  }, [])

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-700">{label}</label>
      <select
        value={selectedToken ? selectedToken.symbol : ''}
        onChange={(e) => {
          const selected = tokens.find((token) => token.symbol === e.target.value)
          onSelectToken(selected)
        }}
        className="border p-2 rounded-md mt-1"
      >
        <option value="" disabled>Select Token</option>
        {tokens.map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.symbol} - {token.name}
          </option>
        ))}
      </select>
    </div>
  )
}
