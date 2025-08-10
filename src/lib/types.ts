export type FieldType = "text" | "email" | "number" | "dropdown" | "checkbox" | "textarea" | "radio" | "date" | "password";

export interface FormFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // For things like password rules
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  validations: FormFieldValidation;
  defaultValue?: string | number | boolean;
}

export interface FormConfig {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  fields: FormField[];
}
