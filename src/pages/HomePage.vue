<template>
	<div id="exchangario">
		<hero-exchange :onSearch="filterExchanges" />
		<exchange-list :exchanges="exchanges" />

		<pagination-exchange
			:onNextPage="getMorExchanges"
			:isFetching="isFetchingMoreData"
			:page="currentPage"
		/>
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

	data() {
		return {
			searchExchangeTitle: ""
		}
	},

	computed: {
		exchanges() {
			return this.$store.getters['exchange/filterExchanges'](this.searchExchangeTitle)
		},
		isFetchingMoreData() {
			return this.$store.state.exchange.pagination.isFetchingData;
		},
		currentPage() {
			return this.$store.getters['exchange/currentPage'];
		},
	},

	created() {
		this.$store.dispatch('exchange/getExchanges');
	},

	methods: {
		getMorExchanges({ page }) {
			this.$store.dispatch('exchange/getMoreExchanges', { page });
		},
		filterExchanges(searchValue) {
			this.searchExchangeTitle = searchValue
		},
	},
};
</script>
