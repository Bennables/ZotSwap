import "./style.css"

export default function Main() {
  const chats = [
    { id: 1, name: "Alice", lastMessage: "Hey!", time: "3:07 PM" },
    { id: 2, name: "Bob", lastMessage: "What's up?", time: "2:38 PM" },
    { id: 3, name: "Charlie", lastMessage: "Let's meet.", time: "10:33 AM" }
  ];

  return (
    <main>
      <div className="top">
        <h1>Messaging</h1>
      </div>

      <div className="body">
        {chats.map((chat) => (
          <div key={chat.id} className="message-slot">
            <div className="name">{chat.name}</div>
            <div className="time"><h3>Teach this <br/> Learn this</h3></div>
            <div className="preview">{chat.lastMessage}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
