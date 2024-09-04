'use client'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'


function VerifyAccount() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const form = useForm({
    resolver:zodResolver(verifySchema)

  })
  const onSubmit = async(data)=>{

    try {
     const response = await axios.post(`/api/verify-code`,{
        username: params.username,
        code:data.code
      })

      toast({
        title:"Success",
        description: response.data.message
      })
      router.push('/sign-in')

    } catch (error) {
      
      toast({
        title:"Success",
        description: error.response?.data?.message,
        status: 'error',
        variant:"destructive"

      })
      
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div>
          <h1 className="text-center text-3xl capitalize font-bold pb-5">Verify Your Account</h1>
      </div>

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>verification code</FormLabel>
              <FormControl>
                <Input placeholder="Verification code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

      </div>
    </div>
  )
}

export default VerifyAccount
