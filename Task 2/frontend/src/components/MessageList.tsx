import type { Message } from "../types";

function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function MessageList({ messages }: { messages: Message[] }) {
    const sorted = [...messages].sort(
        (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );

    if (messages.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Messages</h3>
                <p className="text-sm text-gray-500">No messages.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <span className="text-xs text-gray-400">{messages.length} total</span>
            </div>
            <ul className="divide-y divide-gray-100">
                {sorted.map((msg) => (
                    <li key={msg.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start gap-3">
                            {!msg.read && (
                                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                            )}
                            {msg.read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                        {msg.from}
                                    </p>
                                    <span className="text-xs text-gray-400 shrink-0">
                                        {formatTime(msg.receivedAt)}
                                    </span>
                                </div>
                                <p
                                    className={`text-sm mt-0.5 ${msg.read ? "text-gray-500" : "text-gray-900 font-medium"}`}
                                >
                                    {msg.subject}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                    {msg.preview}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
