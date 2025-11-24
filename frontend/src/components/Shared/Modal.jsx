function Modal({ onClose, children }) {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
				{children}
			</div>
		</div>
	);
}
export default Modal;
