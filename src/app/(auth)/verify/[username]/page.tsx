"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// import {  } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schema/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  type VerifyForm = z.infer<typeof verifySchema>;
  const [isSubmitting, setIsSubmitting] = React.useState(true);
  // const [value, setValue] = React.useState("");

  const params = useParams();
  // console.log(params);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    // there is no default values
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyForm) => {
    // console.log(data);
    // console.log(params);
    try {
      setIsSubmitting(false);
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Account verified successfully",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        // setUsernameMessage(axiosError.response.data.message);
        toast({
          title: "An error occurred",
          description: axiosError.response.data.message,
          variant: "destructive",
        });
      } else {
        //   setUsernameMessage("An error occurred");
        toast({
          title: "An error occurred",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(true);
    }
  };
  return (
    <div className="flex justify-center text-secondary-foreground items-center min-h-screen bg-gray-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            TrueFeedBack
          </h1>
          <p className="text-gray-500">Verify your code!</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6 ml-12"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="border border-black"
                          index={0}
                        />
                        <InputOTPSlot
                          className="border border-black"
                          index={1}
                        />
                        <InputOTPSlot
                          className="border border-black"
                          index={2}
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="border border-black"
                          index={3}
                        />
                        <InputOTPSlot
                          className="border border-black"
                          index={4}
                        />
                        <InputOTPSlot
                          className="border border-black"
                          index={5}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your gmail.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSubmitting ? (
              <Button type="submit">Submit</Button>
            ) : (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
          </form>
        </Form>
        {/* DONE: I am trying to use input-otp shadcn */}
      </div>
    </div>
  );
};

export default page;
