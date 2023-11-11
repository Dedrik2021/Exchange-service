<template>
	<modal-exchange :onModalSubmit="createOpportunity" :isDisabled="!isAllowedPrice">
		<div class="deal">
			<div class="deal-highlight">{{ exchange.user.username }}'s Offer</div>
			<div class="deal-wrapper">
				<div>Offering {{ exchange.type }}</div>
				<div>{{ exchange.title }}</div>
			</div>
			<div class="deal-highlight">Your Offer</div>
			<div class="counter-offer">
				<div class="field">
					Would you prefer to exchange credit ?
					<label class="checkbox is-large">
						<input v-model="isPriceExchange" type="checkbox" />
						Yes
					</label>
				</div>
				<div class="field">
					<label class="label">How Much Credit ?</label>
					<div class="control">
						<input
							:disabled="!isPriceExchange"
							v-model="selectedPrice"
							class="input"
							type="number"
							placeholder="40"
						/>
						<i> You don't have enough of credit {{ selectedPrice }} </i>
					</div>
				</div>
				<div class="field">
					<label class="label">Exchange</label>
					<div class="control">
						<div class="select">
							<select v-model="selectedExchange" :disabled="isPriceExchange">
								<option
									v-for="exchange in availableExchanges"
									:key="exchange.slug"
									:value="exchange"
								>
									{{ exchange.title }}
								</option>
							</select>
						</div>
					</div>
				</div>
				<div v-if="offeredPrice">
					<span>Your price is: </span>
					<span class="deal-highlight">{{ offeredPrice }} $</span>
				</div>
				<div v-if="priceDifferenceText" :class="percentageDifferenceClass" class="price">
					{{ priceDifferenceText }}
				</div>
				<div v-if="percentageDifference">
					Allowed difference is not less than {{ ALLOWED_PRICE_DIFFERENCE }}%
				</div>
			</div>
		</div>
		<template #activator>
			<button class="button is-fullwidth is-large is-danger is-outlined m-b-sm">
				Make a deal
			</button>
		</template>
	</modal-exchange>
</template>

<script>
import ModalExchange from './ModalExchange.vue';
import useAuth from '../composition/useAuth';

export default {
	components: {
		ModalExchange,
	},

	props: {
		exchange: {
			type: Object,
			required: true,
		},

		availableExchanges: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			selectedPrice: null,
			isPriceExchange: false,
			selectedExchange: null,
			ALLOWED_PRICE_DIFFERENCE: 20,
		};
	},

	setup() {
		const { isAuthenticated } = useAuth();
		return { isAuthenticated };
	},

	computed: {
		offeredPrice() {
			if (this.isPriceExchange) {
				return this.selectedPrice;
			} else if (this.selectedExchange) {
				return this.selectedExchange.price;
			}

			return null;
		},

		percentageDifference() {
			if (this.offeredPrice === null || this.offeredPrice === '') return null;
			const priceDifference = this.offeredPrice - this.exchange.price;
			return (priceDifference / this.exchange.price) * 100;
		},

		priceDifferenceText() {
			if (this.percentageDifference === null) return '';
			if (this.percentageDifference === 0) return 'You are offering the exact same amount!';

			const roundPrecentageDiff = Math.round(this.percentageDifference * 100) / 100;
			const differenceText = this.percentageDifference > 0 ? 'higher' : 'lower';

			return `Offered price is ${Math.abs(
				roundPrecentageDiff,
			)}% ${differenceText} than exchange price`;
		},

		isAllowedPrice() {
			if (!this.offeredPrice) return false;
			return (
				this.percentageDifference <= this.ALLOWED_PRICE_DIFFERENCE &&
				this.percentageDifference >= -this.ALLOWED_PRICE_DIFFERENCE
			);
		},

		percentageDifferenceClass() {
			return this.isAllowedPrice ? 'price-allowed' : 'price-declined';
		},
	},

	watch: {
		isAuthenticated(isAuth) {
			if (!isAuth) this.$router.push('/');
		},

		isPriceExchange(value) {
			if (value) this.selectedExchange = null;
			else this.selectedPrice = null;
		},
	},

	methods: {
		createOpportunity() {
			console.log('ok');
		},
	},
};
</script>

<style scoped lang="scss">
.price {
	padding: 7px;
	&-allowed {
		background-color: #cdeacd;
	}
	&-declined {
		background-color: #ffc2c2;
	}
}
.deal-wrapper {
	margin-bottom: 10px;
}
.counter-offer,
.deal-wrapper {
	border: 2px solid grey;
	padding: 10px;
	margin-top: 10px;
	&-title {
		font-size: 21px;
		margin: 5px 0;
		font-weight: bold;
	}
}
.deal {
	font-size: 19px;
	&-highlight {
		font-size: 19px;
		font-weight: bold;
	}
}
.disabled {
	&.field {
		input,
		textarea,
		select {
			pointer-events: none;
			color: grey;
		}
		label {
			color: grey;
		}
	}
}
</style>
