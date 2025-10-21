import { Link } from "react-router";

export default function TopicSidebar({ topics = [] }) {
  return (
    <aside className="md:col-span-1">
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Chuyên mục</h2>
        <ul className="space-y-2">
          {topics.length ? (
            topics.map((t) => (
              <li key={t.id}>
                <Link
                  to={`/topics/${t.slug}`}
                  className="block px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition"
                >
                  <span className="flex items-center justify-between">
                    <span>{t.name}</span>
                    {typeof t.postCount === "number" && (
                      <span className="text-xs text-blue-600 ml-3">
                        ({t.postCount})
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-400 text-sm italic">
              Chưa có chủ đề nào.
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}
