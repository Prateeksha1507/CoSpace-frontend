import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  listMyConversations,
  listMessages,
  createOrGetChat,
  sendMessage as apiSendMessage,
  getOtherParticipant
} from "../api/chatAPI";
import { getCurrentActorDocument } from "../api/authAPI";
import { fetchOrgById } from "../api/orgAPI";
import "../styles/ChatsPage.css";
import Avatar from "../components/Avatar";

export default function ChatsPage() {
  const [me, setMe] = useState(null);             // { id, type }
  const [convos, setConvos] = useState([]);       // { ...chat, convoId, title, lastMessageAt, __temp? }
  const [activeId, setActiveId] = useState(null); // may be "temp:ORG_ID"
  const [messages, setMessages] = useState([]);   // { id, from:{id,type}, text, at }
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const threadRef = useRef(null);

  /* ---------------- utils ---------------- */

  const isTempId = (id) => String(id).startsWith("temp:");

  function normalizeMessage(m) {
    return {
      id: m._id,
      from: {
        id: String(m.sender),
        type: m.senderKind === "Organization" ? "org" : "user",
      },
      text: m.encryptedText,
      at: m.at,
    };
  }

  // “Other” participant (name/avatar) using me’s identity for correctness
  function pickCounterparty(chat, actorMe) {
    if (!chat?.participantsDetailed || !actorMe) {
      return { name: chat?.title || "Conversation", avatar: null, raw: null };
    }
    const myKind = actorMe.type === "org" ? "Organization" : "User";
    const meId = String(actorMe.id);

    const other =
      chat.participantsDetailed.find(
        (p) => !(p.kind === myKind && String(p.ref) === meId)
      ) || chat.participantsDetailed[0];

    const profile = other?.profile || {};
    return {
      name: profile.name || profile.username || chat.title || "Conversation",
      avatar: profile.profilePicture || null,
      raw: other || null,
      _id: profile._id
    };
  }

  // Sort newest first (by lastActivityAt)
  function sortConvosNewestFirst(list) {
    return [...list].sort(
      (a, b) => new Date(b.lastActivityAt || 0) - new Date(a.lastActivityAt || 0)
    );
  }

  // Unread check: compare my lastReadAt vs chat.lastMessageAt (fallback: lastActivityAt)
  function isUnread(chat, actorMe) {
    if (!chat || !actorMe) return false;

    const myKind = actorMe.type === "org" ? "Organization" : "User";
    const meId = String(actorMe.id);

    const mine = (chat.participantsDetailed || []).find(
      (p) => p.kind === myKind && String(p.ref) === meId
    );
    const lastReadAt = new Date(mine?.lastReadAt || 0);
    const lastMsgAt = new Date(chat.lastMessageAt || chat.lastActivityAt || 0);

    return lastMsgAt > lastReadAt;
  }

  /* ---------------- responsive ---------------- */

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 979px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  /* ---------------- initial load: me + convos (+ phantom if ?org=) ---------------- */

  useEffect(() => {
    (async () => {
      const myself = await getCurrentActorDocument(); // { id, type }
      setMe(myself);

      const list = await listMyConversations({ hydrate: true });

      // Normalize + compute lastMessageAt from projection (messages:$slice:-1 gives [0])
      let normalized = list.map((chat) => {
        const lastMessageAt =
          (Array.isArray(chat.messages) && chat.messages.length > 0
            ? chat.messages[0]?.at
            : null) || chat.lastActivityAt || 0;

        const { name } = pickCounterparty(chat, myself);

        return {
          ...chat,
          convoId: chat._id,
          title: name,
          lastMessageAt,
          lastActivityAt: chat.lastActivityAt || lastMessageAt || 0,
        };
      });
      normalized = sortConvosNewestFirst(normalized);

      const params = new URLSearchParams(window.location.search);
      const orgId = params.get("org");

      if (orgId) {
        const found = normalized.find((c) =>
          c.participantsDetailed?.some(
            (p) => p.kind === "Organization" && String(p.ref) === String(orgId)
          )
        );
        if (found) {
          setConvos(normalized);
          setActiveId(found.convoId);
        } else {
          // phantom chat (only local until first message)
          const org = await fetchOrgById(orgId).catch(() => null);
          const nowISO = new Date().toISOString();
          const phantom = {
            _id: `temp:${orgId}`,
            convoId: `temp:${orgId}`,
            title: (org?.name || org?.username || "Conversation"),
            participantsDetailed: [
              { kind: "Organization", ref: orgId, profile: org || {}, lastReadAt: new Date(0).toISOString() },
            ],
            messages: [],
            lastActivityAt: nowISO,
            lastMessageAt: 0,
            __temp: { recipientKind: "Organization", recipientId: orgId },
          };
          setConvos(sortConvosNewestFirst([phantom, ...normalized]));
          setActiveId(phantom.convoId);
        }
      } else {
        setConvos(normalized);
      }
    })();
  }, []);

  /* ---------------- load messages for selected convo ---------------- */

  useEffect(() => {
    (async () => {
      if (!activeId) return setMessages([]);
      if (isTempId(activeId)) {
        setMessages([]);
        return;
      }
      const batch = await listMessages(activeId, { limit: 30 });
      const normalized = batch
        .map(normalizeMessage)
        .sort((a, b) => new Date(a.at) - new Date(b.at));
      setMessages(normalized);
    })();
  }, [activeId]);

  /* ---------------- polling: live updates + keep list order/unread ---------------- */

  useEffect(() => {
    if (!activeId) return;
    let alive = true;

    const tick = async () => {
      try {
        // Real chats only
        if (!isTempId(activeId)) {
          const batch = await listMessages(activeId, { limit: 30 });
          if (!alive) return;

          const next = batch
            .map(normalizeMessage)
            .sort((a, b) => new Date(a.at) - new Date(b.at));

          // Update messages only if changed
          const prev = messages;
          const prevKey = prev.length ? `${prev[prev.length - 1].id}|${prev.length}` : `|0`;
          const nextKey = next.length ? `${next[next.length - 1].id}|${next.length}` : `|0`;
          if (prevKey !== nextKey) setMessages(next);

          // Bump convo order + unread state
          setConvos((prev) => {
            const idx = prev.findIndex((c) => c.convoId === activeId);
            if (idx === -1) return prev;

            const lastAt = next.length
              ? next[next.length - 1].at
              : (prev[idx].lastMessageAt || prev[idx].lastActivityAt);

            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              lastActivityAt: lastAt,
              lastMessageAt: lastAt,
              messages: [{ at: lastAt }],
            };

            // mark as read locally since user is viewing it
            if (me && updated[idx].participantsDetailed) {
              const myKind = me.type === "org" ? "Organization" : "User";
              const meId = String(me.id);
              updated[idx] = {
                ...updated[idx],
                participantsDetailed: updated[idx].participantsDetailed.map((p) =>
                  p.kind === myKind && String(p.ref) === meId
                    ? { ...p, lastReadAt: new Date().toISOString() }
                    : p
                ),
              };
            }

            return sortConvosNewestFirst(updated);
          });
        }
      } catch {
        /* ignore transient errors */
      }
    };

    const initial = setTimeout(tick, 300);
    const interval = setInterval(tick, 3000);

    return () => {
      alive = false;
      clearTimeout(initial);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, me, messages.length]);

  /* ---------------- autoscroll ---------------- */

  useLayoutEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ---------------- send message (phantom → real, then send) ---------------- */

  const handleSend = async (e) => {
    e.preventDefault();
    const raw = input?.trim();
    if (!raw || !activeId || !me) return;

    // optimistic bubble
    const optimistic = {
      id: `tmp-${Date.now()}`,
      from: { id: me.id, type: me.type },
      text: raw,
      at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    try {
      let realChatId = activeId;

      if (isTempId(activeId)) {
        const phantom = convos.find((c) => c.convoId === activeId);
        const { recipientKind, recipientId } = phantom?.__temp || {};
        const { chatId } = await createOrGetChat({ recipientKind, recipientId });

        // swap temp id → real id in list and keep list sorted
        setConvos((prev) =>
          sortConvosNewestFirst(
            prev.map((c) =>
              c.convoId === activeId ? { ...c, convoId: chatId, _id: chatId } : c
            )
          )
        );
        setActiveId(chatId);
        realChatId = chatId;
      }

      await apiSendMessage(realChatId, { text: raw });

      // refresh messages after send
      const fresh = await listMessages(realChatId, { limit: 30 });
      const normalized = fresh
        .map(normalizeMessage)
        .sort((a, b) => new Date(a.at) - new Date(b.at));
      setMessages(normalized);

      // update conversation’s last times + mark read locally
      setConvos((prev) => {
        const idx = prev.findIndex((c) => c.convoId === realChatId);
        if (idx === -1) return prev;

        const lastAt =
          normalized.length ? normalized[normalized.length - 1].at : new Date().toISOString();

        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          lastActivityAt: lastAt,
          lastMessageAt: lastAt,
          messages: [{ at: lastAt }],
        };

        if (me && updated[idx].participantsDetailed) {
          const myKind = me.type === "org" ? "Organization" : "User";
          const meId = String(me.id);
          updated[idx] = {
            ...updated[idx],
            participantsDetailed: updated[idx].participantsDetailed.map((p) =>
              p.kind === myKind && String(p.ref) === meId
                ? { ...p, lastReadAt: new Date().toISOString() }
                : p
            ),
          };
        }

        return sortConvosNewestFirst(updated);
      });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  /* ---------------- selection + mobile back ---------------- */

  const active = convos.find((c) => c.convoId === activeId);

  const handleSelectConvo = (id) => {
    setActiveId(id);
    // mark as read locally when opening
    setConvos((prev) => {
      const idx = prev.findIndex((c) => c.convoId === id);
      if (idx === -1 || !me) return prev;

      const myKind = me.type === "org" ? "Organization" : "User";
      const meId = String(me.id);

      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        participantsDetailed: (updated[idx].participantsDetailed || []).map((p) =>
          p.kind === myKind && String(p.ref) === meId
            ? { ...p, lastReadAt: new Date().toISOString() }
            : p
        ),
      };
      return updated;
    });
  };

  const handleBack = () => {
    setActiveId(null);
  };

  /* ---------------- render (DOM/CSS preserved; added anchors for profile links) ---------------- */

  return (
    <section
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
              const { name, avatar, raw, _id } = pickCounterparty(c, me);
              const unread = isUnread(c, me);

              const isOrg = raw?.kind === "Organization";
              const targetId = String(raw?.ref || "");
              const profileHref = isOrg
                ? `/profile/org/${targetId}`
                : `/profile/user/${targetId}`;

              return (
                <li
                  key={c.convoId}
                  className={`chatspg-item ${activeId === c.convoId ? "active" : ""} ${unread ? "unread" : ""}`}
                  onClick={() => handleSelectConvo(c.convoId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && handleSelectConvo(c.convoId)
                  }
                  aria-current={activeId === c.convoId ? "true" : "false"}
                  aria-label={unread ? "Unread conversation" : undefined}
                  title={unread ? "Unread messages" : undefined}
                >
                  {/* Avatar links to profile, without triggering row selection */}
                  <a href={profileHref} onClick={(e) => e.stopPropagation()} tabIndex={-1}>
                    <Avatar src={avatar} backup={_id} />
                  </a>

                  <div className="chatspg-item-texts">
                    {/* Name links to profile, without triggering row selection */}
                    <p className="chatspg-item-title">
                      {name || c.title}
                    </p>
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

        {/* Desktop header */}
        {!isMobile && (
          <h1 className="chatspg-title">{active ? active.title : "Select a conversation"}</h1>
        )}

        {/* Empty state on desktop when no chat chosen */}
        {!isMobile && !active && (
          <div className="chatspg-empty">
            <p>Select a chat from the left to start messaging.</p>
          </div>
        )}

        {/* Thread + composer */}
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
    </section>
  );
}
