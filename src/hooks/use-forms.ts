'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FormConfig } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'formforge-forms';

export function useForms() {
  const [forms, setForms] = useState<FormConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedForms = window.localStorage.getItem(STORAGE_KEY);
      if (storedForms) {
        setForms(JSON.parse(storedForms));
      }
    } catch (error) {
      console.error('Failed to load forms from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load forms from your browser storage.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveForms = useCallback((updatedForms: FormConfig[]) => {
    try {
      setForms(updatedForms);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
    } catch (error) {
      console.error('Failed to save forms to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save forms to your browser storage.',
      });
    }
  }, [toast]);

  const addForm = useCallback((newForm: FormConfig) => {
    const updatedForms = [...forms, newForm];
    saveForms(updatedForms);
  }, [forms, saveForms]);

  const getForm = useCallback((id: string): FormConfig | undefined => {
    return forms.find((form) => form.id === id);
  }, [forms]);

  const updateForm = useCallback((updatedForm: FormConfig) => {
    const updatedForms = forms.map((form) => (form.id === updatedForm.id ? updatedForm : form));
    saveForms(updatedForms);
  }, [forms, saveForms]);

  const deleteForm = useCallback((id: string) => {
    const updatedForms = forms.filter((form) => form.id !== id);
    saveForms(updatedForms);
    toast({
        title: 'Form Deleted',
        description: 'The form has been successfully deleted.',
    });
  }, [forms, saveForms, toast]);

  return { forms, loading, addForm, getForm, updateForm, deleteForm };
}
