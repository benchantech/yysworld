'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx, HandNote, MonoLabel, Pill } from './Primitives';

export function SiteHeader() {
  const pathname = usePathname();
  const navLinks: [string, string][] = [
    ['today', '/today'],
    ['compare', '/compare'],
    ['meet yy', '/yy/about'],
    ['archive', '/archive'],
    ['lab', '/lab'],
  ];
  return (
    <header className="yy-siteHeader">
      <div className="yy-siteHeader__inner">
        <Link className="yy-brand" href="/">
          <span className="yy-brand__mark" /> yysworld
        </Link>
        <nav className="yy-nav" aria-label="Primary">
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PageShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return <main className={cx('yy-pageShell', wide && 'yy-pageShell--wide')}>{children}</main>;
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  note,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  note?: string;
}) {
  return (
    <section className="yy-pageHeader">
      {eyebrow ? <MonoLabel>{eyebrow}</MonoLabel> : null}
      <h1 className="yy-title">{title}</h1>
      {lede ? <p className="yy-lede">{lede}</p> : null}
      {note ? <HandNote>{note}</HandNote> : null}
    </section>
  );
}

export function EventAnchor({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <section className="yy-eventAnchor">
      <div className="yy-eventAnchor__meta">
        <span>world event</span>
        <span>{date}</span>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

export function SplitPanel({
  left,
  right,
  className,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cx('yy-splitPanel', className)}>
      <div>{left}</div>
      <div>{right}</div>
    </section>
  );
}

export function PathStateRow({
  items,
}: {
  items: Array<{ label: string; value: number; tone?: 'up' | 'down' | 'neutral' }>;
}) {
  return (
    <div className="yy-stateRow">
      {items.map((item) => (
        <span
          key={item.label}
          className={cx(item.tone === 'up' && 'is-up', item.tone === 'down' && 'is-down')}
        >
          <b>{item.label}</b> {item.value}
        </span>
      ))}
    </div>
  );
}

export function BranchTree({
  root,
  branches,
}: {
  root: string;
  branches: Array<{ label: string; note?: string; active?: boolean }>;
}) {
  return (
    <section className="yy-branchTree">
      <MonoLabel>branch map</MonoLabel>
      <div className="yy-branchTree__root">{root}</div>
      <ul>
        {branches.map((branch) => (
          <li key={branch.label} className={branch.active ? 'is-active' : undefined}>
            <span className="yy-branchTree__line" aria-hidden="true" />
            <div>
              <div className="yy-branchTree__label">
                {branch.label} {branch.active ? <Pill>current</Pill> : null}
              </div>
              {branch.note ? <p>{branch.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
