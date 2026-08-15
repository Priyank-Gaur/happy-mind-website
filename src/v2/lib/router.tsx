import { Link as RRLink, useNavigate as useRRNavigate, useSearchParams, type LinkProps } from "react-router-dom";
import type { ReactNode } from "react";

export function resolveV2Path(to: string, params?: Record<string, string>): string {
  if (!params) return to;
  let out = to;
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`$${k}`).join(v);
  }
  return out;
}

export function v2Url(to: string): string {
  if (to.startsWith("/v2")) return to;
  if (to.startsWith("http") || to.startsWith("mailto") || to.startsWith("tel")) return to;
  return to === "/" ? "/v2/" : `/v2${to.startsWith("/") ? to : `/${to}`}`;
}

export function v2QueryString(
  search?: Record<string, string | number | undefined>,
): string {
  const qs = new URLSearchParams();
  if (search) {
    for (const [k, v] of Object.entries(search)) {
      if (v !== undefined) qs.set(k, String(v));
    }
  }
  const q = qs.toString();
  return q ? `?${q}` : "";
}

export type V2NavigateOptions = {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string | number | undefined>;
  replace?: boolean;
};

export function useV2Navigate() {
  const navigate = useRRNavigate();
  return (opts: V2NavigateOptions) => {
    navigate(
      v2Url(resolveV2Path(opts.to, opts.params)) + v2QueryString(opts.search),
      { replace: opts.replace },
    );
  };
}

export function useSearch(): Record<string, string> {
  const [searchParams] = useSearchParams();
  return Object.fromEntries(searchParams.entries());
}

type V2LinkProps = {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string | number | undefined>;
  hash?: string;
  children?: ReactNode;
} & Omit<LinkProps, "to">;

export function V2Link({ to, params, search, hash, children, ...rest }: V2LinkProps) {
  const path = v2Url(resolveV2Path(to, params)) + v2QueryString(search);
  const href = hash ? `${path}#${hash}` : path;
  return (
    <RRLink to={href} {...rest}>
      {children}
    </RRLink>
  );
}
