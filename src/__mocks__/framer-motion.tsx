/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export const motion = {
  div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}

export const AnimatePresence = ({ children }: any) => <>{children}</>

export const useMotionValue = () => ({
  set: jest.fn(),
  get: jest.fn(() => 0),
})

export const useSpring = () => ({
  set: jest.fn(),
  get: jest.fn(() => 0),
})

export const useTransform = () => ({
  set: jest.fn(),
  get: jest.fn(() => 0),
})