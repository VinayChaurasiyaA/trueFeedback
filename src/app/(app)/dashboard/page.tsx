"use client";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/model/User";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import message from "@/app/u/[username]/page";
import MessageCard from "@/components/MessageCard/MessageCard";
import { ApiResponse } from "@/types/ApiResponse";

const dashboard = () => {
  type AcceptMessageForm = z.infer<typeof acceptMessageSchema>;
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profileURL, setProfileURL] = useState("");
  const [ifNotFound, setIfNotFound] = useState("");
  const form = useForm<AcceptMessageForm>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { data: session } = useSession();
  // console.log("Session:", session); // Debugging

  const { register, setValue, watch } = form;
  const { toast } = useToast();
  const acceptMessages = watch("acceptMessages");
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      // console.log(response.data.isAcceptingMessage);
      setValue("acceptMessages", response.data.isAcceptingMessage);
      // console.log(response.data.isAcceptingMessge);
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Error fetching accept message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        // console.log(response.data.messages[0]);
        setMessages(response.data.messages);
        if (refresh) {
          toast({
            title: "Messages refreshed",
            description: "Messages refreshed successfully",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: axiosError?.response?.data.message ?? "An error occurred",
          description: "Error updating accept message status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  // const fixUserName = async () => {
  //   const response = await axios.post("/api/accept-messages", {
  //     acceptMessages: !acceptMessages,
  //   });
  //   console.log(response, "from /api/accept-messages POST wala");
  //   setIfNotFound(response.data.updatedUser.username);
  // };
  useEffect(() => {
    if (!session || !session.user) return;

    const username =
      session?.user.username ||
      session?.user?.name?.trim().split(" ")[0] ||
      " ";
    // console.log("Usernane :", username);
    // fixUserName();

    if (typeof window !== "undefined") {
      // setBaseURL(`${window.location.protocol}//${window.location.host}`);
      const baseURL = `${window.location.protocol}//${window.location.host}`;
      setProfileURL(`${baseURL}/u/${username}`); // following leedcode pattern
    }

    fetchMessages();
    fetchAcceptMessage();
  }, [
    session,
    setValue,
    fetchAcceptMessage,
    fetchMessages,
    // handleDeleteMessage,
  ]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      // console.log(response, "from /api/accept-messages POST wala");
      // setIfNotFound(response.data.updatedUser.username);
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Accept message status updated",
        description: "Accept message status updated successfully",
      });
    } catch (error) {
      // get the axios error
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: axiosError?.response?.data.message ?? "An error occurred",
        description: "Error updating accept message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // console.log(session?.user.username);
  // const { username } = session?.user as User;
  // console.log(session?.user.username || );
  // console.log(session?.user.name?.trim().split(" ")[0]);
  // const username =
  //   session?.user.username || session?.user?.name?.trim().split(" ")[0] || " ";
  // let baseURL;
  // const baseURL = `${window.location.protocol}//${window.location.host}`;

  // const profileURL = "abc";
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: "Copied",
      description: "Profile URL copied to clipboard",
    });
  };
  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return (
    <div className="my-8 mx-8 md:mx-8 lg:mx-auto p-6 bg-secondary text-secondary-foreground rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="flex items-center">Copy your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            className="text-secondary-foreground input input-bordered w-full p-2 mr-2"
            value={profileURL}
            readOnly
          />
          <Button
            onClick={copyToClipboard}
            className="bg-secondary text-black text-secondary-foreground p-2 ml-2 rounded"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          className="text-secondary-foreground bg-secondary border border-black"
          {...register("acceptMessages")}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-center absolute">
          Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 text-black bg-secondary text-secondary-foreground"
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              // key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  );
};

export default dashboard;
