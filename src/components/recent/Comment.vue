<template>
	<div>
		<div class="flex items-baseline gap-2">
			<p class="text-lg font-medium">{{ comment.user_name }}</p>
			<p class="italic text-gray-400">{{ localDate(comment.updated_on) }}</p>
			<div v-if="props.user && comment.user_id === props.user.id" class="flex gap-4 px-1 text-xs">
				<i @click="onEdit(comment)" class="fa-solid fa-pen cursor-pointer"></i>
				<i @click="deleteComment(props.newsId, comment)" class="fa-solid fa-trash cursor-pointer"></i>
			</div>
		</div>
		<form v-if="editing" @submit.prevent="saveComment(props.newsId, comment)">
			<input type="text" v-model="commentToSave"
				class="max-h-20 w-full text-start outline-none bg-yellow-100 dark:bg-black border border-slate-300 rounded-md p-1 my-1">
		</form>
		<p v-else>{{ comment.content }}</p>
	</div>
</template>

<script setup>
import {ref} from 'vue'
import { toRefs } from '@vueuse/core';
import localDate from '../../date';
import axiosClient from '../../axios';


const props = defineProps({
	comment: {
		type: Object,
		required: true
	},
	user: {
		type: Object,
		default: null
	},
	newsId: {
		type: Number,
		required: true
	}
})

const emits = defineEmits(['onCommentChange'])

const { comment } = toRefs(props)

const commentToSave = ref(null)

const editing = ref(false)

function onEdit() {
	editing.value = true
	commentToSave.value = props.comment.content
}

async function saveComment(){
	try {
		editing.value = false

		await axiosClient.put(`/articles/comments/${props.newsId}`, {
			id: props.comment.id,
			content: commentToSave.value,
			user_id: props.comment.user_id,
			user_name: props.comment.user_name,
			updated_on: new Date().toISOString()
		})
		
		emits('onCommentChange')
	} catch (error) {
		console.log(error)
	}
}

async function deleteComment(){
	if (confirm('do you want to delete this comment?')) {
		try {
			await axiosClient.delete(`/articles/comments/${props.newsId}/${props.comment.id}`)

			emits('onCommentChange')
		} catch (error) {
			console.log(error)
		}
	}
}

</script>