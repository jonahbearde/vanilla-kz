/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: 'class',
	theme: {
		flexGrow: {
			"2":2,
			"3":3,
			"4":4,
		},
		extend: {
			colors: {
				'stats-primary': '#f7f1e3',
				'stats-secondary': '#F8EFBA',
			},
			fontFamily: {
				Raleway: ['Raleway', 'sans-serif'],
				Mulish: ['Mulish', 'sans-serif']
			},
			container: {
				padding: '2rem',
				center: true
			},
			screens: {
				sm: "640px",
				md: "768px",
			}
		},
	},
	plugins: [],
}
