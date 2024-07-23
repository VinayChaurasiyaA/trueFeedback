"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "../ui/use-toast";
import axios, { AxiosError } from "axios";
import { Message } from "@/model/User";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const handleDeleteButton = async () => {
    // console.log("Delete button clicked");

    const response = await axios.delete(`/api/delete-message/${message._id}`);
    try {
      if (response.status === 200) {
        toast({
          title: "Message deleted",
          description: "Message deleted successfully",
          //   variant: "success",
        });
        onMessageDelete(message._id as string);
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Error deleting message",
        variant: "destructive",
      });
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-col">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-lg font-semibold">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-10 h-10" variant="destructive">
                <X className="w-10 h-10" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteButton}>
                  Sure
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="mt-2">
          {message.createdAt.toString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
