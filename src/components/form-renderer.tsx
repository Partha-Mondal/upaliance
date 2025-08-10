'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from './ui/use-toast';

interface FormRendererProps {
  formConfig: FormConfig;
  isPreview?: boolean;
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
          zodField = z.boolean().default(false);
          break;
        case 'dropdown':
          zodField = z.string();
          break;
        default:
          zodField = z.string();
      }

      if (field.validations.required) {
        if (field.type === 'checkbox') {
          zodField = (zodField as z.ZodBoolean).refine(val => val === true, {
            message: `${field.label} is required.`,
          });
        } else if (field.type === 'text' || field.type === 'email' || field.type === 'dropdown') {
            zodField = (zodField as z.ZodString).min(1, { message: `${field.label} is required.` });
        }
      }
      
      if (!field.validations.required && field.type !== 'checkbox') {
          zodField = zodField.optional();
      }


      schemaFields[field.id] = zodField;
    });
    return z.object(schemaFields);
  };

  const formSchema = generateSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formConfig.fields.reduce((acc, field) => {
        acc[field.id] = field.type === 'checkbox' ? false : '';
        return acc;
    }, {} as any)
  });

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
        {formConfig.fields.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: rhfField }) => (
              <FormItem>
                {field.type !== 'checkbox' && <FormLabel>{field.label}</FormLabel>}
                <FormControl>
                  <>
                    {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...rhfField}
                        disabled={isPreview}
                        value={rhfField.value ?? ""}
                      />
                    ) : field.type === 'dropdown' ? (
                      <Select onValueChange={rhfField.onChange} defaultValue={rhfField.value} disabled={isPreview}>
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
                    ) : field.type === 'checkbox' ? (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={rhfField.value}
                                    onCheckedChange={rhfField.onChange}
                                    disabled={isPreview}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>{field.label}</FormLabel>
                            </div>
                      </FormItem>
                    ) : null}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {!isPreview && (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
