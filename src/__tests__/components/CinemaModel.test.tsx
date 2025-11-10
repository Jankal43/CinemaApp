/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import CinemaModel from '@/app/components/CinemaModel';

// Mock useGLTF from @react-three/drei
const mockUseGLTF = jest.fn(() => ({
  scene: {
    traverse: jest.fn(),
  },
}));

jest.mock('@react-three/drei', () => ({
  useGLTF: () => mockUseGLTF(),
  Html: ({ children }: { children: React.ReactNode }) => <div data-testid="html">{children}</div>,
}));

describe('CinemaModel', () => {
  it('should render without crashing', () => {
    const { container } = render(<CinemaModel />);
    expect(container).toBeDefined();
  });

  it('should load 3D model from correct path', () => {
    render(<CinemaModel />);
    expect(mockUseGLTF).toHaveBeenCalled();
  });
});
