import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-xl border bg-white text-gray-900 dark:bg-zinc-900 dark:text-gray-100 shadow", className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}
