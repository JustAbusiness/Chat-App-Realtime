import React, {useContext} from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';
function PotentialChat() {
    const {user} = useContext(AuthContext);
    const { potentialChat, createChat, onlineUser } = useContext(ChatContext)
  return (
    <div className='all-users '>
        {potentialChat && potentialChat?.map((u, index) => (
            <div key={index} className="single-user" onClick={() => createChat(user._id, u._id)}>
                {u.name}
                <span className={onlineUser?.some((user) => user?.userId === u?._id) ? "user-online" : ""}>
                </span>
            </div>
        ))}
    </div>
  )
}

export default PotentialChat