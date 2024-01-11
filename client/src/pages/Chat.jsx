import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"
import { Container, Stack } from "react-bootstrap"
import UserChat from "../components/chat/UserChat"
import { AuthContext } from "../context/AuthContext"
import PotentialChat from "../components/chat/PotentialChat"
import ChatBox from "../components/chat/ChatBox"

function Chat() {
  const {user} = useContext(AuthContext);
  const {userChats, isUserChatsloading, updateCurrentChat, message, isMessageLoading, messageError} = useContext(ChatContext)
  return (
    <Container>
      <PotentialChat />
        {userChats?.length < 1  ? null : (
          <Stack direction="horizontal" gap={4} className="align-items-start">
              <Stack className="message-box flex-grow-0 pe-3" gap={3}>
                {isUserChatsloading && (
                  <p> Loading</p>
                )}

                {/* DISPLAY USERS CHATS LIST */}
                {userChats?.map((chat, index) => (
                  <div key={index} onClick={() => updateCurrentChat(chat)}>
                      <UserChat chat={chat} user={user} />
                  </div>
                ))}
              </Stack>
              <ChatBox />
          </Stack>
        )}
    </Container>
  )
}

export default Chat
