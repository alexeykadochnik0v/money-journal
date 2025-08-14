import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:focus-visible:ring-white",
        className
      )}
      {...props}
    />
  );
}
