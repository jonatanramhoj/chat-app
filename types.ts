import { QueryDocumentSnapshot } from "firebase/firestore";

export type ChatMessage = {
  message: string;
  timestamp: {
    nanoseconds: number;
    seconds: number;
  } | null;
  userId: string;
  userName: string;
  id?: string;
};

export type PostChatMessageProps = {
  userId: string;
  userName: string;
  message: string;
};

export type GetInitialMessagesProps = {
  setMessages: (messages: ChatMessage[]) => void;
  setLastVisible: (lastVisible: QueryDocumentSnapshot) => void;
  setLoading: (isLoading: boolean) => void;
};

export type LoadMoreMessagesProps = {
  lastVisible: QueryDocumentSnapshot | null;
  setLastVisible: (lastVisible: QueryDocumentSnapshot) => void;
  setMessages: (
    messages: ChatMessage[] | ((prevState: ChatMessage[]) => ChatMessage[])
  ) => void;
  setLoading: (isLoading: boolean) => void;
};

export type OnFirestoreChangeProps = {
  setMessages: (
    messages: ChatMessage[] | ((prevState: ChatMessage[]) => ChatMessage[])
  ) => void;
};
