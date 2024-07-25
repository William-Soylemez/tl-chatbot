import Chat from "./Chat"


function App() {
  return (
    <div className='h-screen bg-amber-300 p-5'>
      <img src={'/logo.png'} alt='TL Logo' className='mx-auto w-32 mb-5' />
      <Chat />
    </div>
  );
}

export default App;
