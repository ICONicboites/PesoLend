import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, CheckCircle2, Clock } from "lucide-react";
import { getAllSupportTickets, addTicketReply, updateTicketStatus, isAdmin, SupportTicket } from "../services/storage";

export const AdminSupport = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }

    loadTickets();
  }, [navigate]);

  const loadTickets = () => {
    const allTickets = getAllSupportTickets();
    const activeTickets = allTickets.filter(t => t.status !== 'Resolved');
    setTickets(activeTickets);
    if (activeTickets.length > 0 && !selectedTicket) {
      setSelectedTicket(activeTickets[0]);
    }
  };

  const handleReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    setLoading(true);
    setTimeout(() => {
      addTicketReply(selectedTicket.id, 'admin', replyText);
      setReplyText("");
      loadTickets();
      
      const updatedTicket = getAllSupportTickets().find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
      setLoading(false);
    }, 500);
  };

  const handleStatusChange = (newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, newStatus);
    loadTickets();
    
    const updatedTicket = getAllSupportTickets().find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Support Tickets ({tickets.length})
          </h1>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No Active Tickets
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              All support tickets have been resolved!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin")}
              className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Tickets
              </h2>
              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <motion.button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTicket?.id === ticket.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {ticket.status === 'Open' && (
                        <Clock size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                      )}
                      {ticket.status === 'In Progress' && (
                        <Clock size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                      )}
                      {ticket.status === 'Resolved' && (
                        <CheckCircle2 size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white truncate">
                          {ticket.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {ticket.userName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Ticket Details */}
            {selectedTicket && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 card"
              >
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {selectedTicket.subject}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        From: {selectedTicket.userName} ({selectedTicket.userEmail})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {(['Open', 'In Progress', 'Resolved'] as const).map((status) => (
                        <motion.button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedTicket.status === status
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {status}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Messages */}
                <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
                  {/* Original Message */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {selectedTicket.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {selectedTicket.userName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(selectedTicket.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedTicket.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {selectedTicket.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          reply.from === 'admin'
                            ? 'bg-green-100 dark:bg-green-900'
                            : 'bg-blue-100 dark:bg-blue-900'
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            reply.from === 'admin'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {reply.from === 'admin' ? 'A' : selectedTicket.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {reply.from === 'admin' ? 'Admin' : selectedTicket.userName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300">
                            {reply.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'Resolved' && (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReply}
                      disabled={!replyText.trim() || loading}
                      className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <Send size={20} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
