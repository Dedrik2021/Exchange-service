<template>
	<div>
		<!-- NAVBAR -->
		<header class="header">
			<nav class="navbar" :class="$route.path === '/' ? '' : 'with-background'">
				<div class="container">
					<div class="navbar-brand">
						<a
							class="navbar-item has-text-white is-size-2 has-text-weight-bold"
							href="#"
						>
							{{ title }}
						</a>
						<span
							role="button"
							tabindex="0"
							class="navbar-burger burger has-text-white"
							data-target="navbar-menu"
						>
							<span></span>
							<span></span>
							<span></span>
						</span>
					</div>
					<div id="navbar-menu" class="navbar-menu">
						<ul class="navbar-end">
							<li v-if="isAuthenticated" class="navbar-item">
								{{user?.email}}
							</li>
							<li class="navbar-end__item" v-for="item in isLoginItems" :key="item.text">
								<router-link class="navbar-item nav-home" :to="item.link">
									{{ item.text }}
								</router-link>
							</li>
							<li v-if="isAuthenticated" class="navbar-end__item">
								<button @click="() => $store.dispatch('user/logout')" class="button is-block is-info is-fullwidth" type="button">Logout</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
		<!-- NAVBAR END -->
	</div>
</template>

<script>
import useAuth from '@/composition/useAuth';
export default {
	props: {
		title: {
			type: String,
			required: true,
		},

		items: {
			type: Array,
			required: true,
		},
	},

	setup() {
		const { isAuthenticated, user } = useAuth();
		return { isAuthenticated, user };
	},


	computed: {
		isLoginItems() {
			if (this.isAuthenticated) {
				return this.items.filter((item) => item.link !== '/login' && item.link !== '/register')
			} else {
				return this.items
			}
		}
	},
};
</script>

<style lang="scss" scoped>
.navbar-end {
	align-items: center;
	justify-content: center;
}
</style>
