import { get, post, put, del } from '@/utils/request';

/** 登录请求参数（password 为 RSA 加密后的 base64） */
export interface LoginParams {
  username: string;
  password: string;
}

/** 登录返回（对应后端 LoginResponse，token 在 body.token） */
export interface LoginResult {
  token: string;
  userId: number;
  username: string;
  nickname: string;
  /**
   * RBAC 权限插槽：后端暂未返回 role，后续补充后即自动参与 access.ts 权限判断
   */
  role?: string;
}

/**
 * 用户信息（UserDTO）
 * ⚠️ 字段按后端常见约定假定：id/username/nickname/status，
 * 如与实际返回不符，集中修改本接口即可。
 */
export interface UserDTO {
  id: number;
  username: string;
  nickname?: string;
  status?: string;
}

/** 分页查询参数（PageQuery 字段假定：pageNum/pageSize） */
export interface PageParams {
  pageNum: number;
  pageSize: number;
}

/** 分页结果（StandardPage 字段假定：list/total） */
export interface PageResult<T> {
  list: T[];
  total: number;
}

/** 创建用户参数 */
export interface CreateUserParams {
  username: string;
  /** RSA 加密后 base64 */
  password: string;
  nickname?: string;
}

/** 更新用户参数（后端仅支持 nickname/status） */
export interface UpdateUserParams {
  nickname?: string;
  status?: string;
}

/** 获取登录 RSA 公钥（body 即 PEM 字符串） */
export async function getPublicKey(): Promise<string> {
  return get<string>('/user/login/public-key');
}

/** 登录 */
export async function login(params: LoginParams): Promise<LoginResult> {
  return post<LoginResult>('/user/login', params);
}

/** 按 id 查询用户 */
export async function getUserById(id: number): Promise<UserDTO> {
  return get<UserDTO>(`/user/${id}`);
}

/** 分页查询用户 */
export async function pageUsers(params: PageParams): Promise<PageResult<UserDTO>> {
  return get<PageResult<UserDTO>>('/user/page', params);
}

/** 创建用户 */
export async function createUser(params: CreateUserParams): Promise<number> {
  return post<number>('/user', params);
}

/** 更新用户 */
export async function updateUser(id: number, params: UpdateUserParams): Promise<UserDTO> {
  return put<UserDTO>(`/user/${id}`, params);
}

/** 删除用户 */
export async function deleteUser(id: number): Promise<void> {
  return del<void>(`/user/${id}`);
}
