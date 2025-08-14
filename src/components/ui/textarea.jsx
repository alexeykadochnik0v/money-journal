import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:focus-visible:ring-white",
        className
      )}
      {...props}
    />
  );
}
