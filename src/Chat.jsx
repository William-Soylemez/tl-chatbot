import { useEffect, useRef, useState } from 'react';
import { BACKEND_URL } from './constants/urls';
import ReactMarkdown from 'react-markdown';
import { useAuth } from './AuthProvider';

const Status = Object.freeze({
  COMPLETED: 1,
  PENDING: 2,
  FAILED: 3,
});


const Chat = ({ conversation, setConversation }) => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [conversationState, setConversationState] = useState(Status.PENDING);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { fetchProtectedData } = useAuth();

  useEffect(() => {
    if (conversation === null) {
      return;
    }
    // Load initial messages
    setConversationState(Status.PENDING);
    fetchProtectedData(`get_messages/?conversation_id=${conversation}`)
      .then((data) => {
        setMessages(data);
        setConversationState(Status.COMPLETED);
      })
      .catch((error) => {
        console.error("Error:", error);
        setConversationState(Status.FAILED);
      });
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submit", input);
    if (input === "") return;
    const newMessages = [...messages,
    { message_id: messages.length + 1, is_user_entry: true, status: Status.COMPLETED, contents: input },
    { message_id: messages.length + 2, is_user_entry: false, status: Status.PENDING, contents: "..." },
    ]
    setMessages(newMessages);
    setInput("");

    // Prepare prompt
    const body = {
      "prompt": input,
      "conversation_id": conversation,
    };
    fetchProtectedData(`prompt/`, body)
      .then((data) => {
        // Update local state
        setMessages(newMessages.map((message) => {
          if (!message.is_user_entry && message.status === Status.PENDING) {
            return { ...message, status: Status.COMPLETED, contents: data.message };
          }
          return message;
        }));
      })
      .catch((error) => {
        console.error("Error:", error);

        // Update local state
        setMessages(newMessages.map((message) => {
          if (!message.is_user_entry && message.status === Status.PENDING) {
            return { ...message, contents: "Error retrieving response!", status: Status.FAILED };
          }
          return message;
        }));
      });
  };
  
  // If conversation doesn't exist, display message saying so
  if (conversation === null) {
    return (
      <div className='border-4 border-amber-800 bg-green-100 rounded-sm p-5 w-full max-w-4xl mx-auto h-[75vh]'>
        <div className='flex flex-col h-5/6 justify-center items-center'>
          <p>Please select a conversation</p>
        </div>
      </div>
    );
  }

  
  if (conversationState === Status.PENDING) {
    return (
      <div className='border-4 border-amber-800 bg-green-100 rounded-sm p-5 w-full max-w-4xl mx-auto h-[75vh]'>
        <div className='flex flex-col h-5/6 justify-center items-center'>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (conversationState === Status.FAILED) {
    return (
      <div className='border-4 border-amber-800 bg-green-100 rounded-sm p-5 w-full max-w-4xl mx-auto h-[75vh]'>
        <div className='flex flex-col h-5/6 justify-center items-center'>
          <p className='text-red-600'>Error loading conversation</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='border-4 border-amber-800 bg-green-100 rounded-sm p-5 w-full max-w-4xl mx-auto h-[75vh]'>
        {/* Messages */}
        <div className='flex flex-col h-5/6 overflow-y-auto'>

          {messages?.length > 0 && messages.map((message) => (
            <div key={message.message_id} className={
              'p-3 border-2 rounded-sm my-2 bg-white max-w-fit w-4/5 '
              + (message.is_user_entry ? 'self-end' : 'self-start') + ' '
              + (message.status === Status.PENDING ? 'animate-pulse' : '')
              + (message.status === Status.FAILED ? 'bg-red-100' : '')
            }>
              <ReactMarkdown>{message.contents}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Type a message...'
            className='w-full border-2 border-amber-800 rounded-sm p-2 resize my-5'
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
      </div>

    </>
  );
}

export default Chat;