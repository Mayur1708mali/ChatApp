type Credentials = {
	email: string;
	password: string;
};

type UserAccount = Credentials & {
	name: string;
};

type ContextData = {
	user: Models.User<Models.Preferences>;
	handleLogout(): void;
	handleUserLogin(credentials: Credentials): void;
	handleRegister(userAccount: UserAccount): void;
};
