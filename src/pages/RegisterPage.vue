<template>
	<div class="page-wrapper">
		<div class="container has-text-centered">
			<div class="column is-4 is-offset-4">
				<h3 class="title has-text-grey">Register</h3>
				<div class="box">
					<form @submit.prevent="register">
						<div class="field">
							<div class="control">
								<label for="email"></label>
								<input
									id="email"
									v-model="form.email"
									class="input is-large"
									type="email"
									placeholder="Email"
									autocomplete="email"
								/>
								<form-errors :errors="v$.form.email.$errors" />
							</div>
						</div>
						<div class="field">
							<div class="control">
								<label for="username"></label>
								<input
									id="username"
									v-model="form.username"
									class="input is-large"
									type="text"
									placeholder="Username"
								/>
								<form-errors :errors="v$.form.username.$errors" />
							</div>
						</div>
						<div class="field">
							<div class="control">
								<label for="password"></label>
								<input
									id="password"
									v-model="form.password"
									class="input is-large"
									type="password"
									placeholder="Password"
									autocomplete="current-password"
								/>
								<form-errors :errors="v$.form.password.$errors" />
							</div>
						</div>
						<div class="field">
							<div class="control">
								<label for="repeat-password"></label>
								<input
									v-model="form.confirmPassword"
									class="input is-large"
									id="repeat-password"
									type="password"
									placeholder="Repeat the password"
								/>
								<form-errors :errors="v$.form.confirmPassword.$errors" />
							</div>
						</div>
						<button
							:disabled="isProcessing"
							type="submit"
							class="button is-block is-info is-large is-fullwidth"
						>
							Sign Up
						</button>
					</form>
				</div>
				<p class="has-text-grey">
					<a>Sign In With Google</a>&nbsp; <a>Sign Up</a>&nbsp;·&nbsp;
					<a href="../">Need Help?</a>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
// import { mapState } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers, email, sameAs } from '@vuelidate/validators';

import useAuth from '../composition/useAuth';
import FormErrors from '@/components/FormErrors.vue';

export default {
	components: {
		FormErrors,
	},

	data() {
		return {
			form: {
				email: '',
				username: '',
				password: '',
				confirmPassword: '',
			},
		};
	},

	validations() {
		return {
			form: {
				email: {
					required: helpers.withMessage('Email cannot be empty!', required),
					email: helpers.withMessage('Email is not valid!', email),
				},
				username: {
					required: helpers.withMessage('UserName cannot be empty!', required),
					minLength: helpers.withMessage(
						'UserName length should be at least 5!',
						minLength(5),
					),
				},
				password: {
					required: helpers.withMessage('Password cannot be empty!', required),
					minLength: helpers.withMessage(
						'Password length should be at least 10 and contain num and letters!',
						minLength(10),
					),
				},
				confirmPassword: {
					required: helpers.withMessage('Password cannot be empty!', required),
					sameAs: helpers.withMessage(
						'The Repeat Password value must be equal to the Password value!',
						sameAs(this.form.password),
					),
				},
			},
		};
	},

	setup() {
		const { error, isProcessing, isAuthenticated } = useAuth();
		return { error, isProcessing, isAuthenticated, v$: useVuelidate() };
	},

	watch: {
		// error(message) {
		// 	if (message) console.log(message);
		// },

		// isProcessing(processing, prevProcessing) {
		// 	if (!processing && prevProcessing && !this.error) {
		// 		this.$router.push('/')
		// 	}
		// }

		isAuthenticated(isAuth) {
			if (isAuth) this.$route.push('/');
		},
	},

	methods: {
		async register() {
			const isValid = await this.v$.$validate();
			if (isValid) this.$store.dispatch('user/register', this.form);
		},
	},

	// computed: mapState('user', {
	// 	error: ({ register }) => register.error,
	// 	isProcessing: ({ register }) => register.isProcessing,

	// 	// error() {
	// 	// 	return this.$store.state.user.register.error;
	// 	// },

	// 	// isProcessing() {
	// 	// 	return this.$store.state.user.register.isProcessing;
	// 	// },
	// }),
};
</script>

<style scoped>
/* Left formatting  */
/* .form-error {
      text-align: initial;
    } */
.hero.is-success {
	background: #f2f6fa;
}
.hero .nav,
.hero.is-success .nav {
	-webkit-box-shadow: none;
	box-shadow: none;
}
.box {
	margin-top: 1rem;
}
.avatar {
	margin-top: -70px;
	padding-bottom: 20px;
}
.avatar img {
	padding: 5px;
	background: #fff;
	border-radius: 50%;
	-webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
	box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
input {
	font-weight: 300;
}
p {
	font-weight: 700;
}
p.subtitle {
	padding-top: 1rem;
}
</style>
