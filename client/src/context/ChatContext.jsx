import { createContext, useEffect, useState } from "react";
import { getRequest, baseUrl } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsloading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  useEffect(() => {
    const getUserChats = async() => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`http://localhost:3500/api/chats/${user._id}`);
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
  return (
    <ChatContext.Provider
      value={{ userChats, isUserChatsloading, userChatsError }}
    >
      {children}
    </ChatContext.Provider>
  );
};
