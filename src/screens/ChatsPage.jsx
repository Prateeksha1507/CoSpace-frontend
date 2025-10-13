import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  fetchMyConversations,
  fetchRecentMessages,
  sendMessage,
  getMyParticipant,
  getCounterparty
} from "../api/chatAPI";
import "../styles/ChatsPage.css";
import Avatar from "../components/Avatar";

export default function ChatsPage() {
  const [me, setMe] = useState(null);          // { id, type, name }
  const [convos, setConvos] = useState([]);
  const [activeId, setActiveId] = useState(null); // NOTE: start with null (no chat open)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const threadRef = useRef(null);

  // Track viewport to know if we're in mobile mode
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 979px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // Load me + conversations (do NOT auto-open anything)
  useEffect(() => {
    (async () => {
      const myself = await getMyParticipant();
      setMe(myself);
      const list = await fetchMyConversations();
      setConvos(list);
      // no auto setActiveId
    })();
  }, []);

  // Load messages for selected convo
  useEffect(() => {
    if (!activeId) return setMessages([]);
    const msgs = fetchRecentMessages(activeId, 10);
    setMessages(msgs);
  }, [activeId]);

  // Auto-scroll to bottom when messages change
  useLayoutEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    const newMsg = await sendMessage(activeId, input.trim());
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const active = convos.find((c) => c.convoId === activeId);

  const handleSelectConvo = (id) => {
    setActiveId(id); // mobile will auto “ditch” sidebar via CSS
  };

  const handleBack = () => {
    // mobile back: close chatbox and show sidebar
    setActiveId(null);
  };

  return (
    <main
      className={[
        "chatspg",
        isMobile ? "is-mobile" : "is-desktop",
        activeId ? "has-active" : "no-active"
      ].join(" ")}
    >
      {/* LEFT: conversation list */}
      <aside className="chatspg-sidebar" aria-label="Conversation list">
        <header className="chatspg-sidebar-head">
          <h2 className="chatspg-heading">Chats</h2>
        </header>

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
              return (
                <li
                  key={c.convoId}
                  className={`chatspg-item ${activeId === c.convoId ? "active" : ""}`}
                  onClick={() => handleSelectConvo(c.convoId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && handleSelectConvo(c.convoId)
                  }
                  aria-current={activeId === c.convoId ? "true" : "false"}
                >
                  <Avatar src={other?.avatar} />
                  <div className="chatspg-item-texts">
                    <p className="chatspg-item-title">{other?.name || c.title}</p>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* RIGHT: active conversation */}
      <section className="chatspg-pane">
        {/* Mobile top bar shown only when a chat is open on mobile */}
        {isMobile && active && (
          <header className="chatspg-mobile-head">
            <button
              className="chatspg-back"
              type="button"
              onClick={handleBack}
              aria-label="Back to conversation list"
            >
              ←
            </button>
            <h1 className="chatspg-title">{active.title}</h1>
          </header>
        )}

        {/* Desktop header (or when there's an active chat and we still want title) */}
        {!isMobile && (
          <h1 className="chatspg-title">{active ? active.title : "Select a conversation"}</h1>
        )}

        {/* Empty state on desktop when no chat chosen */}
        {!isMobile && !active && (
          <div className="chatspg-empty">
            <p>Select a chat from the left to start messaging.</p>
          </div>
        )}

        {/* Thread + composer only if a chat is active */}
        {active && me && (
          <>
            <div className="chatspg-thread" ref={threadRef}>
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
              <div className="chatspg-thread-bottom-pad" />
            </div>

            <form className="chatspg-composer" onSubmit={handleSend}>
              <input
                className="chatspg-input"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Message input"
              />
              <button className="primary-btn chatspg-send" type="submit">
                Send
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
