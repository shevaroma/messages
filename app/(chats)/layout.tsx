"use client";

import { ReactNode, useEffect, useState } from "react";
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
import { collection, doc, getDoc, query, where } from "@firebase/firestore";
import { chatConverter } from "@/lib/chat";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SettingsComponent from "@/components/settings";
import { ThemeProvider } from "next-themes";
import NewConversationButton from "@/components/new-conversation-button";

const SearchField = () => (
  <div className="px-4 pb-4">
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder="Search contacts..."
        className="pl-10 w-full focus-visible:ring-transparent"
      />
    </div>
  </div>
);

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchChatUsers = async () => {
      if (chats) {
        const usersData: { [key: string]: string } = {};
        for (const chat of chats) {
          const otherUserId = chat.members.find(
            (member: string) => member !== user?.uid,
          );
          if (otherUserId) {
            const userDoc = await getDoc(
              doc(firebase.firestore, "users", otherUserId),
            );
            if (userDoc.exists()) {
              const userData = userDoc.data();
              usersData[chat.id] = `${userData.displayName}`;
            }
          }
        }
        setChatUsers(usersData);
      }
    };
    void fetchChatUsers();
  }, [chats, user]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
              <NewConversationButton />
            </div>
            <SearchField />
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
                          <Link href={chat.id}>
                            {chatUsers[chat.id] || chat.id}
                          </Link>
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
                setIsSettingsOpen={setIsSettingsOpen}
              />
            )}
          </SidebarFooter>
        </Sidebar>
        {children}
        <SettingsComponent
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default ChatLayout;
