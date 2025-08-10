export type FieldType = "text" | "email" | "number" | "dropdown" | "checkbox";

export interface FormFieldValidation {
  required?: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  validations: FormFieldValidation;
}

export interface FormConfig {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  fields: FormField[];
}
