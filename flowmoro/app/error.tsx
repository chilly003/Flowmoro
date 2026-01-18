'use client'

import ErrorScreen from "@/components/system/Error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <ErrorScreen
      onRetry={reset}
      showReload
    />
  );
}