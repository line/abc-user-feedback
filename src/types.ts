export enum Order {
  DESC = 'desc',
  ASC = 'ASC'
}

export enum LoginProvider {
  Google = 'google',
  Line = 'line'
}

interface IUserProfile {
  nickname: string
  avatarUrl: string
}
export interface IRole {
  id?: string
  name: string
  description?: string
  createdTime?: Date
  updatedTime?: Date
}

export interface IUser {
  id: string
  email: string
  profile: IUserProfile
  role?: IRole
  createdTime: Date
  updatedTime: Date
  isVerified: boolean
}

export enum FormFieldType {}

export interface IComment {
  id: string
}

export interface IPost {
  id: string
  number: number
  title: string
  body: string
  voteCounter: number
  createdTime: Date
  updatedTime: Date
  user: IUser
  comments: Array<IComment>
}

export interface IService {
  name: string
  logoUrl: string
  entryPath: string
  isPrivate: boolean
  isRestrictDomain: boolean
  allowDomains: Array<string>
}

export enum FormFieldType {
  Text = 'text',
  TextArea = 'textarea',
  Select = 'select',
  Number = 'number',
  Boolean = 'boolean',
  DateTime = 'datetime'
}

export interface IFeedbackField {
  id: string
  name: string
  description: string
  type: FormFieldType
  isRequired: boolean
  order: number
  option: Array<string>
}

export interface IFeedback {
  id: string
  code: string
  title: string
  description: string
  allowAnonymous: boolean
  fields: Array<IFeedbackField>
}

export enum UserState {
  Active,
  Blocked,
  Left
}

export enum EmailAuthType {
  Register,
  Invitation,
  PasswordChange,
  EmailChange
}

export enum AppMode {
  Modal = 'modal',
  Page = 'page'
}

export interface ClientConfig {
  app: {
    mode: AppMode
    useNickname: boolean
    useDeleteAccount: boolean
  }
  email: {
    enable: boolean
  }
  oauth: {
    [LoginProvider.Google]: {
      enable: boolean
    }
    [LoginProvider.Line]: {
      enable: boolean
    }
  }
}

export enum Locale {
  EN = 'en',
  JP = 'ja',
  KR = 'ko'
}

export enum Permission {
  // owner
  MANAGE_ALL = 'manage.all',

  // user
  READ_USERS = 'read.users',
  DELETE_USER = 'delete.user',
  INVITE_USER = 'invite.user',

  // feedback
  READ_FEEDBACKS = 'read.feedbacks',
  READ_FEEDBACK = 'read.feedback',
  CREATE_FEEDBACK = 'create.feedback',
  UPDATE_FEEDBACK = 'update.feedback',
  DELETE_FEEDBACK = 'delete.feedback',

  EXPORT_RESPONSE = 'export.response',
  DELETE_RESPONSE = 'delete.response',

  // tenant
  MANAGE_TENANT = 'manage.service',
  MANAGE_INVITATION = 'update.invitation',

  // role
  READ_ROLES = 'read.roles',
  MANAGE_ROLE = 'manage.role'
}
