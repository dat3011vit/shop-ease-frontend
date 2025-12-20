export interface IUser {
    id: string;
    full_name: string;
    avt?: string;
    email?: string;
    phone?: string;
}
export interface IAccount {
    id?: string;
    username: string;
    email: string;
    role:{
        name:ERole
    },
    user:{
        id: string,
        full_name: string,
        phone: string,
        avt: string,
        account_id: string,
        created_at: string,
        updated_at: string,
        _active: false
    }|null
}
export enum ERole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'USER',
}
