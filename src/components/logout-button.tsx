"use client";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button type="submit" variant="outline" size="sm" className="rounded-full">
      Log out
    </Button>
  );
}
