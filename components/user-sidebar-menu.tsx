"use client";

import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@firebase/auth";

const UserAvatar = ({ user }: { user: User }) => (
  <Avatar className="h-8 w-8 rounded-lg">
    {user.photoURL && (
      <AvatarImage src={user.photoURL} alt={user.displayName ?? undefined} />
    )}
    <AvatarFallback className="rounded-lg">
      {user.displayName?.charAt(0).toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

const UserText = ({ user }: { user: User }) => (
  <div className="text-sm leading-tight">
    <span className="block truncate font-semibold">{user.displayName}</span>
    <span className="block truncate text-xs">{user.email}</span>
  </div>
);

const UserSidebarMenu = ({
  user,
  signOut,
}: {
  user: User;
  signOut: () => void;
}) => (
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserAvatar user={user} />
            <UserText user={user} />
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={useSidebar().isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
              <UserAvatar user={user} />
              <UserText user={user} />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default UserSidebarMenu;
