import { Link } from "react-router-dom";
import { Github, Mail } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-white border-t border-gray-200 mt-auto">
			<div className="w-5/6 mx-auto px-6 py-12">
				{/* Increased gap to move columns apart */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
					{/* Brand Column */}
					<div className="col-span-1">
						<Logo />
						<p className="mt-4 text-sm text-gray-500 leading-relaxed">
							Trao quyền cho người học ngôn ngữ với các công cụ
							tương tác, khóa học và nội dung từ cộng đồng.
						</p>

						{/* License Info Added Here */}
						<div className="mt-8 pt-6 border-t border-gray-100 space-y-1">
							<p className="text-xs text-gray-500 font-medium">
								© {currentYear} Cornucopia Inc.
							</p>
							<p className="text-xs text-gray-400">
								Giấy phép MXH số: 382/GP-BTTTT cấp ngày
								12/09/2024.
							</p>
							<p className="text-xs text-gray-400">
								Địa chỉ: Tầng 5, Tòa nhà TechHub, Quận 1,
								TP.HCM.
							</p>
						</div>
					</div>

					{/* Quick Links - Added padding-left to move it to the right */}
					<div className="md:pl-12">
						<h4 className="font-semibold text-gray-900 mb-4">
							Nền tảng
						</h4>
						<ul className="space-y-3 text-sm">
							<li>
								<Link
									to="/courses"
									className="text-gray-600 hover:text-purple-600 transition-colors">
									Khóa học
								</Link>
							</li>
							<li>
								<Link
									to="/tests"
									className="text-gray-600 hover:text-purple-600 transition-colors">
									Bài kiểm tra
								</Link>
							</li>
							<li>
								<Link
									to="/flashcards"
									className="text-gray-600 hover:text-purple-600 transition-colors">
									Flashcards
								</Link>
							</li>
							<li>
								<Link
									to="/blog"
									className="text-gray-600 hover:text-purple-600 transition-colors">
									Blog
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter / Social */}
					<div>
						<h4 className="font-semibold text-gray-900 mb-4">
							Kết nối
						</h4>
						<div className="flex space-x-4 mb-6">
							<a
								href="https://github.com/nhathuynh04work/cornucopia"
								target="_blank"
								rel="noreferrer"
								className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all">
								<Github className="w-5 h-5" />
							</a>
							<a
								href="mailto:contact@cornucopia.com"
								className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all">
								<Mail className="w-5 h-5" />
							</a>
						</div>
						<p className="text-xs text-gray-400">
							Đăng ký nhận bản tin để nhận các mẹo học tập mới
							nhất.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
