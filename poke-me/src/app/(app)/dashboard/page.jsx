'use client';

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { toast } from 'react-hot-toast';

function DashboardPage() {
  const [messages, setMessages] = useState([]); // Initialize with an empty array
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  console.log("message :",messages);


  const { data: session, status } = useSession(); // Destructure session data and status
  // Handle session loading or unauthenticated state
  useEffect(() => {
    if (status === 'loading') return; // Render loading state while session is fetched
    if (!session || !session.user) return; // Avoid running fetch without session

    fetchMessages(); // Fetch messages when session is available
    fetchAcceptMessage(); // Fetch accept message status when session is available
  }, [session, status]);

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessage = watch('acceptMessages');

  // Fetch accept message status
  const fetchAcceptMessage = useCallback(async () => {
    console.log('Fetching accept message status...');
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-message');
      console.log("fetching response accept message",response);
      
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  // Fetch user messages //
  const fetchMessages = useCallback(async (refresh = false) => {
    console.log('Fetching messages...');
   
    
    setIsLoading(true);
    try {
      const response = await axios.get('/api/get-messages');
      console.log("fetching response",response);
      setMessages(response.data.message || []); // Set messages array or empty if none
      if (refresh) {
        toast.success("Message Refreshed");
      }
    } catch (error) {
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-message', {
        acceptMessages: !acceptMessage,
      });
      setValue('acceptMessages', !acceptMessage);
      toast.success(response.data.message);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((messages) => messages.filter((message) => message._id !== messageId));
  };



  const copyToClipboard = () => {
    const profileUrl = `${window.location.protocol}//${window.location.host}/u/${session.user.username}`;
    const copySuccess = navigator.clipboard.writeText(profileUrl);
    toast.success('Copied!'); 
  };

  // Handling when there's no session or user not logged in
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  const profileUrl = `${typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/u/${session.user.username}` : ''}`;

  return (
    <div className="my-8 md:mx-4 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg mb-2 font-semibold">Copy your unique link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard} className='bg-black border border-transparent text-white hover:text-black hover:border-black'>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}

        />
        <span>Accept Message: {acceptMessage ? 'On' : 'Off'}</span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No Messages</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
