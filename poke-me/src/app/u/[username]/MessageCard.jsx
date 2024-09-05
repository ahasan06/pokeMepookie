'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

function MessageCard({message,onMessageDelete}) {

    const toast = useToast()
    const handleDeleteConfirm = async()=>{
        const response = axios.delete(`api/delete-message/${message._id}`)
        toast({
            title:response?.data.message
        })
        onMessageDelete(message._id)
    }



    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className='w-5 h-5'/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>

        </div>
    )
}

export default MessageCard
