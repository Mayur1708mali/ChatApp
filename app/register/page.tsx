'use client';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
	name: z.string().max(50),
	email: z
		.string()
		.min(2, { message: 'Username must be at least 2 characters.' })
		.max(50),
	password1: z
		.string()
		.min(8, { message: 'password must be at least 8 characters.' })
		.max(50),
	password2: z
		.string()
		.min(8, { message: 'password must be at least 8 characters.' })
		.max(50),
});

export default function RegisterPage() {
	const { handleRegister } = useAuth() as ContextData;
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password1: '',
			password2: '',
		},
	});

	function handleSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

		if (values.password1 !== values.password2) {
			alert('Password does not match!');
			return;
		}

		const data: UserAccount = {
			name: values.name,
			email: values.email,
			password: values.password2,
		};

		handleRegister(data);
	}

	return (
		<main className='w-[100vw] h-[100vh] flex flex-col gap-5 justify-center items-center'>
			<h1 className='text-3xl'>Register Page</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='space-y-8 flex min-w-[25%] flex-col justify-center border-4 p-5'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder='Name' {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										placeholder='Email'
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password1'
						render={({ field }) => (
							<FormItem>
								<FormLabel>password</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='password'
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password2'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='Confirm password'
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
			<p>
				Already have an account?{' '}
				<Link className='text-primary' href='/login'>
					Login here.
				</Link>
			</p>
		</main>
	);
}
