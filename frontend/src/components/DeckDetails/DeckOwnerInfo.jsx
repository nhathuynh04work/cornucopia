import Avatar from "../Shared/Avatar";

function DeckOwnerInfo({ owner }) {
	return (
		<div className="flex items-center justify-between py-8 border-b border-gray-200 mb-10">
			<div className="flex items-center gap-4">
				<Avatar url={owner.avatarUrl} size="md" />
				<div>
					<p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-0.5">
						Tác giả
					</p>
					<p className="text-sm font-bold text-gray-900">
						{owner.name}
					</p>
				</div>
			</div>
		</div>
	);
}

export default DeckOwnerInfo;
