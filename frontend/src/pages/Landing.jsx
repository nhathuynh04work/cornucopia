import React, { useState } from "react";
import {
	US,
	SA,
	CN,
	RU,
	IL,
	IN,
	VN,
	FR,
	DE,
	ES,
	JP,
	KR,
} from "country-flag-icons/react/3x2";
import NavButton from "@/components/NavButton";

const cards = [
	{
		id: 1,
		text: "Hello",
		country: "US",
		subtitle:
			"Welcome to Cornucopia, a place to study languages and have fun while doing it",
		button: "Start exploring",
		style: "bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 border-4 border-violet-600 shadow-2xl",
	},
	{
		id: 2,
		text: "مرحبا",
		country: "SA",
		subtitle:
			"مرحبًا بكم في كورنوكوبيا، مكان لتعلم اللغات والاستمتاع أثناء ذلك",
		button: "ابدأ الاستكشاف",
		style: "bg-fuchsia-300/80 border-2 border-dashed border-fuchsia-500 shadow-xl",
	},
	{
		id: 3,
		text: "你好",
		country: "CN",
		subtitle: "欢迎来到Cornucopia，一个学习语言并享受乐趣的地方",
		button: "开始探索",
		style: "bg-purple-300/90 border-2 border-purple-400 shadow-lg",
	},
	{
		id: 4,
		text: "Привет",
		country: "RU",
		subtitle:
			"Добро пожаловать в Cornucopia, место для изучения языков и веселья",
		button: "Начать изучение",
		style: "bg-indigo-300/70 border-4 border-dashed border-indigo-500 shadow-xl",
	},
	{
		id: 5,
		text: "שלום",
		country: "IL",
		subtitle: "ברוכים הבאים ל-Cornucopia, מקום ללמוד שפות וליהנות תוך כדי",
		button: "התחל לחקור",
		style: "bg-violet-200/90 border-2 border-solid border-violet-500 shadow-md",
	},
	{
		id: 6,
		text: "नमस्ते",
		country: "IN",
		subtitle:
			"Cornucopia में आपका स्वागत है, भाषाएँ सीखने और मज़े करने की जगह",
		button: "अन्वेषण शुरू करें",
		style: "bg-fuchsia-200/80 border-2 border-dashed border-fuchsia-400 shadow-lg",
	},
	{
		id: 7,
		text: "Bonjour",
		country: "FR",
		subtitle:
			"Bienvenue à Cornucopia, un endroit pour apprendre les langues et s'amuser",
		button: "Commencer l'exploration",
		style: "bg-gradient-to-tr from-purple-400 via-pink-300 to-indigo-400 border-4 border-dotted border-purple-500 shadow-2xl",
	},
	{
		id: 8,
		text: "Hallo",
		country: "DE",
		subtitle:
			"Willkommen bei Cornucopia, ein Ort, um Sprachen zu lernen und Spaß zu haben",
		button: "Erkunden starten",
		style: "bg-fuchsia-300/80 border-2 border-solid border-fuchsia-500 shadow-lg",
	},
	{
		id: 9,
		text: "Hola",
		country: "ES",
		subtitle:
			"Bienvenido a Cornucopia, un lugar para estudiar idiomas y divertirse mientras lo hace",
		button: "Comenzar a explorar",
		style: "bg-purple-200/80 border-2 border-dashed border-purple-400 shadow-md",
	},
	{
		id: 10,
		text: "こんにちは",
		country: "JP",
		subtitle: "Cornucopiaへようこそ、言語を学び楽しむ場所",
		button: "探検を始める",
		style: "bg-indigo-200/70 border-4 border-solid border-indigo-400 shadow-xl",
	},
	{
		id: 11,
		text: "안녕하세요",
		country: "KR",
		subtitle: "Cornucopia에 오신 것을 환영합니다. 언어를 배우고 즐기는 곳",
		button: "탐험 시작",
		style: "bg-gradient-to-b from-violet-100 to-fuchsia-200 border-2 border-dotted border-violet-300 shadow-lg",
	},
	{
		id: 12,
		text: "Xin chào",
		country: "VN",
		subtitle:
			"Chào mừng đến với Cornucopia, nơi bạn có thể học ngôn ngữ và vui chơi",
		button: "Bắt đầu khám phá",
		style: "bg-fuchsia-100/70 border-4 border-solid border-fuchsia-300 shadow-2xl",
	},
];

