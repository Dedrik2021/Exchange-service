<template>
	<div class="page-wrapper">
		<div class="container">
			<div class="form-container">
				<form @submit.prevent="createExchange">
					<div class="field">
						<label class="label">Type</label>
						<div class="control">
							<div class="select">
								<select v-model="form.type">
									<option value="service">Service</option>
									<option value="product">Product</option>
								</select>
							</div>
						</div>
					</div>
					<div class="field">
						<label class="label">Title</label>
						<div class="control">
							<input
								v-model="form.title"
								class="input"
								type="text"
								placeholder="Some Nice Product"
							/>
							<form-errors :errors="v$.form.title.$errors" />
						</div>
					</div>
					<div class="field">
						<label class="label">Description</label>
						<div class="control">
							<textarea
								v-model="form.descr"
								class="textarea"
								placeholder="Some catchy description about product"
							>
							</textarea>
							<form-errors :errors="v$.form.descr.$errors" />
						</div>
					</div>
					<div class="field">
						<label class="label">Image Link</label>
						<div class="control">
							<input
								v-model="form.imageUrl"
								class="input"
								type="text"
								placeholder="https://unsplash...."
							/>
							<form-errors :errors="v$.form.imageUrl.$errors" />
						</div>
					</div>
					<div class="field">
						<label class="label">Price</label>
						<div class="control">
							<input
								v-model="form.price"
								class="input"
								type="number"
								placeholder="249"
							/>
							<form-errors :errors="v$.form.price.$errors" />
						</div>
					</div>
					<div class="field">
						<label class="label">Country</label>
						<div class="control">
							<input
								v-model="form.country"
								class="input"
								type="text"
								placeholder="Slovakia"
							/>
							<form-errors :errors="v$.form.country.$errors" />
						</div>
					</div>
					<div class="field">
						<label class="label">City</label>
						<div class="control">
							<input
								v-model="form.city"
								class="input"
								type="text"
								placeholder="Bratislava"
							/>
							<form-errors :errors="v$.form.city.$errors" />
						</div>
					</div>

					<!-- TODO: provide tags inputs -->
					<div class="field">
						<label class="label">Tags</label>
						<div class="control">
							<input class="input" type="text" placeholder="programming" />
						</div>
					</div>
					<div class="field is-grouped">
						<div class="control">
							<button type="submit" class="button is-link">Submit</button>
						</div>
						<div class="control">
							<button class="button is-text">Cancel</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, minValue, helpers } from '@vuelidate/validators';

import useAuth from '@/composition/useAuth';
import FormErrors from '@/components/FormErrors.vue';
import {supportedFileType} from '@/helpers/validators'

export default {
	components: {
		FormErrors,
	},

	data() {
		return {
			form: {
				type: 'product',
				title: '',
				descr: '',
				imageUrl: '',
				price: null,
				country: '',
				city: '',
				tags: [{ tag: '' }],
			},
		};
	},

	validations() {
		return {
			form: {
				type: { required },
				title: {
					myCustomRequired: helpers.withMessage('Title cannot be empty!', required),
					minLength: helpers.withMessage(
						'Title length should be at least 10!',
						minLength(10),
					),
				},

				descr: { required: helpers.withMessage('Description cannot be empty!', required) },

				imageUrl: {
					required: helpers.withMessage('Image cannot be empty!', required),
					// url,
                    supportedFileType: helpers.withMessage('The Image value is not a valid URL address!', supportedFileType)
				},

				price: {
					required: helpers.withMessage('Price cannot be empty!', required),
					minValue: minValue(1),
				},

				country: { required: helpers.withMessage('Country cannot be empty!', required) },
				city: { required: helpers.withMessage('City cannot be empty!', required) },
				tags: { required },
			},
		};
	},

	setup() {
		const { isProcessing, isAuthenticated, user } = useAuth();
		return { isProcessing, isAuthenticated, user, v$: useVuelidate() };
	},

	watch: {
		isAuthenticated(isAuth) {
			if (!isAuth) this.$router.push('/');
		},
	},

	methods: {
		async createExchange() {
			const isValid = await this.v$.$validate();

			if (isValid) console.log(this.form);
		},
	},
};
</script>

<style scoped>
.form-container {
	max-width: 960px;
	margin: 0 auto;
	margin-top: 40px;
}
.tag {
	margin: 3px;
}
</style>
