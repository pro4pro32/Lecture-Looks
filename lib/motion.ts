export const motionTokens = {
  duration: {
    fast: 0.18,
    normal: 0.28,
    slow: 0.4,
  },
  easing: {
    standard: [0.2, 0.9, 0.2, 1] as const,
    emphasize: [0.33, 1, 0.68, 1] as const,
  },
  spring: {
    snappy: { type: "spring" as const, stiffness: 520, damping: 38 },
    smooth: { type: "spring" as const, stiffness: 330, damping: 34 },
  },
  variants: {
    fadeInUp: {
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
};
