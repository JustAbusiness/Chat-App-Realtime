import { useContext, useEffect, useState } from 'react'
import { baseUrl, getRequest } from '../utils/services'
import { ChatContext } from '../context/ChatContext'

export const useFetchLastMessage = chat => {
  // FETCH USER CÓ CÙNG PHÒNG CHAT
  const { newMessage, notifications } = useContext(ChatContext)
  const [lastestMessage, setLastestMessage] = useState(null)

  useEffect(
    () => {
      const getMessages = async () => {
        const response = await getRequest(
          `${baseUrl}/api/messages/${chat?._id}`
        )
        if (response.error) {
          return setError(error)
        }

        // Get message latest
        const lastMessage = response[response.length - 1]
        setLastestMessage(lastMessage)
      }
      getMessages()
    },
    [newMessage, notifications]
  );

  return { lastestMessage }
}
