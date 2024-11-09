"use client";

import { ReactNode } from "react";
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
import { collection, query, where } from "@firebase/firestore";
import { chatConverter } from "@/lib/chat";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [user] = useAuthState(firebase.auth);
  const [chats] = useCollectionData(
    user != null
      ? query(
          collection(firebase.firestore, "chats").withConverter(chatConverter),
          where("members", "array-contains", user.uid),
        )
      : null,
  );
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          {chats !== undefined && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/${chat.id}`}
                      >
                        <Link href={chat.id}>{chat.id}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          {user != null && (
            <UserSidebarMenu
              user={user}
              signOut={() => {
                void signOut(firebase.auth);
              }}
            />
          )}
        </SidebarFooter>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
};

export default ChatLayout;
