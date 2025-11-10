// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfills for Web APIs in Node.js environment
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for URL in Node.js < 18
import { URL, URLSearchParams } from 'url';
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// Note: Next.js server components are mocked in individual test files

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Three.js and React Three Fiber
jest.mock('three', () => {
  const actualThree = jest.requireActual('three')
  return {
    ...actualThree,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      dispose: jest.fn(),
      domElement: document.createElement('canvas'),
    })),
    Scene: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      remove: jest.fn(),
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      lookAt: jest.fn(),
    })),
  }
})

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
  useThree: () => ({
    camera: {
      position: { set: jest.fn() },
      lookAt: jest.fn(),
    },
  }),
  useFrame: jest.fn(),
}))

jest.mock('@react-three/drei', () => ({
  useGLTF: jest.fn(() => ({
    scene: {
      traverse: jest.fn(),
    },
  })),
  useVideoTexture: jest.fn(() => ({
    source: {
      data: document.createElement('video'),
    },
    wrapS: jest.fn(),
    repeat: { x: 0 },
  })),
  Html: ({ children }) => <div data-testid="html">{children}</div>,
  PointerLockControls: () => <div data-testid="pointer-lock-controls" />,
  PositionalAudio: () => <div data-testid="positional-audio" />,
}))

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-cinema-app'
process.env.NODE_ENV = 'test'
