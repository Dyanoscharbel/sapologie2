"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        logout();
        router.push("/");
      }}
    >
      Déconnexion
    </Button>
  );
}
