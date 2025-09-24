import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "logo" | "wordmark";
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-auto",
  md: "h-12 w-auto",
  lg: "h-16 w-auto"
};

export default function Logo({
  variant = "logo",
  size = "md",
  className = "",
  priority = false
}: LogoProps) {
  const baseFileName = variant === "wordmark" ? "wordmark" : "logo";

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <Image
        src={`/${baseFileName}.png`}
        alt="Trampoline Parks Directory"
        width={variant === "wordmark" ? 300 : 200}
        height={variant === "wordmark" ? 100 : 200}
        className={sizeClasses[size]}
        priority={priority}
      />
    </Link>
  );
}