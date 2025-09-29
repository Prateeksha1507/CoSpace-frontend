import React, { useState } from "react";
import "../styles/ChatsPage.css";

const conversations = [
  {
    id: "cleanup",
    title: "Community Cleanup Drive",
    last: "Hi there!",
    avatar: "/images/org-cleanup.png",
    messages: [
      { id: 1, from: "org", name: "Organization", text: "Hi  there!", time: "now" },
      { id: 2, from: "me", name: "Sophia Clark", text: "Hello!", time: "now" },
    ],
  },
  {
    id: "foodbank",
    title: "Food Bank Assistance",
    last: "Thanks for your help!",
    avatar: "/images/org-foodbank.png",
    messages: [],
  },
  {
    id: "env",
    title: "Environmental Awareness",
    last: "Great job today!",
    avatar: "/images/org-env.png",
    messages: [],
  },
  {
    id: "donation",
    title: "Donation Recipient",
    last: "Received your donation.",
    avatar: "/images/org-donation.png",
    messages: [],
  },
  {
    id: "ethan",
    title: "Ethan Carter",
    last: "Welcome to the team!",
    avatar: "/images/ethan.png",
    messages: [],
  },
];

export default function ChatsPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [input, setInput] = useState("");

  const active = false //   conversations.find((c) => c.id === activeId)!;

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    active.messages.push({
      id: Date.now(),
      from: "me",
      name: "Sophia Clark",
      text: input.trim(),
      time: "now",
    });
    setInput("");
  };

  return (
    <main className="chatspg">
      {/* Left: conversation list */}
      <aside className="chatspg-sidebar">
        <h2 className="chatspg-heading">Chats</h2>
        <ul className="chatspg-list">
          {conversations.map((c) => (
            <li
              key={c.id}
              className={`chatspg-item ${activeId === c.id ? "active" : ""}`}
              onClick={() => setActiveId(c.id)}
            >
              <img className="chatspg-avatar" src={c.avatar} alt={c.title} />
              <div className="chatspg-item-texts">
                <p className="chatspg-item-title">{c.title}</p>
                <p className="chatspg-item-last">
                  <span>Last message: </span>
                  {c.last}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Right: active conversation */}
      <section className="chatspg-pane">
        <h1 className="chatspg-title">{active.title}</h1>

        <div className="chatspg-thread">
          {active.messages.map((m) => (
            <div
              key={m.id}
              className={`chatspg-bubble-row ${m.from === "me" ? "me" : "them"}`}
            >
              {m.from !== "me" && (
                <div className="chatspg-label">{m.name}</div>
              )}
              <div className={`chatspg-bubble ${m.from === "me" ? "is-me" : ""}`}>
                {m.text}
              </div>
              {m.from === "me" && (
                <div className="chatspg-label me">{m.name}</div>
              )}
            </div>
          ))}
        </div>

        {/* Composer */}
        <form className="chatspg-composer" onSubmit={send}>
          <input
            className="chatspg-input"
            placeholder="Type  a message...   Hello"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="chatspg-emoji" type="button" title="Emoji">😊</button>
          <button className="primary-btn chatspg-send" type="submit">Send</button>
        </form>
      </section>
    </main>
  );
}
