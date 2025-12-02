import { useState } from "react";
import { Star, Loader2, X } from "lucide-react";

export default function ReviewModal({ 
    onClose, 
    onSubmit, 
    initialData, 
    isSubmitting 
}) {
    const [rating, setRating] = useState(() => initialData?.rating || 5);
    const [content, setContent] = useState(() => initialData?.content || "");
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, content });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                        {initialData ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        // UPDATED: Purple Stars
                                        className={`w-8 h-8 ${
                                            star <= (hoverRating || rating)
                                                ? "fill-purple-500 text-purple-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-gray-500 min-h-[20px]">
                            {rating === 5 ? "Tuyệt vời!" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Tệ" : "Rất tệ"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Nhận xét của bạn
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Chia sẻ cảm nghĩ của bạn về khóa học này..."
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 min-h-[120px] resize-none text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2 text-sm shadow-sm"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {initialData ? "Cập nhật" : "Gửi đánh giá"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}