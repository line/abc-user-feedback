import { FeedbackField } from '#/core/entity'

export enum LoginProvider {
  Google = 'google',
  Line = 'line'
}

interface IUserProfile {
  nickname: string
  avatarUrl: string
}

export interface IUser {
  id: string
  email: string
  profile: IUserProfile
  role: number
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

export enum UserRole {
  User,
  Admin,
  Owner = 2
}

export enum EmailAuthType {
  Register,
  Invitation,
  PasswordChange,
  EmailChange
}

export interface ClientConfig {
  auth: {
    useBasicAuth: boolean
    redirectToLoginPage: boolean
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
