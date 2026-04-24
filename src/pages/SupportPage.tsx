import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Send, Clock } from "lucide-react";
import {
  addTicketReply,
  createSupportTicket,
  getUserSupportTickets,
  SupportTicket,
} from "../services/storage";
import { useStorageSync } from "../hooks/useStorageSync";

export const SupportPage = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: userTickets } = useStorageSync(
    "pesolend_support_tickets",
    getUserSupportTickets,
    1000,
  );

  const tickets = useMemo(
    () => [...userTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [userTickets],
  );

  const selectedTicket: SupportTicket | null = useMemo(() => {
    if (!selectedTicketId) {
      return tickets[0] ?? null;
    }
    return tickets.find((t) => t.id === selectedTicketId) ?? tickets[0] ?? null;
  }, [tickets, selectedTicketId]);

  useEffect(() => {
    if (!selectedTicketId && tickets.length > 0) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  const handleCreateTicket = () => {
    if (!subject.trim() || !newMessage.trim()) return;

    const ticket = createSupportTicket({
      subject: subject.trim(),
      message: newMessage.trim(),
    });

    if (ticket) {
      setSelectedTicketId(ticket.id);
      setSubject("");
      setNewMessage("");
    }
  };

  const handleReply = () => {
    if (!selectedTicket || !replyText.trim() || selectedTicket.status === "Resolved") return;
    addTicketReply(selectedTicket.id, "user", replyText.trim());
    setReplyText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Support Chat</h1>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Start New Support Message</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Send a message and admin will see it instantly.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (e.g., Payment issue)"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Describe your concern"
              rows={4}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateTicket}
              disabled={!subject.trim() || !newMessage.trim()}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Send to Admin
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              My Tickets ({tickets.length})
            </h3>
            <div className="space-y-2">
              {tickets.length === 0 ? (
                <div className="card text-center py-8">
                  <MessageCircle size={28} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No messages yet</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTicket?.id === ticket.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-800 dark:text-white truncate">{ticket.subject}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{ticket.status}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 card"
          >
            {!selectedTicket ? (
              <div className="text-center py-16">
                <MessageCircle size={40} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Select a ticket to open chat</p>
              </div>
            ) : (
              <>
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedTicket.subject}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Status: {selectedTicket.status}
                  </p>
                </div>

                <div className="mb-4 max-h-80 overflow-y-auto space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-xs text-gray-500 mb-1">You • {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    <p className="text-gray-800 dark:text-gray-200">{selectedTicket.message}</p>
                  </div>

                  {selectedTicket.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-3 rounded-lg ${
                        reply.from === "admin"
                          ? "bg-green-50 dark:bg-green-900/20"
                          : "bg-blue-50 dark:bg-blue-900/20"
                      }`}
                    >
                      <p className="text-xs text-gray-500 mb-1">
                        {reply.from === "admin" ? "Admin" : "You"} • {new Date(reply.timestamp).toLocaleString()}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">{reply.message}</p>
                    </div>
                  ))}
                </div>

                {selectedTicket.status !== "Resolved" ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleReply()}
                      placeholder="Type message"
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock size={16} /> This ticket is resolved.
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
