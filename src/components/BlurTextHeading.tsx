"use client";

import { motion, useReducedMotion } from "motion/react";

type BlurTextHeadingProps = {
  text: string;
  className?: string;
  delay?: number;
  emphasizeFrom?: number;
};

export function BlurTextHeading({
  text,
  className,
  delay = 0.11,
  emphasizeFrom = Number.POSITIVE_INFINITY,
}: BlurTextHeadingProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.h1 className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className={`blur-text-word ${index >= emphasizeFrom ? "blur-text-emphasis" : ""}`}
          key={`${word}-${index}`}
          initial={reduceMotion ? false : { filter: "blur(12px)", opacity: 0, y: 28 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.75,
            delay: reduceMotion ? 0 : index * delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
