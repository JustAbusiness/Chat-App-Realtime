import React, { useContext } from 'react'
import { Stack } from 'react-bootstrap'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import avatar from '../../assets/undraw_male_avatar.svg'
import { ChatContext } from '../../context/ChatContext';

function UserChat({chat, user}) {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUser } = useContext(ChatContext);
    const isOnline = onlineUser?.some((user) => user?.userId === recipientUser?._id)
  return (
    <Stack direction='horizontal' gap={3} className="user-card align-items-center p-2 justify-content-between" role='button'>
        <div className='d-flex'>
            <div className="me-2">
                <img src={avatar} alt="avatar" width={70} height={50}                                                                                                                    />
            </div>
            <div className='text-content'>
                <div className="name">{recipientUser?.name}</div>
                <div className='text'> Text message</div>
            </div>
        </div>

            <div className="d-flex flex-column align-items-end gap-1">
                <div className="date">
                    12/12/2023
                </div>
                <div className='this-user-notifications'>
                    2
                </div>
                <span className={isOnline ? 'user-online' : ''}>
                </span>
            </div>
    </Stack>
  )
}

export default UserChat