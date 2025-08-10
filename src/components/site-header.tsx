import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold">Upliance.ai</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className={cn('transition-colors hover:text-foreground/80 text-foreground/60')}
            >
              My Forms
            </Link>
            <Link
              href="/decision-support"
              className={cn('transition-colors hover:text-foreground/80 text-foreground/60')}
            >
              AI Cooking Assistant
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
