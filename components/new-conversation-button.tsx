"use client";

import { useEffect, useState } from "react";
import { Search, SquarePen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchUsers } from "@/lib/fetchUsers";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import firebase from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

const NewConversationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<
    { id: string; name: string; email: string; photoURL: string }[]
  >([]);
  const [user] = useAuthState(firebase.auth);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };
    void loadUsers();
  }, []);

  const handleCreateOrGetConversation = async (contactId: string) => {
    if (user == null) return null;

    const chatQuery = query(
      collection(firebase.firestore, "chats"),
      where("members", "array-contains", user.uid),
    );
    const chatSnapshot = await getDocs(chatQuery);
    const existingChat = chatSnapshot.docs.find((doc) =>
      doc.data().members.includes(contactId),
    );

    if (existingChat) {
      return existingChat.id;
    } else {
      const chatRef = collection(firebase.firestore, "chats");
      const newChat = {
        members: [user.uid, contactId],
        theme: "neutral",
      };
      const docRef = await addDoc(chatRef, newChat);
      return docRef.id;
    }
  };

  const filteredContacts = users.filter(
    (contact) =>
      (contact.name &&
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.email &&
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())),
  );
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px]">
            {filteredContacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/${contact.id}`}
                onClick={async (e) => {
                  e.preventDefault();
                  const chatId = await handleCreateOrGetConversation(
                    contact.id,
                  );
                  if (chatId) {
                    window.location.href = `/${chatId}`;
                  }
                }}
              >
                <div className="flex items-center space-x-4 p-2 hover:bg-accent rounded-lg cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    {contact.photoURL ? (
                      <img
                        src={contact.photoURL}
                        alt={contact.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {contact.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationButton;
