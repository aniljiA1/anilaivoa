import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setLoading } from "../store/interactionSlice";
import { Send, CheckCircle, Clock, User, Search, Mic } from "lucide-react";
import axios from "axios";

const LogInteractionScreen = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.interaction);

  // Form States
  const [formData, setFormData] = useState({
    hcp_name: "",
    interaction_type: "Meeting",
    date: "2025-04-19",
    time: "07:36 PM",
    notes: "",
  });

  // Table State
  const [submittedLogs, setSubmittedLogs] = useState([]);
  const [userInput, setUserInput] = useState("");

  // 1. Fetch data from MySQL hcp_db
  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/interactions");
      setSubmittedLogs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 2. Handle Structured Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/log-manual", {
        hcp_name: formData.hcp_name,
        notes: formData.notes,
        interaction_type: formData.interaction_type,
      });
      alert("Interaction Logged!");
      setFormData({ ...formData, hcp_name: "", notes: "" });
      fetchLogs(); // Refresh the table
    } catch (err) {
      alert("Submission failed.");
    }
  };

  // 3. Handle AI Assistant Chat
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setUserInput("");
    dispatch(addMessage({ role: "user", content: msg }));
    dispatch(setLoading(true));

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: msg,
      });
      dispatch(addMessage({ role: "assistant", content: res.data.reply }));
      fetchLogs(); // Sync table in case AI logged data
    } catch (err) {
      dispatch(
        addMessage({ role: "assistant", content: "AI Connection Error." }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 font-inter">
      {/* TOP SECTION */}
      <div className="flex gap-6 h-[550px]">
        {/* LEFT: Structured Form */}
        <div className="w-2/3 bg-white rounded-xl border shadow-sm p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Log HCP Interaction
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                HCP Name
              </label>
              <div className="relative">
                <input
                  className="w-full border p-2 rounded bg-gray-50 pl-9 outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search or select HCP..."
                  value={formData.hcp_name}
                  onChange={(e) =>
                    setFormData({ ...formData, hcp_name: e.target.value })
                  }
                />
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Interaction Type
              </label>
              <select
                className="w-full border p-2 rounded bg-gray-50 outline-none"
                value={formData.interaction_type}
                onChange={(e) =>
                  setFormData({ ...formData, interaction_type: e.target.value })
                }
              >
                <option>Meeting</option>
                <option>Virtual Call</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded bg-gray-50"
                defaultValue={formData.date}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Time</label>
              <input
                type="time"
                className="w-full border p-2 rounded bg-gray-50"
                defaultValue="19:36"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Topics Discussed
            </label>
            <textarea
              className="w-full border p-2 rounded bg-gray-50 h-32 outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter key discussion points..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
            <p className="text-blue-500 text-xs mt-2 flex items-center gap-1 cursor-pointer">
              <Mic size={14} /> Summarize from Voice Note (Requires Consent)
            </p>
          </div>

          <button
            onClick={handleFormSubmit}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Save Interaction Log
          </button>
        </div>

        {/* RIGHT: AI Assistant */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-blue-600 flex items-center gap-2">
              🤖 AI Assistant
            </h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              Log interaction details here via chat
            </p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
            <div className="bg-cyan-50 border border-cyan-100 p-3 rounded-lg text-xs text-cyan-800 leading-relaxed">
              Log interaction details here (e.g., "Met Dr. Smith, discussed
              Prodo-X efficacy, positive sentiment, shared brochure") or ask for
              help.
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-xl text-sm max-w-[85%] ${m.role === "user" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 border text-gray-700"}`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-xs animate-pulse italic">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="relative">
              <textarea
                className="w-full border rounded-lg p-3 pr-16 bg-gray-50 resize-none h-20 text-sm outline-none"
                placeholder="Describe Interaction..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 bottom-2 bg-blue-600 text-white px-5 py-1 rounded-md text-xs font-bold"
              >
                Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: TABLE */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-500" size={18} /> Submitted
          Interactions
        </h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-500 uppercase text-[10px] font-bold">
              <th className="p-4">HCP Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Notes / Summary</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {submittedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-2 text-blue-800 font-semibold uppercase">
                  <User size={14} className="text-blue-400" /> {log.hcp_name}
                </td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">
                    {log.interaction_type}
                  </span>
                </td>
                <td className="p-4 text-gray-500 italic text-xs max-w-sm truncate">
                  {log.raw_notes || log.summary}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                    <Clock size={12} /> SYNCED TO MYSQL
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogInteractionScreen;
