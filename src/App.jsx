import { useState } from "react";
import Chat from "./Chat"
import ConversationSelector from "./ConversationSelector";
import { useAuth } from "./AuthProvider";
import Auth from "./Auth";
import Button from "./Button";


function App() {
  const [conversation, setConversation] = useState(null);

  const { isAuthenticated, logout } = useAuth();

  return (
    <div className='min-h-screen h-auto bg-amber-300 p-5'>
      <div className="flex flex-row items-center max-w-4xl mx-auto">
        <img src={'/logo.png'} alt='TL Logo' className='mx-auto w-32 mb-5' />
        {isAuthenticated &&
          <Button onClick={() => {
            logout();
            setConversation(null);
          }}
            className='bg-amber-800 text-white p-2 border-2 border-amber-800 right-element'
          >
            Logout
          </Button>
        }
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
