"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createNote,
  deleteNote,
  fetchNotes,
  getProfile,
  Note,
  updateNote,
} from "@/lib/api";

export default function Home() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Note | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const filtered = useMemo(() => {
    if (!query) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  useEffect(() => {
    (async () => {
      setLoadingUser(true);
      const me = await getProfile();
      setUser(me);
      setLoadingUser(false);
    })();
  }, []);

  async function loadNotes() {
    try {
      setError(null);
      setLoading(true);
      const list = await fetchNotes(query || undefined);
      setNotes(list);
      if (list.length > 0 && !selected) {
        setSelected(list[0]);
        setEditTitle(list[0].title);
        setEditContent(list[0].content);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load notes";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNewNote() {
    setSelected({ id: "", title: "", content: "" });
    setEditTitle("");
    setEditContent("");
  }

  async function handleSave() {
    if (!user) {
      setError("Please sign in to save notes.");
      return;
    }
    try {
      setError(null);
      if (!selected || selected.id === "") {
        const created = await createNote({ title: editTitle, content: editContent });
        setNotes((prev) => [created, ...prev]);
        setSelected(created);
      } else {
        const updated = await updateNote(selected.id, {
          title: editTitle,
          content: editContent,
        });
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setSelected(updated);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save note";
      setError(msg);
    }
  }

  async function handleDelete(note: Note) {
    if (!user) {
      setError("Please sign in to delete notes.");
      return;
    }
    if (!note.id) return;
    try {
      setError(null);
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      if (selected?.id === note.id) {
        setSelected(null);
        setEditTitle("");
        setEditContent("");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete note";
      setError(msg);
    }
  }

  function selectNote(n: Note) {
    setSelected(n);
    setEditTitle(n.title);
    setEditContent(n.content);
  }

  return (
    <div className="grid gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Notes</h2>
          <p className="text-sm text-slate-500">
            {loading ? "Loading..." : `${filtered.length} notes`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a className="btn secondary" href="/auth">
            {loadingUser ? "Checking..." : user ? user.email : "Sign In / Up"}
          </a>
          <button className="btn accent" onClick={startNewNote}>
            New Note
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              className="input"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadNotes();
                }
              }}
            />
            <button className="btn secondary" onClick={loadNotes}>
              Search
            </button>
          </div>

          {error && (
            <div className="p-3 border border-rose-200 bg-rose-50 text-rose-700 rounded-md mb-3">
              {error}
            </div>
          )}

          <ul className="flex flex-col divide-y">
            {filtered.map((n) => (
              <li
                key={n.id}
                className={`py-3 cursor-pointer transition ${
                  selected?.id === n.id ? "bg-slate-50" : "hover:bg-slate-50"
                } px-2 rounded`}
                onClick={() => selectNote(n)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{n.title || "Untitled"}</p>
                    <p className="text-sm text-slate-500 truncate">
                      {n.content}
                    </p>
                  </div>
                  <button
                    className="text-rose-600 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {!loading && filtered.length === 0 && (
              <li className="py-8 text-center text-slate-500">No notes found.</li>
            )}
          </ul>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <input
              className="input"
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button className="btn secondary" onClick={() => {
                if (selected) {
                  setEditTitle(selected.title);
                  setEditContent(selected.content);
                } else {
                  setEditTitle("");
                  setEditContent("");
                }
              }}>
                Reset
              </button>
              <button className="btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
          <textarea
            className="textarea"
            placeholder="Write your note here..."
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          {!user && (
            <p className="text-xs text-slate-500 mt-2">
              Tip: Sign in to persist your notes to the backend.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
