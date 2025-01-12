"use client";

import { ChevronsUpDown, LogOut, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@firebase/auth";
import { useTheme } from "next-themes";
import AvatarWithFallback from "@/components/avatar-with-fallback";

const themes: { [key: string]: string } = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

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
}) => {
  const { theme, setTheme } = useTheme();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user.displayName !== null && user.photoURL !== null && (
                <AvatarWithFallback
                  displayName={user.displayName}
                  photoURL={user.photoURL}
                />
              )}
              <UserText user={user} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
            side={useSidebar().isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
                {user.displayName !== null && user.photoURL !== null && (
                  <AvatarWithFallback
                    displayName={user.displayName}
                    photoURL={user.photoURL}
                  />
                )}
                <UserText user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {Object.keys(themes).map((key) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={theme === key}
                        onCheckedChange={() => {
                          setTheme(key);
                        }}
                      >
                        {themes[key]}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
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
};

export default UserSidebarMenu;
