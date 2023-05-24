<template>
	<svg class="w-[200px] h-[200px] m-auto">
		<circle :cx="circlePositions[index] && circlePositions[index].x"
			:cy="circlePositions[index] && circlePositions[index].y" :r="item.radius" :fill="item.color"
			v-for="(item, index) in circles" :key="index" />
	</svg>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const CENTER_X = 100;
const CENTER_Y = 100;
const RADIUS = 60;

function positionOnCircle(radius, angle, center) {
	return {
		x: center.x + (radius * Math.cos(toRadians(angle))),
		y: center.y + (radius * Math.sin(toRadians(angle)))
	};
};

function toRadians(angle) {
	return angle * Math.PI / 180;
};

function calculatePositions() {
	let angleIncrement = 360 / circles.value.length;
	let positions = {};
	circles.value.forEach((circle, index) => {
		positions[index] = positionOnCircle(
			RADIUS,
			angleIncrement * index,
			{ x: CENTER_X, y: CENTER_Y }
		)
	});
	return positions;
}

// const circles = ref([
// 	{ color: '#E0F2F1', radius: 0 },
// 	{ color: '#B2DFDB', radius: 0 },
// 	{ color: '#80CBC4', radius: 0 },
// 	{ color: '#4DB6AC', radius: 0 },
// 	{ color: '#26A69A', radius: 0 },
// 	{ color: '#00897B', radius: 0 },
// 	{ color: '#00796B', radius: 0 },
// 	{ color: '#00695C', radius: 0 },
// 	{ color: '#004D40', radius: 0 },
// ]);

const circles = ref([
	{color: '#7e967d', radius: 0},
	{color: '#7d977c', radius: 0},
	{color: '#7b997a', radius: 0},
	{color: '#779a76', radius: 0},
	{color: '#6e9b6d', radius: 0},
	{color: '#689b67', radius: 0},
	{color: '#619c60', radius: 0},
	{color: '#599c57', radius: 0},
	{color: '#398637', radius: 0},
	{color: '#2e7f2c', radius: 0},
	{color: '#267324', radius: 0},
	{color: '#1e641c', radius: 0},
	{color: '#196317', radius: 0},
	{color: '#10570f', radius: 0},
	{color: '#0c540b', radius: 0},
	{color: '#085506', radius: 0},
])

const counter = ref(0);

const interval = ref(null);

const circlePositions = computed(calculatePositions);


interval.value = setInterval(() => {
	counter.value++;
	circles.value = circles.value.map((item, index) => ({
		...item,
		radius: (counter.value + index) % 8
	}))
}, 70);

onUnmounted(() => {
	clearInterval(interval.value);
})

</script>
<!-- 
<style scoped>
.loading-spinner {
	width: 200px;
	height: 200px;
}
</style> -->