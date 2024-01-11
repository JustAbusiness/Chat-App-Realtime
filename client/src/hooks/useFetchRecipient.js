import { useEffect, useState } from 'react';
import { baseUrl, getRequest } from '../utils/services';

export const useFetchRecipientUser = (chat, user) => {            // FETCH USER CÓ CÙNG PHÒNG CHAT
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members.find((id) => id !== user?._id);
    useEffect(() => {
        const getUser  = async () => {
            if (!recipientId) return null;
            const response = await getRequest(`${baseUrl}/api/users/find/${recipientId}`);
            if (response.error) {
                return setError(error);
            }

            // IF NOT ERROR
            setRecipientUser(response);
        }

        getUser();
    },[recipientId]);

    return {recipientUser}
}