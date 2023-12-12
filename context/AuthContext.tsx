'use client';

import { account } from '@/appwriteConfig';
import { Account, ID, Models } from 'appwrite';
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<ContextData | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter();

	const [loading, setLoading] = useState<Boolean>(false);
	const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
		null
	);

	useEffect(() => {
		getUserOnLoad();
	}, []);

	const getUserOnLoad = async () => {
		try {
			const accountDetails = await account.get();
			setUser(accountDetails);

			const token = await account.createJWT();
			setCookie('token', token.jwt);
		} catch (error: any) {
			console.log(error.message);
		}
		setLoading(false);
	};

	const handleUserLogin = async (credentials: Credentials) => {
		console.log(credentials);

		try {
			await account.createEmailSession(
				credentials.email,
				credentials.password
			);

			const accountDetails = await account.get();
			setUser(accountDetails);

			const token = await account.createJWT();
			setCookie('token', token.jwt);
			router.push('/');
		} catch (error: any) {
			console.log(error);
		}
	};

	const handleRegister = async (userAccount: UserAccount) => {
		await account.create(
			ID.unique(),
			userAccount.email,
			userAccount.password,
			userAccount.name
		);

		await account.createEmailSession(
			userAccount.email,
			userAccount.password
		);

		const accountDetails = await account.get();
		setUser(accountDetails);

		const token = await account.createJWT();
		setCookie('token', token.jwt);
		router.push('/');
	};

	const handleLogout = async () => {
		await account.deleteSession('current');
		setUser(null);
		deleteCookie('token');

		router.push('/login');
	};

	const contextData: ContextData = {
		user,
		handleUserLogin,
		handleLogout,
		handleRegister,
	};

	return (
		<AuthContext.Provider value={contextData}>
			{loading ? <p>Loading...</p> : children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthContext;
