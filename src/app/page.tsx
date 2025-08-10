'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForms } from '@/hooks/use-forms';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { format } from 'date-fns';
import { FilePlus2, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { forms, loading, deleteForm } = useForms();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteForm(id);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (forms.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
        <Button asChild>
          <Link href="/forms/new">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create New Form
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card key={form.id} className="flex flex-col justify-between shadow-md transition-shadow hover:shadow-xl">
            <CardHeader>
              <CardTitle className="truncate">{form.name}</CardTitle>
              <CardDescription>
                Created: {format(new Date(form.createdAt), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(form.updatedAt), 'PPP')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{form.fields.length} field(s)</p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/forms/${form.id}/preview`)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => router.push(`/forms/${form.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setDeletingId(form.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  {deletingId === form.id && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your form
                          "{form.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(form.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
