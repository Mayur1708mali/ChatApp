'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
	const { user, handleLogout } = useAuth() as ContextData;

	const [account, setAccount] = useState({
		email: '',
		name: '',
	});

	useEffect(() => {
		if (user) {
			setAccount(user);
		}
	}, [user]);

	return (
		<>
			<div className='py-2 px-4 mb-2 border-b-4 text-xl flex justify-between'>
				<h1>Welcome! {account.name}</h1>
				<LogOut onClick={handleLogout} />
			</div>
		</>
	);
}
