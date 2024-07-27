import { useEffect, useState } from "react";
import { BACKEND_URL } from "./constants/urls";
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from "./AuthProvider";

const ConversationSelector = ({ conversation, setConversation }) => {
  const [conversations, setConversations] = useState([
    // Example conversation data
    // { id: 1, name: "Conversation 1" },
    // { id: 2, name: "Conversation 2" },
    // { id: 3, name: "Conversation 3" },
  ]);

  const [newConversationName, setNewConversationName] = useState("");

  const { fetchProtectedData, isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch conversations
    fetchProtectedData(`get_conversations/?user_id=1`)
      .then((data) => {
        setConversations(data);
        if (!conversation && data.length > 0) {
          setConversation(data[0].conversation_id);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [isAuthenticated]);

  const createNewConversation = () => {
    if (newConversationName === "") return;

    fetchProtectedData(`add_conversation/`, { name: newConversationName })
      .then((data) => {
        setConversations([...conversations, data.conversation]);
        setConversation(data.conversation.conversation_id);
        setNewConversationName("");
      })

  }

  const deleteConversation = (conversation_id) => {
    fetchProtectedData(`delete_conversation/?conversation_id=${conversation_id}`)
      .then(() => {
        setConversations(conversations.filter((c) => c.conversation_id !== conversation_id));
        if (conversation === conversation_id) {
          setConversation(conversations[0].conversation_id);
        }
      });
    }

  return (
    <div className="m-5 border-4 border-amber-800 bg-green-100">
      {/* Create conversation textbox */}
      <div className='flex flex-row justify-between items-center p-5'>
        <input
          type="text"
          placeholder="Create new conversation"
          className='p-2 border-2 border-amber-800'
          value={newConversationName}
          onChange={(e) => setNewConversationName(e.target.value)}
        />
        <button onClick={createNewConversation} className='p-2 bg-amber-800 border-2 border-amber-800 text-white'>Create</button>
      </div>

      {/* List of conversations */}
      <ul className="m-2 max-h-[50vh] overflow-y-auto">
        {conversations.map((c) => (
          <li
            key={c.conversation_id}
            className="p-2 border-b-2 border-amber-800 flex flex-row items-center"
          >
            <p
              onClick={() => setConversation(c.conversation_id)}
              className={
                'cursor-pointer p-2 hover:bg-amber-800 hover:text-white w-4/5 mx-2'
                + (conversation === c.conversation_id ? ' bg-amber-800 text-white' : '')
              }
            >
              {c.name}
            </p>
            <FaTrashAlt size={20}
              className='cursor-pointer' onClick={() => deleteConversation(c.conversation_id)}
            />
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationSelector;