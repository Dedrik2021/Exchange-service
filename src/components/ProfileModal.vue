<template>
	<modal-exchange :onModalSubmit="updateProfile" ref="modalExchange">
		<form>
			<div class="field">
				<label class="title">Username</label>
				<input class="input" v-model="userProfile.username" />
				<form-errors :errors="v$.userProfile.username.$errors" />
			</div>
			<div class="field">
				<label class="title">Avatar</label>
				<div v-if="inProgress !== 100" class="progress-container">
					<progress v-if="inProgress !== 0" class="progress" :value="progress" max="100"/>
					<span v-if="inProgress !== 0">{{ Math.floor(progress) }}%</span>
				</div>
				<span v-if="inProgress === 100">File uploaded</span>
				<div class="file has-name">
					<label class="file-label">
						<input @input="handleUpload" class="file-input" type="file" name="resume" />
						<span class="file-cta">
							<span class="file-icon">
								<font-awesome-icon icon="upload" />
							</span>
							<span class="file-label"> Choose a file… </span>
						</span>
					</label>
					<img v-if="userProfile.avatar" class="image-preview" :src="userProfile.avatar" width="100" height="50" alt="">
				</div>
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

		<template #activator>
			<button class="button is-block is-primary is-light is-fullwidth">Update Profile</button>
		</template>
	</modal-exchange>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, numeric, minLength, maxLength, url } from '@vuelidate/validators';

import FormErrors from './FormErrors.vue';

import ModalExchange from './ModalExchange.vue';

export default {
	components: {
		FormErrors,
		ModalExchange,
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
			userProfile: { ...this.user },
			progress: 0
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
					url: helpers.withMessage(
						'The Image field value is not a valid URL address!',
						url,
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

	computed: {
		modal() {
			return this.$refs.modalExchange;
		},
		inProgress() {
			return this.progress
		}
	},

	methods: {
		async updateProfile() {
			const isValid = await this.v$.$validate();

			if (isValid) {
				this.$store.dispatch('user/updateProfile', {
					data: this.userProfile,
					onSuccess: () => this.modal.closeModal(),
				});
			}
		},

		handleUpload({target}) {
			const self = this
			const file = target.files[0]
			const reader = new FileReader()
			reader.readAsArrayBuffer(file)

			reader.onload = function() {
				self.progress = reader.result
				self.$store.dispatch('user/uploadImage', {
					bytes: reader.result,
					username: self.userProfile.username,
					name: file.name,
					
					onSuccess: (url) => {
						self.userProfile.avatar = url
					},
					onProgress: (progress) => {
						self.progress = progress
						console.log(self.progress);
					}
				})
			}
		}
	},
};
</script>


<style scoped>
.progress {
	margin-top: 15px;
	max-width: 90%;
}
.progress-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>