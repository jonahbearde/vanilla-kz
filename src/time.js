function formatTime(seconds) {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = (seconds % 60).toFixed(3)

	const timeParts = []

	if (hours > 0) {
		timeParts.push(hours.toString().padStart(2, '0'))
	}

	if (minutes > 0 || hours > 0) {
		timeParts.push(minutes.toString().padStart(2, '0'))
	}

	timeParts.push(remainingSeconds.padStart(6, '0'))

	return timeParts.join(':')
}

export default formatTime