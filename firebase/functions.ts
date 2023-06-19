import {
  addDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  startAfter,
} from "firebase/firestore";
import { db } from "./config";
import {
  ChatMessage,
  PostChatMessageProps,
  GetInitialMessagesProps,
  LoadMoreMessagesProps,
  OnFirestoreChangeProps,
} from "../types";

const collectionRef = collection(db, "messages");
const maxLimit = 25;

export const postChatMessage = async ({
  userId,
  userName,
  message,
}: PostChatMessageProps) => {
  try {
    await addDoc(collectionRef, {
      userId,
      userName,
      message,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    // todo: handle errors
    console.error("error:", error);
  }
};

export const getInitialMessages = async ({
  setMessages,
  setLastVisible,
  setLoading,
}: GetInitialMessagesProps) => {
  try {
    setLoading(true);

    const q = query(
      collectionRef,
      orderBy("timestamp", "desc"), // get in order of newest first
      limit(maxLimit)
    );

    const querySnapshot = await getDocs(q);

    const data: ChatMessage[] = querySnapshot.docs.map((doc) => {
      const { message, timestamp, userId, userName } = doc.data();
      return {
        id: doc.id,
        message,
        timestamp,
        userId,
        userName,
      };
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    setMessages(data);
    setLastVisible(lastVisible);

    setLoading(false);
  } catch (error) {
    // todo: handle errors
    console.error("error:", error);
    setLoading(false);
  }
};

export const loadMoreMessages = async ({
  lastVisible,
  setLastVisible,
  setMessages,
  setLoading,
}: LoadMoreMessagesProps) => {
  if (lastVisible) {
    try {
      setLoading(true);

      const q = query(
        collectionRef,
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(maxLimit)
      );

      const querySnapshot = await getDocs(q);

      const loadedMessages: ChatMessage[] = querySnapshot.docs.map((doc) => {
        const { message, timestamp, userId, userName } = doc.data();
        return {
          id: doc.id,
          message,
          timestamp,
          userId,
          userName,
        };
      });

      setMessages((prevMessages: ChatMessage[]) => [
        ...prevMessages,
        ...loadedMessages,
      ]);

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      setLoading(false);
    } catch (error) {
      console.error("error:", error);
      setLoading(false);
    }
  }
};

export const onFirestoreChange = ({ setMessages }: OnFirestoreChangeProps) => {
  try {
    const q = query(collectionRef, orderBy("timestamp", "desc"), limit(1));

    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const lastMessage = querySnapshot.docs[0].data() as ChatMessage;
        const lastMessageId = querySnapshot.docs[0].id;

        if (lastMessage.timestamp === null) return;

        setMessages((prevMessages: ChatMessage[]) => {
          const messageExist = prevMessages.some(
            (item) => item.id === lastMessageId
          );

          if (messageExist) return prevMessages;

          return [lastMessage, ...prevMessages];
        });
      }
    });
  } catch (error) {
    // todo: handle errors
    console.error("error:", error);
  }
};
