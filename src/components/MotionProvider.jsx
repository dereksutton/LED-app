"use client";
import { MotionConfig } from 'framer-motion';

// Respect the visitor's reduced-motion setting for every framer-motion animation.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
