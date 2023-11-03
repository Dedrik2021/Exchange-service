<template>
	<div id="exchangario">
		<navbar-exchange :title="brandName" :items="menuItems" />
		
		<router-view />
	</div>
</template>

<script>
import NavbarExchange from './components/NavbarExchange.vue';

export default {
	name: 'App',

	components: {
		NavbarExchange
	},

	data() {
		return {
			brandName: 'Exchangario',
			menuItems: [
				{ text: 'Home', link: '/' },
				{ text: 'About', link: '/about' },
				{ text: 'FAQ', link: '/faq' },
				{ text: 'Login', link: '/login' },
				{ text: 'Register', link: '/register' },
			],
		};
	},
};
</script>

<style lang="scss">
@import 'assets/styles//variables.scss';
@import '~bulma/bulma.sass';
@import 'assets/styles/main.scss';
</style>
