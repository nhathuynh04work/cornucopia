import { Link } from "react-router-dom";
import Logo from "@/components/Shared/Logo";
import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-react";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerSections = [
		{
			title: "Sản phẩm",
			links: [
				{ label: "Tính năng", href: "/features" },
				{ label: "Khóa học", href: "/courses" },
				{ label: "Bộ thẻ Flashcards", href: "/decks" },
				{ label: "Bảng giá", href: "/pricing" },
			],
		},
		{
			title: "Tài nguyên",
			links: [
				{ label: "Blog", href: "/blog" },
				{ label: "Hướng dẫn sử dụng", href: "/help" },
				{ label: "Cộng đồng", href: "/community" },
				{ label: "FAQ", href: "/faq" },
			],
		},
		{
			title: "Công ty",
			links: [
				{ label: "Về chúng tôi", href: "/about" },
				{ label: "Tuyển dụng", href: "/careers" },
				{ label: "Liên hệ", href: "/contact" },
				{ label: "Điều khoản", href: "/terms" },
			],
		},
	];

	return (
		<footer className="bg-white border-t border-gray-100 pt-16 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
					{/* Brand Section (Takes up 2 columns on large screens) */}
					<div className="lg:col-span-2 space-y-6">
						<Link to="/" className="inline-block">
							<Logo textSize="text-2xl" />
						</Link>
						<p className="text-gray-500 text-sm leading-relaxed max-w-xs">
							Cornucopia là nền tảng học tập toàn diện, mang đến
							sự phong phú về tri thức và công cụ giúp bạn chinh
							phục mọi mục tiêu giáo dục.
						</p>
						<div className="flex items-center gap-4">
							<a
								href="#"
								className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
								<Facebook className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
								<Instagram className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
								<Github className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Links Sections */}
					{footerSections.map((section, idx) => (
						<div key={idx} className="lg:col-span-1">
							<h3 className="font-bold text-gray-900 mb-4">
								{section.title}
							</h3>
							<ul className="space-y-3">
								{section.links.map((link, linkIdx) => (
									<li key={linkIdx}>
										<Link
											to={link.href}
											className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* Newsletter / CTA (Optional 1 column) */}
					<div className="lg:col-span-1">
						<h3 className="font-bold text-gray-900 mb-4">
							Liên hệ
						</h3>
						<div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
							<Mail className="w-4 h-4" />
							<span>support@cornucopia.com</span>
						</div>
						<p className="text-xs text-gray-400 mt-4">
							Đăng ký nhận tin để không bỏ lỡ các cập nhật mới
							nhất.
						</p>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-sm text-gray-400">
						© {currentYear} Cornucopia Inc. All rights reserved.
					</p>
					<div className="flex gap-6 text-sm text-gray-400">
						<Link
							to="/privacy"
							className="hover:text-purple-600 transition-colors">
							Chính sách bảo mật
						</Link>
						<Link
							to="/cookies"
							className="hover:text-purple-600 transition-colors">
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