const flagComponents = { US, SA, CN, RU, IL, IN, VN, FR, DE, ES, JP, KR };

const highlightCornucopia = (text) => {
	const parts = text.split(/(Cornucopia|كورنوكوبيا)/);
	return parts.map((part, idx) =>
		/Cornucopia|كورنوكوبيا/.test(part) ? (
			<span
				key={idx}
				className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-500 bg-clip-text text-transparent font-semibold">
				{part}
			</span>
		) : (
			part
		)
	);
};

function Landing() {
	const [hoveredCard, setHoveredCard] = useState(null);

	const topCards = cards.slice(0, 6);
	const bottomCards = cards.slice(6);

	const defaultText = "Xin chào";
	const defaultSubtitle =
		"Chào mừng đến với Cornucopia, nơi bạn có thể học ngôn ngữ và vui chơi";
	const defaultButton = "Bắt đầu khám phá";
	const defaultFlag = "VN";

	const overlap = 32;

	return (
		<div className="relative h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden">
			{/* Top cards */}
			<div className="relative h-96">
				<div className="absolute top-[-30%] flex left-[-10%]">
					{topCards.map((c, idx) => (
						<div
							key={c.id}
							onMouseEnter={() => setHoveredCard(c)}
							style={{
								marginLeft: idx === 0 ? 0 : -overlap,
								zIndex: idx + 1,
							}}
							className={`
                ${c.style} w-80 h-96 rounded-3xl flex items-center justify-center text-4xl font-bold text-white text-center
                transform -translate-y-24 hover:translate-y-0 transition-transform duration-300 cursor-pointer -rotate-180
              `}>
							{c.text}
						</div>
					))}
				</div>
			</div>

			{/* Header */}
			<header className="z-20 text-center flex flex-col items-center gap-4">
				<h1 className="text-4xl font-semibold text-gray-700 font-mono flex items-center gap-3">
					{hoveredCard ? hoveredCard.text : defaultText}
					<div className="w-24 h-14 overflow-hidden transform transition-all duration-300 ease-out hover:scale-110 shadow-lg rounded-lg border">
						{React.createElement(
							flagComponents[
								hoveredCard ? hoveredCard.country : defaultFlag
							],
							{
								title: hoveredCard
									? hoveredCard.text
									: defaultText,
								className: "w-full h-full object-cover",
							}
						)}
					</div>
				</h1>
				<p className="text-gray-600 text-md">
					{highlightCornucopia(
						hoveredCard ? hoveredCard.subtitle : defaultSubtitle
					)}
				</p>

				<div className="flex gap-4 mt-4 overflow-hidden px-12">
					<NavButton
						to="/signup"
						className="px-4 py-2 text-sm font-medium text-purple-500 border !border-purple-600 rounded hover:bg-purple-100 transition truncate">
						{hoveredCard ? hoveredCard.button : defaultButton}
					</NavButton>
				</div>
			</header>

			{/* Bottom cards */}
			<div className="relative h-96">
				<div className="absolute bottom-[-30%] flex left-[-10%]">
					{bottomCards.map((c, idx) => (
						<div
							key={c.id}
							onMouseEnter={() => setHoveredCard(c)}
							style={{
								marginLeft: idx === 0 ? 0 : -overlap,
								zIndex: idx + 1,
							}}
							className={`
                ${c.style} w-80 h-96 rounded-3xl flex items-center justify-center text-4xl font-bold text-white text-center
                transform translate-y-24 hover:translate-y-0 transition-transform duration-300 cursor-pointer
              `}>
							{c.text}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Landing;
