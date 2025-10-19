function LoadingMessage({ text = "Đang tải..." }) {
  return <p className="text-center text-gray-500">{text}</p>;
}

export default LoadingMessage;