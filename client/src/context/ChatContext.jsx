import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import { io } from  "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsloading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChat, setPotentialChat] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [message, setMessage] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket ] = useState(null);
  const [onlineUser, setOnlineUser] = useState(null);
  console.log("Online Users", onlineUser);
  const setUserId = user?._id;

// =========================== SOCKET IO =============================
  // INITIAL SOCKET
  useEffect(() => {
    const newSocket = io("http://localhost:3100");      // Listen port from socketIo server
    setSocket(newSocket);

    return () => {            // CLean up function 
      newSocket.disconnect();
    }
  },[user])

  // EMIT EVENT "addNewUser" FROM CLIENT
  useEffect(() => {
    if (socket === null) return;
    socket.emit('addNewUser', user?._id);
    socket.on('getOnlineUsers', (res) => {
      setOnlineUser(res);
    });
  },[socket])

  // SEND MESSAGE VIA SOCKETIO
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", {...newMessage, recipientId});
  },[newMessage])

  // RECEIVE MESSAGE VIA SOCKETIO SERVER
  useEffect(() => {
    if (socket === null) return;
      socket.on("getMessage", res => {
        if (currentChat?._id !== res.chatId) return;
        setMessage((prev) => [...prev, res]);
      });

      return () => {        // Clean up function
        socket.off("getMessage")
      }
  },[socket, currentChat])

// ================================= FETCH CHAT METHOD ============================
  // GET USERS
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/api/users`);
      if (response.error) {
        return setUserChatsError(response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;
        
        // CHECK USER HAS CREATED CHAT OR NOT
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id
          });
        }

        return !isChatCreated
      })

      setPotentialChat(pChats);
    }

    getUsers();
  }, [userChats]);

  // GET USERS CHAT BUT ĐANG NHẮN DỞ
  useEffect(() => {
    const getUserChats = async() => {
      if (setUserId) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/api/chats/${setUserId}`);
        console.log('RESPONSE', response);
        setIsUserChatsLoading(false);

        // IF RUN ERROR
        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);


// GET MESSAGES
  useEffect(() => {
    const getMessages = async() => {
        setIsMessageLoading(true);  
        setMessageError(null);

        const response = await getRequest(`${baseUrl}/api/messages/${currentChat?._id}`);
        setIsMessageLoading(false);

        // IF RUN ERROR
        if (response.error) {
          return setMessageError(response);
        }

        setMessage(response);
      }
    getMessages();
}, [currentChat]);

  // CREATE CHAT
  const createChat = useCallback( async (firstId, secondId) => {
    const response = await postRequest(`${baseUrl}/api/chats`, JSON.stringify({firstId, secondId}));

    if (response.error) {
     return console.log('Error creating chat', response);
    }
    setUserChats((prev) => [...prev, response]);
  },[])

  // SEND TEXT MESSAGE
  const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) return console.log("You must type something...");
    const response = await postRequest(`${baseUrl}/api/messages`, JSON.stringify({
      chatId: currentChatId,
      senderId: sender._id,
      text: textMessage
    }))

    if (response.error) {
      return setSendTextMessageError(response)
    }
      setNewMessage(response);
      setMessage((prev) => [...prev, response]);         // Cập nhật lại messages
      setTextMessage("");
    }
   ,[])

  // UPDATE CURRENT CHAT
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  },[]);
  
  return (
    <ChatContext.Provider
      value={{ userChats, isUserChatsloading, userChatsError, potentialChat, createChat, currentChat, updateCurrentChat, message, isMessageLoading, messageError, sendTextMessage,onlineUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};
