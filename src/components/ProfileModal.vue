<template>
	<div>
		<button @click="isOpen = true" class="button is-block is-success is-light is-fullwidth">
			Update Info
		</button>
		<div :class="['modal', { 'is-active': isOpen }]">
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">User Profile</p>
					<button @click="isOpen = false" class="delete" aria-label="close"></button>
				</header>
				<section class="modal-card-body">
					<form>
						<div class="field">
							<label class="title">Username</label>
							<input class="input" v-model="userProfile.username" />
							<form-errors :errors="v$.userProfile.username.$errors" />
						</div>
						<div class="field">
							<label class="title">Avatar</label>
							<input class="input" v-model="userProfile.avatar" />
							<form-errors :errors="v$.userProfile.avatar.$errors" />
						</div>
						<div class="field">
							<label class="title">Info about user</label>
							<input class="input" v-model="userProfile.info" />
							<form-errors :errors="v$.userProfile.info.$errors" />
						</div>
						<div class="field">
							<label class="title">Address</label>
							<input class="input" v-model="userProfile.address" />
							<form-errors :errors="v$.userProfile.address.$errors" />
						</div>
						<div class="field">
							<label class="title">Country</label>
							<input class="input" v-model="userProfile.country" />
							<form-errors :errors="v$.userProfile.country.$errors" />
						</div>
						<div class="field">
							<label class="title">Phone</label>
							<input class="input" v-model="userProfile.phone" />
							<form-errors :errors="v$.userProfile.phone.$errors" />
						</div>
					</form>
				</section>
				<footer class="modal-card-foot">
					<button @click="updateProfile" type="button" class="button is-success">
						Save changes
					</button>
					<button @click="isOpen = false" class="button">Cancel</button>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, numeric, minLength, maxLength } from '@vuelidate/validators';

import FormErrors from './FormErrors.vue';
import { supportedFileType } from '@/helpers/validators';

export default {
	components: {
		FormErrors,
	},

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	setup() {
		return { v$: useVuelidate() };
	},

	data() {
		return {
			isOpen: false,
			userProfile: { ...this.user },
		};
	},

	validations() {
		return {
			userProfile: {
				username: {
					required: helpers.withMessage('UserName field cannot be empty!', required),
				},
				avatar: {
					required: helpers.withMessage('Image cannot be empty!', required),
					supportedFileType: helpers.withMessage(
						'The Image field value is not a valid URL address!',
						supportedFileType,
					),
				},
				info: {
					required: helpers.withMessage('Info field cannot be empty!', required),
				},
				address: {
					required: helpers.withMessage('Address field cannot be empty!', required),
				},
				country: {
					required: helpers.withMessage('Country field cannot be empty!', required),
				},
				phone: {
					required: helpers.withMessage('Phone field cannot be empty!', required),
					numeric: helpers.withMessage(
						'Phone field must be contain number signs!',
						numeric,
					),
					maxLength: helpers.withMessage(
						'Phone field must be contain max 9 number characters!',
						maxLength(9),
					),
					minLength: helpers.withMessage(
						'Phone field must be contain min 9 number characters!',
						minLength(9),
					),
				},
			},
		};
	},

	methods: {
		async updateProfile() {
			const isValid = await this.v$.$validate();

			if (isValid) {
				this.$store.dispatch('user/updateProfile', {
					data: this.userProfile,
					onSuccess: () => (this.isOpen = false),
				});
			}
		},
	},
};
</script>
