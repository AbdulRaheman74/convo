import React from 'react';
import { useSelector } from 'react-redux';
import useGetAllMesssges from '../hooks/useGetAllMessges';
import useGetRealTimeChat from '../hooks/useGetRealTimeChat';

const Messages = ({ selectedUser }) => {
  useGetRealTimeChat();
  useGetAllMesssges();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  if (!selectedUser) return null;

  return (
    <div className="w-full overflow-x-hidden px-2 pb-16">
      <div className="flex flex-col gap-2 w-full">
        {messages?.map((msg) => {
          const isSentByUser = msg.senderId === user?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'} w-full`}
            >
              <div
                className={`max-w-[85%] min-w-[20%] px-3 py-2 rounded-lg break-all overflow-hidden ${
                  isSentByUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap word-break">
                  {msg.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;