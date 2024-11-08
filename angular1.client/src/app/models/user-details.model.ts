export interface UserDetails {
    userId: number;
    providerUserId: string;
    provider: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    createdDate: Date;
    initials: string
}