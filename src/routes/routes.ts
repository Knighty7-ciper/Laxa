// src/routes/routes.ts
// This file can be used to define a route configuration object or array
// which can be useful for generating routes programmatically, creating sitemaps, etc.

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  auth: boolean;
  // ... other properties
}

export const appRoutes: RouteConfig[] = [
  // Example:
  // { path: '/', component: HomePage, auth: false },
];
