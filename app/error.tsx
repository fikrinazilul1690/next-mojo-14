"use client";

import { useEffect } from "react";
import { logout } from "./lib/actions";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  let errorJson: { code: number; status: string } | null;
  try {
    errorJson = JSON.parse(error.message);
  } catch (error) {
    errorJson = null;
  }
  useEffect(() => {
    if (errorJson?.code === 401) {
      // logout();
    }
  }, [errorJson]);

  if (errorJson?.code === 401)
    return (
      <div>
        <h2>Your session has timed out</h2>
      </div>
    );

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
