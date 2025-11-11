import React from "react";
import Bubble from "./Bubble.jsx";
import CitationItem from "./CitationItem.jsx";

export default function AssistantMessage({ content, citations }) {
  return (
    <div className="space-y-2">
      <Bubble role="assistant">{content}</Bubble>
      {Array.isArray(citations) && citations.length > 0 && (
        <div className="ml-2 text-sm text-gray-600 space-y-1">
          {citations.map((c, i) => (
            <CitationItem key={i} c={c} idx={i} />
          ))}
        </div>
      )}
    </div>
  );
}
