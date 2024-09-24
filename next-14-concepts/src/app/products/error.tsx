"use client";

export default function Loading({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h3 className="text-red-400">Error Loading Component</h3>
      <p>{error.message}</p>
    </div>
  );
}
