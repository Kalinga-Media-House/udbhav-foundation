import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';

import { RootProviders } from '@/providers';

/**
 * Custom render function that wraps components with the global providers (Theme, Auth).
 * Use this instead of standard RTL render for testing components that require context.
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: RootProviders as React.ComponentType, ...options });

export * from '@testing-library/react';
export { customRender as render };
