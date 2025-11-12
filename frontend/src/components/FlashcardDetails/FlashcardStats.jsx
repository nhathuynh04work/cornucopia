export default function FlashcardStats({ totalLists, totalCards }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
      <StatBox label="Danh sách" value={totalLists} color="text-blue-600" />
      <StatBox label="Tổng số thẻ" value={totalCards} color="text-green-600" />
      <StatBox label="Đã học" value={0} color="text-yellow-500" />
      <StatBox label="Cần ôn tập" value={0} color="text-red-500" />
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-gray-600 mt-1">{label}</p>
    </div>
  );
}
