'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormConfig, FormField } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField as RhfFormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useEffect } from 'react';

interface FormRendererProps {
  formConfig: FormConfig;
  isPreview?: boolean;
}

const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function FormRenderer({ formConfig, isPreview = false }: FormRendererProps) {
  const { toast } = useToast();

  const generateSchema = () => {
    const schemaFields: { [key: string]: z.ZodType<any, any> } = {};
    formConfig.fields.forEach((field) => {
      let zodField: z.ZodType<any, any>;

      switch (field.type) {
        case 'email':
          zodField = z.string().email({ message: 'Invalid email address.' });
          break;
        case 'number':
          zodField = z.coerce.number();
          break;
        case 'checkbox':
          zodField = z.boolean().default(!!field.defaultValue);
          break;
        case 'date':
            zodField = z.date();
            break;
        case 'dropdown':
        case 'radio':
          zodField = z.string();
          break;
        case 'password':
        case 'textarea':
        case 'text':
          zodField = z.string();
          if (field.validations.minLength) {
            zodField = zodField.min(field.validations.minLength, {message: `${field.label} must be at least ${field.validations.minLength} characters.`});
          }
          if (field.validations.maxLength) {
            zodField = zodField.max(field.validations.maxLength, {message: `${field.label} must be at most ${field.validations.maxLength} characters.`});
          }
          if (field.validations.pattern) {
              zodField = zodField.regex(new RegExp(field.validations.pattern), {
                  message: `Invalid ${field.label}`
              });
          }
          break;
        default:
          zodField = z.string();
      }

      if (field.validations.required && !field.isDerived) {
        if (field.type === 'checkbox') {
          zodField = (zodField as z.ZodBoolean).refine(val => val === true, {
            message: `${field.label} is required.`,
          });
        } else if (zodField instanceof z.ZodString) {
            zodField = zodField.min(1, { message: `${field.label} is required.` });
        } else if (zodField instanceof z.ZodNumber) {
            zodField = zodField.refine(val => val !== undefined && val !== null, `${field.label} is required.`)
        } else if (zodField instanceof z.ZodDate) {
            zodField = zodField.refine(val => val !== undefined && val !== null, `${field.label} is required.`)
        }
      }
      
      if (!field.validations.required && field.type !== 'checkbox' && !field.isDerived) {
          zodField = zodField.optional().nullable();
      }

      if (field.isDerived) {
          zodField = zodField.optional().nullable();
      }


      schemaFields[field.id] = zodField;
    });
    return z.object(schemaFields);
  };

  const formSchema = generateSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formConfig.fields.reduce((acc, field) => {
        if (!field.isDerived) {
            acc[field.id] = field.defaultValue ?? (field.type === 'checkbox' ? false : undefined);
        }
        return acc;
    }, {} as any),
    mode: 'onChange',
  });

  const watchedFields = useWatch({ control: form.control });

  useEffect(() => {
    formConfig.fields.forEach(field => {
        if (field.isDerived && field.derivation) {
            const { parentFieldIds, formula } = field.derivation;
            if (formula === 'age' && parentFieldIds.length > 0) {
                const parentId = parentFieldIds[0];
                const parentValue = watchedFields[parentId];
                if (parentValue instanceof Date) {
                    const age = calculateAge(parentValue);
                    if (form.getValues(field.id) !== age) {
                       form.setValue(field.id, age, { shouldValidate: true });
                    }
                } else {
                    if (form.getValues(field.id) !== undefined) {
                      form.setValue(field.id, undefined, { shouldValidate: true });
                    }
                }
            }
        }
    });
  }, [watchedFields, formConfig.fields, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Form Submitted!',
      description: 'Your responses have been recorded (in the console).',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formConfig.fields.map((field) => {
            const isDerivedAndDisabled = isPreview || field.isDerived;
            return (
                <RhfFormField
                    key={field.id}
                    control={form.control}
                    name={field.id}
                    render={({ field: rhfField }) => (
                    <FormItem>
                        {field.type !== 'checkbox' && <FormLabel>{field.label}</FormLabel>}
                        <FormControl>
                        <>
                            {field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'password' ? (
                            <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                {...rhfField}
                                disabled={isDerivedAndDisabled}
                                value={rhfField.value ?? ""}
                                readOnly={field.isDerived}
                            />
                            ) : field.type === 'textarea' ? (
                                <Textarea
                                placeholder={field.placeholder}
                                {...rhfField}
                                disabled={isDerivedAndDisabled}
                                value={rhfField.value ?? ""}
                                />
                            ) : field.type === 'dropdown' ? (
                            <Select onValueChange={rhfField.onChange} defaultValue={rhfField.value} disabled={isDerivedAndDisabled}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder || 'Select an option'} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                    {option}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            ) : field.type === 'radio' ? (
                            <RadioGroup
                                onValueChange={rhfField.onChange}
                                defaultValue={rhfField.value}
                                className="flex flex-col space-y-1"
                                disabled={isDerivedAndDisabled}
                            >
                                {field.options?.map(option => (
                                <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value={option} />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                                ))}
                            </RadioGroup>
                            ) : field.type === 'checkbox' ? (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={rhfField.value}
                                            onCheckedChange={rhfField.onChange}
                                            disabled={isDerivedAndDisabled}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>{field.label}</FormLabel>
                                    </div>
                            </FormItem>
                            ) : field.type === 'date' ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !rhfField.value && "text-muted-foreground"
                                    )}
                                    disabled={isDerivedAndDisabled}
                                    >
                                    {rhfField.value ? (
                                        format(rhfField.value, "PPP")
                                    ) : (
                                        <span>{field.placeholder || 'Pick a date'}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={rhfField.value}
                                    onSelect={rhfField.onChange}
                                    disabled={(date) => isPreview || date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            ) : null}
                        </>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )
        })}
        {!isPreview && (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
