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

const collectionRef = collection(db, "messages");
const maxLimit = 25;

export const postChatMessage = async (userId, userName, message) => {
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

export const getInitialMessages = async (
  setMessages,
  setLastVisible,
  setLoading
) => {
  try {
    setLoading(true);

    const q = query(
      collectionRef,
      orderBy("timestamp", "desc"), // get in order of newest first
      limit(maxLimit)
    );

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMessages(data);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

    setLoading(false);
  } catch (error) {
    // todo: handle errors
    console.error("error:", error);
    setLoading(false);
  }
};

export const loadMoreMessages = async (
  lastVisible,
  setLastVisible,
  setMessages,
  setLoading
) => {
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

      const loadedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages((messages) => [...messages, ...loadedMessages]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      setLoading(false);
    } catch (error) {
      console.error("error:", error);
      setLoading(false);
    }
  }
};

export const onFirestoreChange = (setMessages) => {
  try {
    const q = query(collectionRef, orderBy("timestamp", "desc"), limit(1));

    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const lastMessage = querySnapshot.docs[0].data();
        const lastMessageId = querySnapshot.docs[0].id;

        if (lastMessage.timestamp === null) return;

        setMessages((prevMessages) => {
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
    console.log("error:", error);
  }
};
