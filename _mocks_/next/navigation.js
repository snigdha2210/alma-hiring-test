// __mocks__/next/navigation.ts
export const useRouter = jest.fn(() => ({
  push: jest.fn(),
}));
