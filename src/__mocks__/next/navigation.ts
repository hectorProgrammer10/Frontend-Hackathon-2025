export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
}))

export const usePathname = jest.fn(() => '/')

export const useParams = jest.fn(() => ({ id: 'test-id' }))

export const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
}))
