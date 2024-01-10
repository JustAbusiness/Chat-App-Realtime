import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"
import { Container, Stack } from "react-bootstrap"

function Chat() {
  const {userChats, isUserChatsloading, userChatsError} = useContext(ChatContext)
  console.log('UserChats', userChats)
  return (
    <Container>
        {userChats?.length < 1  ? null : (
          <Stack direction="horizontal">
              <Stack>
                List
              </Stack>
              <p> Chat box</p>
          </Stack>
        )}
    </Container>
  )
}

export default Chat
