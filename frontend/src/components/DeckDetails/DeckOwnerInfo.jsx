import { Link } from "react-router";
import Avatar from "../Shared/Avatar";

function DeckOwnerInfo({ owner }) {
	return (
		<div className="flex items-center justify-between py-8 border-b border-gray-200 mb-10">
			<div className="flex items-center gap-4">
				<Link to={`/profile/${owner.id}`}>
					<Avatar url={owner?.avatarUrl} name={owner?.name} size="md" />
				</Link>
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
