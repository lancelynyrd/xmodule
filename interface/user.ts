type Gender = '' | 'M' | 'F';
export interface UserRegisterData {
    user_login: string;
    user_pass: string;
    user_email: string;
    name: string;
    mobile: string;
    gender: Gender;
    birthday;
}
export let userRegisterData: UserRegisterData = {
    user_login: '',
    user_pass: '',
    user_email: '',
    name: '',
    mobile: '',
    gender: '',
    birthday: ''
};