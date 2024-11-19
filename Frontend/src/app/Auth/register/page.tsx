'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { useState } from "react";
import { Input } from "@/Components/ui/input";
import Image from "next/image";
import Link from "next/link";
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
} from "@/Components/ui/alert-dialog"
import { SignUp } from "@/Actions/user.ation";

import dynamic from "next/dynamic";

// Dynamically import the file input component
const FileInput = dynamic(() => import("@/Components/FileInputComponent"), { ssr: false });



const formSchema = z.object({
    fullName: z.string().min(4, {
        message: "Username must be at least 4 characters.",
    }),
    userName: z.string().min(4, {
        message: "Username must be at least 4 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(4, {
        message: "Password must be at least 8 characters.",
    }),
    avatar: z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        lastModified: z.number(),
        webkitRelativePath: z.string(),
    }),
    coverImage: z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        lastModified: z.number(),
        webkitRelativePath: z.string(),
    }).optional(),

});

export default function RegisterForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            userName: "",
            email: "",
            password: "",
            avatar: {},
            coverImage: {},
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {


            try {
                const { fullName, userName, email, password, avatar, coverImage } = values
                const res = await SignUp({ fullName, userName, email, password, avatar, coverImage })
                console.log(res)
            } catch (error) {
                console.log(error)
                
            }
        
    }

    return (
        <div className=" flex flex-col md:flex-row items-center justify-center  bg-neutral-900 p-6">
            <div className="w-full   md:w-1/2 bg-neutral-800 p-8 rounded-lg shadow-lg">

                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    Register Form
                </h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2 w-full"
                    >
                        {/* fullName Field */}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel className="text-white">fullName</FormLabel>
                                    <FormControl >
                                        <Input
                                            placeholder="Enter your fullname"
                                            {...field}
                                            className="bg-neutral-700 text-white "
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel className="text-white">Username</FormLabel>
                                    <FormControl >
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                            className="bg-neutral-700 text-white "
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            type="email"
                                            {...field}
                                            className="bg-neutral-700 text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            type="password"
                                            {...field}
                                            className="bg-neutral-700 text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* {Avatar Image and CoverImage} */}
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Avatar</FormLabel>
                                        <FormControl>
                                            {typeof window !== "undefined" && (
                                                <FileInput
                                                    field={field}
                                                    label="Cover Image"
                                                    accept="image/*"
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="coverImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Cover Image</FormLabel>
                                        <FormControl>
                                            {typeof window !== "undefined" && (
                                                <FileInput
                                                    field={field}
                                                    label="Avatar"
                                                    accept="image/*"
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
                        >
                            Submit
                        </Button>
                        {/* Already have an account */}
                        <div className="text-center mt-4">Already have an account?
                            <Link href="/Auth/login" className="text-indigo-600">  Login</Link>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/2 mt-6 md:mt-0 flex justify-center items-center">
                <Image
                    src="/SignUp.svg"
                    height={300}
                    width={300}
                    alt="Login Illustration"
                    layout="intrinsic"
                    className="max-w-full h-auto"
                />
            </div>
        </div>
    );
}
