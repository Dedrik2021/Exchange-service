<template>
	<modal-exchange ref="modalExchange" :headerText="headerText">
		<div>
			<h1>User "{{ opportunity.fromUser.username }}" has an amazing offer for you!</h1>
			<template v-if="opportunity.fromExchangeId">
				<div class="card-image">
					<figure class="image is-4by3">
						<!-- TODO: Display Exchange Image -->
						<img :src="opportunity.fromExchangeId.image" />
					</figure>
				</div>
				<div class="info-container">
					<div class="info-heading">
						<p class="app-title">{{ opportunity.fromExchangeId.title }}</p>
						<p class="description">{{ opportunity.fromExchangeId.descr }}</p>
					</div>
					<div class="info-value">
						<div class="info-value-title">Price:</div>
						<div class="info-value-money">${{ opportunity.fromExchangeId.price }}</div>
					</div>
				</div>
			</template>
			<template v-if="opportunity.price">
				<div class="info-container">
					<div class="info-heading">
						<p class="app-title">
							"{{ opportunity.fromUser.username }}" wants to exchange price
						</p>
					</div>
					<div class="info-value">
						<div class="info-value-title">Price:</div>
						<div class="info-value-money">${{ opportunity.price }}</div>
					</div>
				</div>
			</template>
			<hr />
			<h1>For Yours...</h1>
			<div class="card-image">
				<figure class="image is-4by3">
					<!-- TODO: Display Exchange Image -->
					<img :src="opportunity.toExchange.image" />
				</figure>
			</div>
			<div class="info-container">
				<div class="info-heading">
					<p class="app-title">{{ opportunity.toExchange.title }}</p>
					<p class="description">{{ opportunity.toExchange.descr }}</p>
				</div>
				<div class="info-value">
					<div class="info-value-title">Price:</div>
					<div class="info-value-money">${{ opportunity.toExchange.price }}</div>
				</div>
			</div>
		</div>
		<template #activator >
			<button class="button is-block is-success is-light is-fullwidth">View a deal</button>
		</template>
		<template #footerButtons >
			<button @click="acceptOpportunity" class="button is-success">Accept Deal</button>
			<button @click="declineOpportunity" class="button is-danger">Decline Deal</button>
		</template>
	</modal-exchange>
</template>

<script>
import ModalExchange from '@/components/ModalExchange.vue';
export default {
	components: {
		ModalExchange,
	},
	props: {
		opportunity: {
			required: true,
			type: Object,
		}
	},

	data() {
		return {
			cond: this.condition
		}
	},

	computed: {
		modal() {
			return this.$refs.modalExchange
		},
		headerText() {
			return this.opportunity.fromExchangeId ? `Here is an offer for a ${this.opportunity.fromExchangeId.type}` : `Here is an offer for credits!`
		}
	},

	methods: {
		acceptOpportunity() {
			this.$store.dispatch('opportunity/acceptOpportunity', {
				opportunity: this.opportunity,
				onSuccess: () => console.log('close modal')
			})
		},
		declineOpportunity() {
			this.$store.dispatch('opportunity/declineOpportunity', {
				opportunity: this.opportunity,
				onSuccess: () => console.log('close modal')
			})
		},
	},

	
};
</script>
<style scoped lang="scss">
.info-container {
	display: flex;
	margin: 20px 0;
	.info-heading {
		flex: 1;
		font-size: 20px;
		padding-right: 30px;
		.app-title {
			font-weight: bold;
			font-size: 30px;
		}
	}
	.info-value {
		&-title {
			font-size: 20px;
			text-align: center;
		}
		&-money {
			font-size: 45px;
			font-weight: bold;
		}
	}
}
</style>
