"use client";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const message = () => {
  const params = useParams();
  const [userAccepting, setUserAccepting] = useState(false);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log(params);

  const user = params.username;

  // make a input field to send message to user and check if the user is accepting the messgae
  const isUserAcceptingMessages = async () => {
    const response = await axios.get("/api/user-accepting-messages", {
      params: {
        username: user,
      },
    });
    // console.log(response);
    setUserAccepting(response.data.isAcceptingMessage);
  };
  const handleSubmit = async () => {
    // event.preventDefault();
    // console.log("Message sent");
    // but only if the user is accepting the messages
    setIsSubmitting(true);
    if (!userAccepting) {
      toast({
        title: "User not accepting messages",
        description: "User is not accepting messages",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await axios.post("/api/send-message", {
        username: user,
        content,
      });
      toast({
        title: "Message sent",
        description: "Message sent successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: axiosError.response?.data.message ?? "An error occurred",
        description: "Error sending message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setContent("");
    }
  };
  useEffect(() => {
    isUserAcceptingMessages();
  }, [user]);
  return (
    <div className="flex text-secondary-foreground flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
      <div className="w-full max-w-md p-6 bg-secondary rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-secondary-foreground mb-4">
          Send a Message
        </h1>
        <p className="text-secondary-foreground mb-6">
          Send an anonymous message to{" "}
          <span className="font-semibold">@{user}</span>
        </p>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder="Write your anonymous message here"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {
          <button
            onClick={handleSubmit}
            className={`w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting ? "bg-gray-500" : "bg-blue-500"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        }
      </div>
    </div>
  );
};

export default message;
