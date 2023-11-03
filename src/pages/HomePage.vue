<template>
	<div id="exchangario">
		<hero-exchange />
		<exchange-list :exchanges="exchanges" />
		
		<pagination-exchange />
	</div>
</template>

<script>

import HeroExchange from '../components/HeroExchange.vue';
import ExchangeList from '../components/ExchangeList.vue';
import PaginationExchange from '../components/PaginationExchange.vue';

export default {
	components: {
		ExchangeList,
		PaginationExchange,
		HeroExchange,
	},
	
	computed: {
		exchanges() {
			return this.$store.state.exchange.items
		}
	},

	created() {
		this.$store.dispatch('exchange/getExchanges')
	},

	methods: {
		
	}
};
</script>

