export default function LoadingScreen({ text = "Đang tải dữ liệu..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin text-4xl text-blue-400 mb-2">🌀</div>
      <p className="text-lg text-gray-500">{text}</p>
    </div>
  );
}
