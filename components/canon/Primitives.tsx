import React from 'react';
import Link from 'next/link';

type Classy = { className?: string; children?: React.ReactNode };

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function MonoLabel({ className, children }: Classy) {
  return <div className={cx('yy-monoLabel', className)}>{children}</div>;
}

export function HandNote({ className, children }: Classy) {
  return <div className={cx('yy-handNote', className)}>{children}</div>;
}

export function Pill({ className, children }: Classy) {
  return <span className={cx('yy-pill', className)}>{children}</span>;
}

export function CanonButton({
  className,
  variant = 'secondary',
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
}) {
  return (
    <button className={cx('yy-button', `yy-button--${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  className,
  variant = 'secondary',
  children,
  href,
}: {
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <Link className={cx('yy-button', `yy-button--${variant}`, className)} href={href}>
      {children}
    </Link>
  );
}

export function SectionRule({ className }: { className?: string }) {
  return <hr className={cx('yy-rule', className)} />;
}

export function NotebookCard({ className, children }: Classy) {
  return <section className={cx('yy-notebookCard', className)}>{children}</section>;
}
