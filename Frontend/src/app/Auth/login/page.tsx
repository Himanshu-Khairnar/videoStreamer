'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/Components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { Sigin } from '@/Actions/user.ation';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters.' }),
});

export default function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { email, password } = values;
      const res = await Sigin({ email, password });
      console.log('Login successful:', res);
    } catch (err: any) {
      console.error('Login failed:', err.message || err);
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-neutral-900 p-6">
      <div className="w-full md:w-1/2 bg-neutral-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Login Form
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
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
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
            >
              Submit
            </Button>
            <div className="text-center mt-4">
              Don't have an account?{' '}
              <Link href="/Auth/register" className="text-indigo-600">
                Register
              </Link>
            </div>
          </form>
        </Form>
      </div>
      {/* Image Section */}
      <div className="w-full md:w-1/2 mt-6 hidden md:flex justify-center items-center">
        <Image
          src="/Login.svg"
          height={300}
          width={300}
          alt="Login Illustration"
          className="max-w-full h-auto"
          priority // Prevents potential hydration errors
        />
      </div>
    </div>
  );
}
