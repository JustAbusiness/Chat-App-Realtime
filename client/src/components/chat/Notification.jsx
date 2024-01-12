import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';
import {unreadNotificationsFunc} from '../../utils/unreadNotifications.js'
import moment from 'moment'

function Notification () {
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useContext(AuthContext);
  const { notifications, userChats, allUsers, maskAllNotifications, maskNotificationsAsRead } = useContext(ChatContext);
  const unreadNotification = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
      const sender = allUsers.find((u) => u._id === n.senderId);
      return {
        ...n,
        senderName: sender?.name
      }
  });

  console.log('Unread', unreadNotification);
  console.log('Modified', modifiedNotifications);

  return (
    <div className='notifications'>
      <div className='notifications-icon' onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='30'
          height='25'
          fill='currentColor'
          className='bi bi-chat-fill'
          viewBox='0 0 16 16'
        >
          <path d='M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15' />
        </svg>
        {unreadNotification?.length === 0 ? null : (
            <span className='notification-count'>
                <span>{unreadNotification?.length}</span>
            </span>
        )}
      </div>
      {isOpen
        ? <div className='notifications-box'>
          <div className='notifications-header'>
            <h3> Notifications</h3>
            <div className='mark-as-read' onClick={() => maskAllNotifications(notifications)}>Mask all as read</div>
          </div>
          {modifiedNotifications?.length === 0 ? <div className='text-center'> No notification yet ...</div> : null}
          {modifiedNotifications && modifiedNotifications.map((m, index) => {
            return <div key={index} className={m.isRead ? 'notification' : 'notification not-read'}
            onClick={() => { maskNotificationsAsRead(m, userChats, user, notifications); setIsOpen(false)}}
            // m là current notifications
            >
                <span>{`${m.senderName} sent you a new message`}</span>
                <span className='notification-time'>{moment(m.date).calendar()}</span>
            </div>
          })}
        </div>
        : ''}
    </div>
  )
}

export default Notification
