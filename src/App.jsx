import { useState } from "react";
import Chat from "./Chat"
import ConversationSelector from "./ConversationSelector";


function App() {
  const [conversation, setConversation] = useState(null);

  return (
    <div className='h-screen bg-amber-300 p-5'>
      <img src={'/logo.png'} alt='TL Logo' className='mx-auto w-32 mb-5' />
      <div className='flex flex-row justify-between items-center'>
        <ConversationSelector conversation={conversation} setConversation={setConversation} />
        <Chat conversation={conversation} setConversation={setConversation} />
      </div>
    </div>
  );
}

export default App;
