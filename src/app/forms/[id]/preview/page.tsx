'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForms } from '@/hooks/use-forms';
import type { FormConfig } from '@/lib/types';
import { FormRenderer } from '@/components/form-renderer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FormPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { getForm } = useForms();
  const [form, setForm] = useState<FormConfig | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const formId = params.id as string;

  useEffect(() => {
    const existingForm = getForm(formId);
    if (existingForm) {
      setForm(existingForm);
    } else if (isMounted) {
      router.push('/');
    }
    
    setIsMounted(true);
  }, [formId, getForm, router, isMounted]);

  if (!form) {
    return <div className="flex h-screen items-center justify-center">Loading form preview...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl">{form.name}</CardTitle>
          <CardDescription>Please fill out the form below. This is a preview and data will not be saved.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormRenderer formConfig={form} />
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/">Back to My Forms</Link>
        </Button>
      </div>
    </div>
  );
}
