"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "@/lib/firebase";
import UserSidebarMenu from "@/components/user-sidebar-menu";
import { signOut } from "@firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useChats from "@/hooks/use-chats";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import NewChatDialog from "@/components/new-chat-dialog";
import AvatarWithFallback from "@/components/avatar-with-fallback";
import { addOrUpdateUser } from "@/lib/user";
import { updateChats } from "@/lib/chat";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const [user, loading] = useAuthState(firebase.auth);
  const chats = useChats(user);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (user != null) {
      void addOrUpdateUser(user);
      void updateChats(user);
    } else {
      router.push("/sign-in");
    }
  }, [user, loading, router]);
  if (user == null || chats === undefined) return;
  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <h1 className="text-xl font-bold">Messages</h1>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-3"
                onClick={() => {
                  setNewChatDialogOpen(true);
                }}
              >
                <SquarePen />
              </Button>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathName === `/${chat.id}`}
                      >
                        <Link href={chat.id}>
                          <AvatarWithFallback
                            displayName={chat.recipientDisplayName}
                            photoURL={chat.recipientPhotoURL}
                            className="size-6"
                          />
                          {chat.recipientDisplayName}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <UserSidebarMenu
              user={user}
              signOut={() => {
                void signOut(firebase.auth);
              }}
            />
          </SidebarFooter>
        </Sidebar>
        {children}
      </SidebarProvider>
      <NewChatDialog
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
        user={user}
      />
    </>
  );
};

export default ChatLayout;
