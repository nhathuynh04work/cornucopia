import { MessageCircle } from 'lucide-react';

// 1. Using initials and the soft purple palette
const dummyComments = [
    {
        id: 'c1',
        author: 'Alice Johnson',
        initials: 'AL',
        time: '2 hours ago',
        content: "This test looks really comprehensive! I'm excited to try it out.",
    },
    {
        id: 'c2',
        author: 'Bob Smith',
        initials: 'BS',
        time: 'Yesterday',
        content: "I hope the questions cover the recent module updates. Good luck, everyone!",
    },
];

// Reusable Avatar Component using your soft purple
function Avatar({ initials }) {
    return (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-sm font-medium text-purple-700">{initials}</span>
        </div>
    );
}

function TestCommentsSection() {
    return (
        <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="px-6 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-gray-700" /> Discussion
                </h2>

                {/* Comment Input Placeholder */}
                <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <textarea
                        className="w-full p-2 text-gray-800 border-b border-gray-300 focus:outline-none focus:border-purple-500 resize-y"
                        rows="3"
                        placeholder="Join the discussion..."
                    ></textarea>
                    <div className="flex justify-end mt-3">
                        {/* 2. Changed to a secondary button style */}
                        <button className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                            Post Comment
                        </button>
                    </div>
                </div>

                {/* List of Comments */}
                <div className="space-y-6">
                    {dummyComments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            {/* 3. Using the new soft avatar */}
                            <Avatar initials={comment.initials} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-gray-900">
                                        {comment.author}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {comment.time}
                                    </p>
                                </div>
                                <p className="text-gray-800 leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TestCommentsSection;