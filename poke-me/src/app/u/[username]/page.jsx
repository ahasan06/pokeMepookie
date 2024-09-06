'use client'
import React from 'react'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useParams } from 'next/navigation'


function Page() {
  
  const { toast } = useToast();
  const params = useParams()
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
  
    try {
      // Send POST request to the API with the required fields
      const response = await axios.post('/api/send-message', {
        username, // From useParams
        content: data.message, // Make sure you're passing the correct field name
      });
  
      console.log("response", response);
  
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Message sent successfully!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        form.reset(); // Reset the form after successful submission
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
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
                <FormLabel>Send Anonymous Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='bg-black border border-transparent text-white hover:text-black hover:border-black'>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Page;
