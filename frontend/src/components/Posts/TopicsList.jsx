import { getAllTopis } from "@/apis/topicApi";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";

const nf = new Intl.NumberFormat("vi-VN");

export default function TopicsList() {
  const {
    data: topics,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: getAllTopis,
  });

  if (isPending) return <p>is loading .....</p>;
  if (isError) return <p> Đã xảy ra lỗi</p>;

  return (
    <aside className="md:col-span-1">
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Chuyên mục</h2>
        <ul className="space-y-2">
          {topics.length ? (
            topics.map((t) => {
              const to = t?.slug ? `/topics/${t.slug}` : "#";
              return (
                <li key={t.id ?? t.slug ?? t.name}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [
                        "block px-3 py-2 rounded-lg font-medium transition",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-700",
                      ].join(" ")
                    }
                  >
                    <span className="flex items-center justify-between">
                      <span>{t?.name ?? "Chủ đề"}</span>
                      {typeof t?.postCount === "number" && (
                        <span className="text-xs ml-3 opacity-80">
                          ({nf.format(t.postCount)})
                        </span>
                      )}
                    </span>
                  </NavLink>
                </li>
              );
            })
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
