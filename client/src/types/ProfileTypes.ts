import { FiGithub } from "react-icons/fi";
import { CSSProperties } from "react";

export type FieldType = { 
  [key: string]: string
}

export type SocialInputType = {
  icon: typeof FiGithub,
  title: string,
  name: string,
  value: string,
  disabled: boolean,
  color?: string,
  style?: CSSProperties,
  editField: (fieldType: string, fieldname: string, value: string) => void,
}

export type AboutInputType = {
  title: string,
  name: string,
  value: string,
  disabled: boolean,
  editField: (fieldType: string, fieldname: string, value: string) => void,
}

export type PasswordInputType = {
  title: string,
  name: string,
  value: string,
  isFieldVisible?: boolean,
  fieldType: string,
  showPassword: (fieldname: string, isFieldVisible: boolean) => void,
  editField: (fieldType: string, fieldname: string, value: string) => void,
}