// app/components/mdx.tsx

import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";
import remarkGfm from "remark-gfm";

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function Blockquote({ children }) {
  return (
    <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-700 pl-4 italic text-neutral-700 dark:text-neutral-300 my-6">
      {children}
    </blockquote>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

// Custom table components for better styling
function CustomTable({ children }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
        {children}
      </table>
    </div>
  );
}

function CustomThead({ children }) {
  return (
    <thead className="bg-neutral-50 dark:bg-neutral-900">{children}</thead>
  );
}

function CustomTbody({ children }) {
  return (
    <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
      {children}
    </tbody>
  );
}

function CustomTh({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
      {children}
    </th>
  );
}

function CustomTd({ children }) {
  return (
    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
      {children}
    </td>
  );
}

function CustomTr({ children }) {
  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
      {children}
    </tr>
  );
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  blockquote: Blockquote,
  Table,
  table: CustomTable,
  thead: CustomThead,
  tbody: CustomTbody,
  th: CustomTh,
  td: CustomTd,
  tr: CustomTr,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      }}
    />
  );
}
