import { useEffect, useRef, useState } from 'react';
import { BACKEND_URL } from './constants/urls';
import ReactMarkdown from 'react-markdown';

const Status = Object.freeze({
  COMPLETED: 1,
  PENDING: 2,
  FAILED: 3,
});


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load initial messages
    fetch(`${BACKEND_URL}/get_messages/?conversation_id=1`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Loaded messages", data);
        setMessages(data);
      })
  }, []);

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
      "conversation_id": 1,
    };
    fetch(`${BACKEND_URL}/prompt/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

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
      });
  };

  return (
    <>
      <div className='border-4 border-amber-800 bg-green-100 rounded-sm p-5 max-w-4xl mx-auto h-4/5'>
        {/* Messages */}
        <div className='flex flex-col h-5/6 overflow-y-auto'>

          {messages.map((message) => (
            <div key={message.message_id} className={
              'p-3 border-2 rounded-sm my-2 bg-white max-w-fit w-4/5 '
              + (message.is_user_entry ? 'self-end' : 'self-start')
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