"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";
import { AuthService } from "@/services/auth-service";
import type { UserData } from "@/types/auth";

export function AccountSwitcher({
  users,
}: {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [activeUser, setActiveUser] = useState(users[0]);
  const router = useRouter();

  // Load current authenticated user on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    toast.success("Logging out...", {
      description: "Clearing session data and redirecting to login.",
    });

    // Use AuthService logout which handles all cleanup
    AuthService.logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
          <AvatarFallback className="rounded-lg">{getInitials(activeUser.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {/* Current authenticated user */}
        {currentUser && (
          <>
            <DropdownMenuItem className="bg-accent/50 border-l-primary border-l-2 p-0">
              <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
                <Avatar className="size-9 rounded-lg">
                  <AvatarImage src={undefined} alt={currentUser.email} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(
                      currentUser.first_name && currentUser.last_name
                        ? `${currentUser.first_name} ${currentUser.last_name}`
                        : currentUser.email,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentUser.first_name && currentUser.last_name
                      ? `${currentUser.first_name} ${currentUser.last_name}`
                      : currentUser.email}
                  </span>
                  <span className="truncate text-xs">{currentUser.designation || currentUser.user_type}</span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Fallback users for demo purposes */}
        {!currentUser &&
          users.map((user) => (
            <DropdownMenuItem
              key={user.email}
              className={cn("p-0", user.id === activeUser.id && "bg-accent/50 border-l-primary border-l-2")}
              onClick={() => setActiveUser(user)}
            >
              <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
                <Avatar className="size-9 rounded-lg">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs capitalize">{user.role}</span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
