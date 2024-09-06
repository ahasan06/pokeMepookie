'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'


function Page() {
  
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false); 
  const [messageContent, setMessageContent] = useState('');
  const username = params.username;
  console.log("use param got username",username);
  
// Define the message schema using zod
const messageSchema = z.object({
  message: z.string().min(1, "Message is required").max(500, "Message must be under 500 characters"),
});

  // Initialize form with zod validation
  const form = useForm({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data) => {
    console.log("data:", data);
    setIsLoading(true);
    try {
      // Send POST request to the API with the required fields
      const response = await axios.post('/api/send-message', {
        username, // From useParams
        content: data.message, // Make sure you're passing the correct field name
      });
  
      console.log("response", response);
  
      if (response.status === 200) {
        toast.success("Message Sent Successfully!");
        form.reset(); 
        setMessageContent('');
      }
    } catch (error) {
      console.error(error);
      toast.success("Message not sent!");
    }finally {
      setIsLoading(false); 
    }
  };
  
  
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message @{username}</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here..." {...field} 
                  onChange={(e)=>{
                    field.onChange(e);
                    setMessageContent(e.target.value)
                  }}
                  value={messageContent}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            {isLoading ? (
              <Button disabled  className='bg-black border border-transparent text-white hover:text-black hover:border-black'>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}  className='bg-black border border-transparent text-white hover:text-black hover:border-black'>
                Send It
              </Button>
            )}
        </form>
      </Form>
    </div>
  )
}

export default Page;
