import ChatPageContent from "@/components/chat-page-content";

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => (
  <ChatPageContent chatID={(await params).id} />
);

export default ChatPage;
