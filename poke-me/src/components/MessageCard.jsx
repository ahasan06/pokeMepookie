import React from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import dayjs from 'dayjs';
import axios from 'axios';

function MessageCard({ message, onMessageDelete }) {

    // Confirm delete action
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`);
            console.log("response to delete message: ", message._id);
            
            // Pass only the message string to the toast
            toast.success(response.data.message); 
            // Call the callback to update the UI
            onMessageDelete(message._id);
        } catch (error) {
            toast.error("Failed to delete message!");
            console.error(error);
        }
    };

    return (
        <div>
            <Card className="card-bordered">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>{message.content || "Message Content"}</CardTitle>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className='bg-black border border-transparent text-white hover:text-black hover:border-black'>
                                    <X className="hover:animate-spin" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white shadow-md rounded-md"> {/* Add bg-white here */}
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this message.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="text-sm">
                        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                    </div>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>
        </div>
    );
}

export default MessageCard;
