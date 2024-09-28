"use client";

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { userService, UserAccount } from '@components/services/user-service'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function UserAccountForm() {
  const [user, setUser] = useState<UserAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors, isDirty } } = useForm<UserAccount>()

  useEffect(() => {
    async function fetchUserAccount() {
      setIsLoading(true)
      try {
        const userData = await userService.getUserAccount()
        setUser(userData)
        setValue('name', userData.name)
        setValue('account.avatar', userData.account.avatar)
        setValue('account.walletAddress', userData.account.walletAddress)
      } catch (error) {
        console.error('Error fetching user account:', error)
        toast({
          title: "Error",
          description: "Failed to fetch user account information",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserAccount()
  }, [setValue])

  const onSubmit = async (data: UserAccount) => {
    setIsLoading(true)
    try {
      const updatedUser = await userService.updateUserAccount(data)
      setUser(updatedUser)
      toast({
        title: "Success",
        description: "User account updated successfully",
      })
    } catch (error) {
      console.error('Error updating user account:', error)
      toast({
        title: "Error",
        description: "Failed to update user account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              {...register('account.avatar', { required: 'Avatar URL is required' })}
            />
            {errors.account?.avatar && <p className="text-sm text-red-500">{errors.account.avatar.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              id="walletAddress"
              {...register('account.walletAddress', { 
                required: 'Wallet address is required',
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: 'Invalid Ethereum wallet address'
                }
              })}
            />
            {errors.account?.walletAddress && <p className="text-sm text-red-500">{errors.account.walletAddress.message}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit(onSubmit)} 
          disabled={isLoading || !isDirty}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Account'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}