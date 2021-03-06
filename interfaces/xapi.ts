
export interface Response {
  success: boolean;
  data?: any;
}

export interface UserLogin {
  user_login: string;
  user_pass: string;
}
export let userLogin: UserLogin = { user_login: '', user_pass: '' };

export interface UserLoginData {
    code?: string,
    session_id?: string,
    user_login?: string,
    user_nicename?: string
}
export interface UserResponse {
  success: boolean,
  data: UserLoginData
}
export interface LoginResponse {
  success: boolean,
  data: UserLoginData
}
export interface RegisterResponse {
  success: boolean,
  data: UserLoginData
}

export interface UserData {
    ID: number,
    session_id: number,
    user_login: string,
    user_nicename: string
    user_email: string;
    user_registered: string;
    meta: {
      birthday: string;
      first_name: string;
      last_name: string;
      mobile: string;
      name: string;
      nickname: string;     
      gender: Gender;
    }
}

export interface ResignResponse {
  success: boolean;
  data?: string;
}

export type Gender = '' | 'M' | 'F';
/**
 * session_id 는 사용자 업데이트를 할 때 필요하다.
 */
export interface UserRegisterData {
    session_id?: number;
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
  cat_ID: number;
  cat_name: string;
  category_count: number;
  category_description: string;
  category_nicename: string;
  category_parent: number;
  slug: string;
}

export interface CategoryResponse {
  success: boolean;
  data: string | Array<Category>;
}


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
  category_name: string;
  paged: number;
  per_page?: number;
}

export let postQuery: PostQuery = {
  category_name : '',
  paged: 1,
  per_page : 20
}

export interface Post {
  ID: number;
  post_date: string;
  post_title: string;
  post_content: string;
  post_author: number;
  post_parent: number;
  guid: string;
  images: Array<string>;
  comments: Array<{comment_title:string}>;
  meta?: any;
}
export type Posts = Array<Post>;

export interface PostQueryResponse {
  success: boolean;
  data: Posts;
}


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


export interface UserPassword {
  session_id: string;
  old_password: string;
  new_password: string;
}


export interface FileUploadResponse {
  success: boolean;
  item: any;
  response: any;
  status: any;
  headers: any;
}