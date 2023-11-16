<template>
	<div id="exchangario">
		<hero-exchange />
		<exchange-list :exchanges="exchanges" />

		<pagination-exchange :onNextPage="getMorExchanges" :isFetching="isFetchingMoreData" :page="currentPage" />
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
			return this.$store.state.exchange.items;
		},
		isFetchingMoreData() {
			return this.$store.state.exchange.pagination.isFetchingData;
		},
		currentPage() {
			return this.$store.getters['exchange/currentPage']
		}
	},

	created() {
		this.$store.dispatch('exchange/getExchanges');
	},

	methods: {
		getMorExchanges({ page }) {
			this.$store.dispatch('exchange/getMoreExchanges', { page });
		},
	},
};
</script>
