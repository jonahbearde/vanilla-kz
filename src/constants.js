const tierColors = [
	'#34a853',
	'#76ae39',
	'#b8b51f',
	'#fbbc04',
	'#fc8d03',
	'#fe2f01',
	'#ff0000',
	'#ff00ff',
	'#636e72'
]

const tierPhrases = [
	'Very Easy',
	'Easy',
	'Medium',
	'Advanced',
	'Hard',
	'Very Hard',
	'Extreme',
	'Death',
	'Hell'
]

const pointsColors = [
	'#e17055',
	'#fdcb6e',
	'#ffeaa7'
]

const levels = [
	{ rank: 'Beginner', points: 0, color: '#c5cad0' },
	{ rank: 'Amateur', points: 2000, color: '#5e98d9' },
	{ rank: 'Casual', points: 20000, color: '#bfff90' },
	{ rank: 'Regular', points: 60000, color: '#40ff40' },
	{ rank: 'Skilled', points: 100000, color: '#ba81f0' },
	{ rank: 'Expert', points: 160000, color: '#d32ce6' },
	{ rank: 'Semipro', points: 250000, color: '#d63031' },
	{ rank: 'Pro', points: 300000, color: '#d63031' },
	{ rank: 'Master', points: 400000, color: '#d63031' },
	{ rank: 'Legend', points: 600000, color: '#e4ae39' }
]

const tierNotes = [
	'Easiest maps that any player should be able to complete with only knowledge of basic CS movement and airstrafing (Should be able to W only the map).',
	'Includes maps with LJ blocks (up to 230). Players will need to know the basics of bhopping, surfing, ladders and corners.',
	"Decent understanding of LJs (up to 240), corners, ladders, surfs and bhops. No JBs above 250 (needs large space and shouldn't require a perf JB).",
	'LJs (up to 244), JBs (up to 260), LAJs, harder techs that do not require precise execution: prekeep, medium bhop walks, plekz tech, vesq tech, medium double-turn corners, etc.',
	'Tier 4 but everything harder, basic 180 JBs, JBs mid bhop, hard walks and perfs mid bhop, hard LAJs, high/far LJ blocks (up to 245) and JB blocks (up to 265).',
	'Starts to include better execution of hard techs, high block 180 JBs, easy 360s, high/far LJ blocks (up to 248), hard LJ drops, hard bhops (forced perf/walk/JB) and hard LAJs.',
	'Maps with the hardest VNL techs: high and far LJ blocks (up to 250), 180/360 JBs, very strafe heavy jumps, precise corners, death bhops.',
	"Likely requires flawless execution of every VNL tech, at least the techs that are included in the map. Only the very best players can finish maps in the category. Can't cheese for completions.",
	'Unfeasible. Technically possible but no matter how much the map is grinded, it will likely never be completed unless a new route or way is found (e.g kz_neon_portal PRO).',
]

const vnlApiBaseUrl = 'https://vnl-stats-backend.onrender.com/api/v1'
// const vnlApiBaseUrl = 'http://localhost:1337/api/v1'

const globalApiBaseUrl = 'https://kztimerglobal.com/api/v2.0'

const imageApiPrefix = 'https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/mediums/'

export {
	tierColors,
	tierPhrases,
	pointsColors,
	levels,
	tierNotes,
	globalApiBaseUrl,
	vnlApiBaseUrl,
	imageApiPrefix
}