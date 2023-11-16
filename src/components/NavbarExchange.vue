<template>
	<div>
		<!-- NAVBAR -->
		<header class="header">
			<nav class="navbar" :class="$route.path === '/' ? '' : 'with-background'">
				<div class="container">
					<div class="navbar-brand">
						<router-link
							class="navbar-item has-text-white is-size-2 has-text-weight-bold"
							to="/"
						>
							{{ title }}
						</router-link>
						<button
							type="button"
							tabindex="0"
							:class="{'is-active': isMenuOpen}"
							class="navbar-burger burger has-text-white"
							data-target="navbar-menu"
							@click="isMenuOpen = !isMenuOpen"
						>
							<span></span>
							<span></span>
							<span></span>
						</button>
					</div>
					<div id="navbar-menu" class="navbar-menu" :class="{'is-active': isMenuOpen}">
						<ul class="navbar-end">
							<li v-if="isAuthenticated" class="navbar-item">
								{{ user?.email }}
							</li>
							<li
								class="navbar-end__item"
								v-for="item in isLoginItems"
								:key="item.text"
							>
								<router-link class="navbar-item nav-home" :to="item.link">
									{{ item.text }}
								</router-link>
							</li>
							<div v-if="isAuthenticated" style="display: flex;">
								<li class="navbar-end__item">
									<router-link class="navbar-item nav-home" to="/exchanges/new">
										New Exchange
									</router-link>
								</li>
								<li class="navbar-end__item">
									<router-link class="navbar-item nav-home" to="/profile">
										Profile
									</router-link>
								</li>
								<li class="navbar-end__item">
									<button
										@click="() => $store.dispatch('user/logout')"
										class="button is-block is-info is-fullwidth"
										type="button"
									>
										Logout
									</button>
								</li>
							</div>
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

	data() {
		return {
			isMenuOpen: false
		}
	},

	setup() {
		const { isAuthenticated, user } = useAuth();
		return { isAuthenticated, user };
	},

	created() {
		window.addEventListener('resize', this.handleResizing)
	},

	unmounted() {
		window.removeEventListener('resize', this.handleResizing)
	},

	methods: {
		handleResizing({target}) {
			if (this.isMenuOpen && target.innerWidth > 1020) {
				this.isMenuOpen = false
			}
		}
	},

	computed: {
		isLoginItems() {
			if (this.isAuthenticated) {
				return this.items.filter(
					(item) => item.link !== '/login' && item.link !== '/register',
				);
			} else {
				return this.items;
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
