import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePlus2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-24 w-24">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-primary opacity-50" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.17 16.83a1.5 1.5 0 0 1-2.34-2l1.76-2.67a.5.5 0 0 1 .82.54L8 15.33l1.17 1.5zm3.66-3.66a.5.5 0 0 1 .82.54l-1.42 2.67a1.5 1.5 0 0 1-2.34-2l1.77-2.67zM16 12h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2z"/></svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">No forms yet</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Get started by creating your first dynamic form.
        </p>
        <Button asChild className="mt-6">
          <Link href="/forms/new">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create your first form
          </Link>
        </Button>
      </div>
    </div>
  );
}
