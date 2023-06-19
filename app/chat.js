import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Link, useSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  postChatMessage,
  getInitialMessages,
  onFirestoreChange,
  loadMoreMessages,
} from "../firebase/functions";
import { colors } from "../styles";

export default function Chat() {
  const params = useSearchParams();
  const { userName, userId } = params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      await getInitialMessages(setMessages, setLastVisible, setLoading);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const unsubscribe = onFirestoreChange(setMessages);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLoadMore = async () => {
    await loadMoreMessages(
      lastVisible,
      setLastVisible,
      setMessages,
      setLoading
    );
  };

  const handleSend = async () => {
    if (message === "") return;
    await postChatMessage(userId, userName, message);
    setMessage("");
  };

  const formatUserName = (name) => name.substr(0, 1);

  const handleRenderItem = ({ item, index }) => {
    const isFirstMessage =
      messages[index - 1] === undefined ||
      messages[index - 1]?.userId !== item?.userId;
    const showAvatar = isFirstMessage;
    return (
      <View style={styles.message}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        {showAvatar && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formatUserName(item.userName)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link style={styles.backLink} href="/">
          Back
        </Link>
        <View>
          <Text style={styles.chat}>Chat</Text>
        </View>
        <Text style={styles.filler}>Fill</Text>
      </View>
      {loading && (
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      )}
      <View style={styles.messageListContainer}>
        <FlatList
          style={styles.messageList}
          data={messages}
          keyExtractor={(item, index) => index}
          renderItem={handleRenderItem}
          inverted={true}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
        />
      </View>
      <KeyboardAvoidingView
        style={styles.footer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Message"
          placeholderTextColor="#ddd"
        />
        <Text onPress={handleSend} style={styles.sendButton}>
          Send
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purpleLighter,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    position: "relative",
  },
  header: {
    paddingHorizontal: 16,
    backgroundColor: colors.purpleDark,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  backLink: {
    color: colors.white,
    padding: 16,
    fontSize: 16,
  },
  chat: {
    color: colors.white,
    fontWeight: "bold",
    padding: 16,
    fontSize: 16,
  },
  filler: {
    opacity: 0,
    padding: 16,
    fontSize: 16,
  },
  headerText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 20,
  },
  messageListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    backgroundColor: colors.purpleLight,
  },
  messageList: {
    width: "100%",
  },
  messageContainer: {
    backgroundColor: colors.purpleMedium,
    borderRadius: 8,
    padding: 10,
    margin: 4,
    alignSelf: "flex-start",
    maxWidth: "80%",
    marginLeft: 34,
  },
  messageText: {
    fontSize: 16,
    color: colors.white,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.purpleDark,
    paddingLeft: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.purpleMediumLight,
    color: colors.white,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendButton: {
    color: colors.white,
    fontWeight: "bold",
    padding: 20,
  },
  message: {
    position: "relative",
  },
  avatar: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 25,
    height: 25,
    borderRadius: 100,
    backgroundColor: colors.purpleDark,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 0,
    textAlign: "center",
    verticalAlign: "middle",
  },
  loader: {
    position: "absolute",
    zIndex: 9999,
    top: 100,
    width: 50,
    left: "50%",
    marginLeft: -25,
  },
});
