"use client";

import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, type ReactElement, type ReactNode } from "react";
import { Link, useMatches } from "react-router-dom";

type HandleType = {
  crumb: (data?: unknown) => ReactNode;
};

const getNodeText = (node: ReactNode): ReactNode | string => {
  if (["string", "number"].includes(typeof node)) return node;
  if (node instanceof Array) return node.map(getNodeText).join("");
  if (typeof node === "object" && node)
    return getNodeText(
      (
        node as ReactElement<{
          children: ReactNode;
        }>
      ).props.children,
    );
};

export default function Breadcrumb() {
  const matches = useMatches();
  const crumbs = matches
    .filter((match) => Boolean((match.handle as HandleType)?.crumb))
    .map((match) => (match.handle as HandleType)?.crumb(match.data));

  return (
    <BreadcrumbRoot className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">FRS</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb, index) => {
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              {index + 1 === crumbs.length ? (
                <BreadcrumbItem>{getNodeText(crumb)}</BreadcrumbItem>
              ) : (
                <BreadcrumbItem>{crumb}</BreadcrumbItem>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}
