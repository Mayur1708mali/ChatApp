'use client';

import client, { database } from '@/appwriteConfig';
import Header from '@/components/ui/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import {
	ID,
	Models,
	Permission,
	Query,
	RealtimeResponseEvent,
	Role,
} from 'appwrite';
import { Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID as string;

const channel = 'databases.*.collections.*.documents.*';

export default function Home() {
	const { user } = useAuth() as ContextData;

	const [messages, setMessages] = useState<Models.Document[]>([]);
	const [msg, setMsg] = useState('');

	useEffect(() => {
		getMessages();

		const unsubscribe = client.subscribe(
			`databases.${databaseId}.collections.${collectionId}.documents`,
			(response: RealtimeResponseEvent<Models.Document>) => {
				if (response.events.includes(`${channel}.create`)) {
					setMessages((prevState) => [
						response.payload,
						...prevState,
					]);
				}

				if (response.events.includes(`${channel}.delete`)) {
					setMessages((prevState) =>
						prevState.filter(
							(msg) => msg.$id !== response.payload.$id
						)
					);
				}
			}
		);

		return () => unsubscribe();
	}, []);

	async function getMessages() {
		const res = await database.listDocuments(databaseId, collectionId, [
			Query.orderDesc('$createdAt'),
		]);

		setMessages(res.documents);
	}

	const deleteMessage = async (msg_id: string) => {
		const response = await database.deleteDocument(
			databaseId,
			collectionId,
			msg_id
		);
	};

	const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const payload = {
			user_id: user.$id,
			username: user.name,
			message: msg,
		};

		const permission = [Permission.write(Role.user(user.$id))];

		const response = await database.createDocument(
			databaseId,
			collectionId,
			ID.unique(),
			payload,
			permission
		);

		setMsg('');
	};

	return (
		<main className='h-[100vh] max-w-2xl mx-auto py-5 px-5'>
			<Header />
			<div className=' h-full p-8 bg-secondary rounded-md flex flex-col justify-start'>
				<form
					onSubmit={handleSubmit}
					className='mb-5 flex flex-col gap-2'>
					<div>
						<Textarea
							required
							onChange={(e) => setMsg(e.target.value)}
							value={msg}
							maxLength={1000}
							placeholder='say something...'
						/>
					</div>
					<div className='flex justify-end'>
						<Button type='submit'>Submit</Button>
					</div>
				</form>
				<ScrollArea>
					<div className='flex flex-col gap-5'>
						{messages.map((msg) => (
							<div
								className={`${
									!msg.$permissions.includes(
										`delete(\"user:${user?.$id}\")`
									)
										? 'flex flex-col items-end justify-end'
										: null
								}`}
								key={msg.$id}>
								<div className='flex justify-between pr-3'>
									<p className='flex gap-2 items-center'>
										<div className='text-primary'>
											{msg?.username ? (
												<span>{msg.username}</span>
											) : (
												<span>Unknown user </span>
											)}
										</div>

										<small>
											{new Date(
												msg.$createdAt
											).toLocaleString()}
										</small>
									</p>

									{msg.$permissions.includes(
										`delete(\"user:${user?.$id}\")`
									) ? (
										<Trash2
											onClick={() =>
												deleteMessage(msg.$id)
											}
										/>
									) : null}
								</div>
								<Badge
									variant={`${
										msg.$permissions.includes(
											`delete(\"user:${user?.$id}\")`
										)
											? 'outline'
											: 'default'
									}`}
									className='h-10 text-base border-2 border-primary rounded-2xl'>
									{msg.message}
								</Badge>
							</div>
						))}
					</div>
				</ScrollArea>
			</div>
		</main>
	);
}
