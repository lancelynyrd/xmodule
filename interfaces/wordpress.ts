

export interface UserLogin {
  user_login: string;
  user_pass: string;
}
export let userLogin: UserLogin = { user_login: '', user_pass: '' };

export interface UserData {
    code?: string,
    session_id?: string,
    user_login?: string,
    user_nicename?: string
}
export interface UserResponse {
  success: boolean,
  data: UserData
}
export interface LoginResponse {
  success: boolean,
  data: UserData
}
export interface RegisterResponse {
  success: boolean,
  data: UserData
}


export type Gender = '' | 'M' | 'F';
export interface UserRegisterData {
    user_login: string;
    user_pass: string;
    user_email: string;
    name: string;
    mobile: string;
    gender: Gender;
    birthday: string;
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


export interface LoginError {
  success: boolean;
  data: 'wrong-password' | 'wrong-id';
}



/**
 * Category schema
 * @refer http://v2.wp-api.org/reference/categories/
 */
export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}


/**
 * Category schema array
 */
export type Categories = Array<Category>;


/**
 * Category list query arguments.
 * @refer http://v2.wp-api.org/reference/categories/
 */
export interface CategoryQueryArgument {
  include?: string;
  search?: string;
  parent?: number;
  slug?: string;
}

/**
 * 
 * post list query argument.
 * @refer http://v2.wp-api.org/reference/posts/
 */
export interface PostQuery {
  xapi: string;
  category: string;
  paged: number;
  per_page?: number;
}

export let postQuery: PostQuery = {
  xapi : 'post.page',
  category : 'housemaid',
  paged: 1,
  per_page : 20
}

export interface Post {
  date: string;
  guid: string;
  id: number;
  link: string;
  modified: string;
  password: string;
  slug: string;
  title: string;
  content: string;
  author: number;
  excerpt: string;
  images: Array<string>;
  urlPrimaryPhoto?: string;
  comments: Array<{comment_title:string}>;
  meta: {
    first_name: Array<string>,
    last_name: Array<string>,
    middle_name: Array<string>,
    mobile: Array<string>,
    password: Array<string>,
    address: Array<string>,
    gender: Array<string>,
    birthday: Array<string>
  }
}
export type Posts = Array<Post>;


export interface PostEdit {
  category: number | string;
  first_name: string;
  last_name: string;
  middle_name: string;
  address: string;
  password: string;
  mobile: string;
  birthday: string;
  gender: string;
  title: string;
  content: string;
  file_id?: number;
}


export interface FileUpload {
  id: number;
  url: string;
  type: string;
}
