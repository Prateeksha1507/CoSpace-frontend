import React, { useEffect, useState } from "react";
import {
  fetchMyConversations,
  fetchRecentMessages,
  sendMessage,
  getMyParticipant,
  getCounterparty
} from "../api/chatAPI"; // <-- make sure file name/path matches
import "../styles/ChatsPage.css";
import Avatar from "../components/Avatar";

export default function ChatsPage() {
  const [me, setMe] = useState(null);     // { id, type, name }
  const [convos, setConvos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load me + conversations
  useEffect(() => {
    (async () => {
      const myself = await getMyParticipant();
      setMe(myself);
      const list = await fetchMyConversations();
      setConvos(list);
      if (list.length > 0) setActiveId(list[0].convoId);
    })();
  }, []);

  // Load messages for selected convo
  useEffect(() => {
    if (!activeId) return;
    const msgs = fetchRecentMessages(activeId, 10);
    setMessages(msgs);
  }, [activeId]);

  // Send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    const newMsg = await sendMessage(activeId, input.trim());
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const active = convos.find((c) => c.convoId === activeId);

  return (
  <main className="chatspg">
    {/* LEFT: conversation list */}
    <aside className="chatspg-sidebar">
      <h2 className="chatspg-heading">Chats</h2>
      <ul className="chatspg-list">
        {convos.length === 0 ? (
          <li className="chatspg-item" style={{ opacity: 0.6 }}>
            <div className="chatspg-item-texts">
              <p className="chatspg-item-title">No conversations yet</p>
              <p className="chatspg-item-last">Start a new chat</p>
            </div>
          </li>
        ) : (
          convos.map((c) => {
            const other = getCounterparty(c, me);
            console.log(other)
            return (
              <li
                key={c.convoId}
                className={`chatspg-item ${activeId === c.convoId ? "active" : ""}`}
                onClick={() => setActiveId(c.convoId)}
              >
                <Avatar src={other?.avatar}
                 />
                <div className="chatspg-item-texts">
                  <p className="chatspg-item-title">{other?.name || c.title}</p>
                  {/* Optional: last message preview here */}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </aside>

      {/* RIGHT: active conversation */}
      {active && me && (
        <section className="chatspg-pane">
          <h1 className="chatspg-title">{active.title}</h1>

          <div className="chatspg-thread">
            {messages.map((m) => {
              const isMe = m.from?.id === me.id && m.from?.type === me.type;
              return (
                <div
                  key={m.id}
                  className={`chatspg-bubble-row ${isMe ? "me" : "them"}`}
                >
                  <div className={`chatspg-bubble ${isMe ? "is-me" : ""}`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form className="chatspg-composer" onSubmit={handleSend}>
            <input
              className="chatspg-input"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="primary-btn chatspg-send" type="submit">
              Send
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
