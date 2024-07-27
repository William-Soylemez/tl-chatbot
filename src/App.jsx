import { useState } from "react";
import Chat from "./Chat"
import ConversationSelector from "./ConversationSelector";
import { useAuth } from "./AuthProvider";
import Auth from "./Auth";


function App() {
  const [conversation, setConversation] = useState(null);

  const { isAuthenticated, logout } = useAuth();

  return (
    <div className='h-screen bg-amber-300 p-5'>
      <div className="flex flex-row items-center max-w-4xl mx-auto">
        <img src={'/logo.png'} alt='TL Logo' className='mx-auto w-32 mb-5' />
        {isAuthenticated && <button onClick={logout} className='bg-amber-800 text-white p-2 border-2 border-amber-800 right-element'>Logout</button>}
      </div>
      {isAuthenticated ? (
        <div className='flex flex-row justify-between items-center'>
          <ConversationSelector conversation={conversation} setConversation={setConversation} />
          <Chat conversation={conversation} setConversation={setConversation} />
        </div>
      ) : <Auth />}
    </div>
  );
}

export default App;
