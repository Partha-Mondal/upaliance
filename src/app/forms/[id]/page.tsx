'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForms } from '@/hooks/use-forms';
import { FormConfig, FormField, FieldType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PlusCircle, Save, GripVertical } from 'lucide-react';
import { FormRenderer } from '@/components/form-renderer';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const initialForm: Omit<FormConfig, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Untitled Form',
  fields: [],
};

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { getForm, addForm, updateForm } = useForms();
  const { toast } = useToast();
  const formId = params.id as string;
  const isNewForm = formId === 'new';

  const [form, setForm] = useState<FormConfig | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isNewForm) {
      setForm({
        ...initialForm,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      const existingForm = getForm(formId);
      if (existingForm) {
        setForm(existingForm);
      } else {
        router.push('/');
      }
    }
    setIsMounted(true);
  }, [formId, getForm, isNewForm, router]);

  const updateFormField = (fieldId: string, newField: Partial<FormField>) => {
    if (!form) return;
    const updatedFields = form.fields.map((f) => (f.id === fieldId ? { ...f, ...newField } : f));
    setForm({ ...form, fields: updatedFields, updatedAt: new Date().toISOString() });
  };

  const addField = (type: FieldType) => {
    if (!form) return;
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type} field`,
      validations: {},
      ...( (type === 'dropdown' || type === 'radio') && { options: ['Option 1'] }),
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const removeField = (fieldId: string) => {
    if (!form) return;
    setForm({ ...form, fields: form.fields.filter((f) => f.id !== fieldId) });
  };

  const addOption = (fieldId: string) => {
    if (!form) return;
    const field = form.fields.find(f => f.id === fieldId);
    if(field && (field.type === 'dropdown' || field.type === 'radio')) {
      const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
      updateFormField(fieldId, { options: newOptions });
    }
  }

  const removeOption = (fieldId: string, optionIndex: number) => {
    if (!form) return;
    const field = form.fields.find(f => f.id === fieldId);
    if(field && (field.type === 'dropdown' || field.type === 'radio') && field.options) {
      const newOptions = field.options.filter((_, i) => i !== optionIndex);
      updateFormField(fieldId, { options: newOptions });
    }
  }

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    if (!form) return;
    const field = form.fields.find(f => f.id === fieldId);
    if(field && (field.type === 'dropdown' || field.type === 'radio') && field.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateFormField(fieldId, { options: newOptions });
    }
  }

  const handleSave = () => {
    if (!form) return;
    const formToSave = { ...form, updatedAt: new Date().toISOString() };
    if (isNewForm) {
      addForm(formToSave);
    } else {
      updateForm(formToSave);
    }
    toast({
      title: 'Form Saved!',
      description: `"${form.name}" has been saved successfully.`,
    });
    router.push('/');
  };

  if (!isMounted || !form) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex-1 bg-muted/40">
      <div className="container mx-auto max-w-7xl py-4 sm:py-6 lg:py-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Form Builder</h1>
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Form
            </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="form-name" className="text-lg font-medium">Form Name</Label>
                <Input
                  id="form-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 text-xl"
                />
              </CardContent>
            </Card>

            {form.fields.map((field) => (
              <Card key={field.id}>
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/50">
                   <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <p className="font-semibold">{field.label || 'New Field'}</p>
                   </div>
                  <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor={`label-${field.id}`}>Label</Label>
                    <Input id={`label-${field.id}`} value={field.label} onChange={(e) => updateFormField(field.id, { label: e.target.value })} />
                  </div>
                  { (field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'textarea' || field.type === 'password') &&
                    <div>
                        <Label htmlFor={`defaultValue-${field.id}`}>Default Value</Label>
                        <Input id={`defaultValue-${field.id}`} value={field.defaultValue as string || ''} onChange={(e) => updateFormField(field.id, { defaultValue: e.target.value })} />
                    </div>
                  }
                  <div>
                    <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
                    <Input id={`placeholder-${field.id}`} value={field.placeholder || ''} onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })} />
                  </div>
                  
                  {(field.type === 'dropdown' || field.type === 'radio') && (
                    <div className="space-y-2">
                        <Label>{field.type === 'dropdown' ? 'Dropdown' : 'Radio'} Options</Label>
                        {field.options?.map((opt, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input value={opt} onChange={(e) => updateOption(field.id, index, e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeOption(field.id, index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addOption(field.id)}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Option
                        </Button>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Validations</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`required-${field.id}`} checked={!!field.validations.required} onCheckedChange={(checked) => updateFormField(field.id, { validations: { ...field.validations, required: !!checked } })} />
                      <Label htmlFor={`required-${field.id}`}>Required / Not empty</Label>
                    </div>
                    {(field.type === 'text' || field.type === 'textarea' || field.type === 'password') && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`min-${field.id}`}>Min Length</Label>
                                <Input id={`min-${field.id}`} type="number" value={field.validations.minLength || ''} onChange={(e) => updateFormField(field.id, { validations: { ...field.validations, minLength: e.target.value ? parseInt(e.target.value) : undefined } })} />
                            </div>
                             <div>
                                <Label htmlFor={`max-${field.id}`}>Max Length</Label>
                                <Input id={`max-${field.id}`} type="number" value={field.validations.maxLength || ''} onChange={(e) => updateFormField(field.id, { validations: { ...field.validations, maxLength: e.target.value ? parseInt(e.target.value) : undefined } })} />
                            </div>
                          </div>
                          {field.type === 'password' && (
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                id={`password-rule-${field.id}`} 
                                checked={field.validations.pattern === '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'}
                                onCheckedChange={(checked) => updateFormField(field.id, { validations: { ...field.validations, pattern: checked ? '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$' : undefined } })} />
                                <Label htmlFor={`password-rule-${field.id}`}>Minimum 8 characters, must contain a number</Label>
                            </div>
                          )}
                        </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
                <CardContent className="p-6">
                    <Select onValueChange={(value: FieldType) => addField(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add new field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Input</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="password">Password</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="radio">Radio Group</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="date">Date Picker</SelectItem>
                      </SelectContent>
                    </Select>
                </CardContent>
            </Card>
          </div>

          <div className="lg:sticky top-24 self-start">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
                <CardDescription>This is how your form will look to users.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormRenderer formConfig={form} isPreview={true} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
