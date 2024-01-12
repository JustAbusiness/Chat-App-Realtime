import React, { useContext } from 'react'
import { Stack } from 'react-bootstrap'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import avatar from '../../assets/undraw_male_avatar.svg'
import { ChatContext } from '../../context/ChatContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotifications';
import { useFetchLastMessage } from '../../hooks/useFetchLastMessage';
import moment from 'moment';

function UserChat({chat, user}) {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUser, notifications, maskThisUserNotificationAsRead } = useContext(ChatContext);
    const { lastestMessage } = useFetchLastMessage(chat);
    const isOnline = onlineUser?.some((user) => user?.userId === recipientUser?._id)
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const thisUserNotifications = unreadNotifications.filter((un) => un.senderId === recipientUser?._id);
    const truncateText = (text) => {
        if (text === undefined) {
            return '' ; 
        }

        let shortText = text.substring(0, 20);
        if (text.length > 20) {
            shortText = shortText + '...';
        }
        return shortText;
    }

  return (
    <Stack onClick={() => {
        if(thisUserNotifications?.length  !== 0) {
            maskThisUserNotificationAsRead(thisUserNotifications, notifications)
            }
        }} 
    direction='horizontal' gap={3} className="user-card align-items-center p-2 justify-content-between" role='button'>
        <div className='d-flex'>
            <div className="me-2">
                <img src={avatar} alt="avatar" width={70} height={50}                                                                                                                    />
            </div>
            <div className='text-content'>
                <div className="name">{recipientUser?.name}</div>
                <div className='text'>{lastestMessage?.text && (
                    <span>{truncateText(lastestMessage?.text)}</span>
                )} </div>
            </div>
        </div>

            <div className="d-flex flex-column align-items-end gap-1">
                <div className="date">
                    { moment(lastestMessage?.createdAt).calendar()}
                </div>
                <div className={thisUserNotifications?.length > 0 ? 'this-user-notifications' : ''}>
                    {thisUserNotifications?.length > 0 ? thisUserNotifications?.length : ' '}
                </div>
                <span className={isOnline ? 'user-online' : ''}>
                </span>
            </div>
    </Stack>
  )
}

export default UserChat