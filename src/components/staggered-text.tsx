import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function StaggeredText({
  children,
  className,
  reducedMotion,
}: {
  children: string;
  className?: string;
  reducedMotion: boolean;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const words = Array.from(children.matchAll(/\S+/g), (match) => ({
    key: `${match.index}-${match[0]}`,
    value: match[0],
  }));

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        "[data-stagger-word]",
        { opacity: 0.25, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.045,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <span ref={rootRef} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((word) => (
          <span key={word.key} data-stagger-word className="mr-[0.24em] inline-block">
            {word.value}
          </span>
        ))}
      </span>
    </span>
  );
}
