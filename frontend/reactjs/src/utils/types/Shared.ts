export interface PageRoute {
  path: string;
  displayName: string;
  Component: () => JSX.Element;
}

export type PageRouteCollection = Record<string, PageRoute>;
