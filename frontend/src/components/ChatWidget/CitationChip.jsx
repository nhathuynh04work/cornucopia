import { BookOpen, FileText, CircleHelp } from "lucide-react";
import { Link } from "react-router";

function getIconByType(type) {
  switch (type) {
    case "course":
      return BookOpen;
    case "test":
      return CircleHelp;
    case "post":
      return FileText;
    default:
      return BookOpen;
  }
}

export default function CitationChip({ citation }) {
  const Icon = getIconByType(citation.type);

  return (
    <Link
      to={citation.url}
      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all shadow-sm max-w-full"
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{citation.title}</span>
    </Link>
  );
}
