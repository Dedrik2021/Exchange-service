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
								v-model="form.image"
								class="input"
								type="text"
								placeholder="https://unsplash...."
							/>
							<form-errors :errors="v$.form.image.$errors" />
						</div>
					</div>
					<div class="field">
						<label class="label">Price</label>
						<div class="control">
							<input
								v-model="form.price"
								class="input"
								type="text"
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
								placeholder="Austria"
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
								placeholder="Wien"
							/>
							<form-errors :errors="v$.form.city.$errors" />
						</div>
					</div>

					<!-- TODO: provide tags inputs -->
					<div class="field">
						<label class="label">Tags</label>
						<div class="control">
							<input
								@input="handleTags"
								class="input"
								type="text"
								placeholder="programming. Type and push the ','"
							/>
							<form-errors :errors="v$.form.tags.$errors" />
							<ul v-if="form.tags.length">
								<li
									class="tag is-primary is-medium"
									v-for="tag in form.tags"
									:key="tag"
								>
									{{ tag }}
								</li>
							</ul>
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
import { required, minLength, minValue, helpers, numeric, url } from '@vuelidate/validators';

import useAuth from '@/composition/useAuth';
import FormErrors from '@/components/FormErrors.vue';

const setupInitialData = () => {
	return {
		type: 'product',
		title: '',
		descr: '',
		image: '',
		price: null,
		country: '',
		city: '',
		tags: [],
	};
};

export default {
	components: {
		FormErrors,
	},

	data() {
		return {
			form: setupInitialData(),
		};
	},

	validations() {
		return {
			form: {
				type: { required },
				title: {
					myCustomRequired: helpers.withMessage('Title cannot be empty!', required),
					minLength: helpers.withMessage(
						'Title length should be at least 5!',
						minLength(5),
					),
				},

				descr: { required: helpers.withMessage('Description cannot be empty!', required) },

				image: {
					required: helpers.withMessage('Image cannot be empty!', required),
					url: helpers.withMessage('The Image value is not a valid URL address!', url),
				},

				price: {
					required: helpers.withMessage('Price cannot be empty!', required),
					minValue: minValue(1),
                    numeric: helpers.withMessage(
						'Price field must be contain number signs!',
						numeric,
					),
				},

				country: { required: helpers.withMessage('Country cannot be empty!', required) },
				city: { required: helpers.withMessage('City cannot be empty!', required) },
				tags: { required: helpers.withMessage('Tags cannot be empty!', required) },
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

			if (isValid) {
                this.v$.$reset()
				this.$store.dispatch('exchange/createExchange', {
					data: this.form,
					onSuccess: () => {
						this.form = setupInitialData();
					},
				});
			}
		},

		handleTags(e) {
			const { value } = e.target;

			if (
				value &&
				value.trim().length > 1 &&
				(value.substr(-1) === ',' || value.substr(-1) === ' ')
			) {
				const _value = value.split(',')[0].trim();

				if (!this.form.tags.includes(_value)) {
					this.form.tags.push(_value);
				}
				e.target.value = '';
			}
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
