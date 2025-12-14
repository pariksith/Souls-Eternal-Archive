import { useState } from "react";

export function useVault() {
  const [password, setPassword] = useState<string | null>(null);

  const unlock = (pwd: string) => setPassword(pwd);
  const lock = () => setPassword(null);

  return {
    password,
    unlock,
    lock,
    isUnlocked: !!password,
  };
}
