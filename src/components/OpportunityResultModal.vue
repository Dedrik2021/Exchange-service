<template>
	<modal-exchange headerText="Opportunity Results">
		<div v-if="opportunity">
			<div class="label">
				Exchange From:
				<span>
					<router-link
						class="link"
						v-if="opportunity.fromExchangeId"
						:to="`/exchanges/${opportunity.fromExchangeId.slug}`"
					>
						{{ opportunity.fromExchangeId.title }}
					</router-link>
					<span v-else>
						{{ opportunity.price }}$
					</span>
				</span>
			</div>
			<div class="label">
				Exchange To Yours:
				<router-link class="link" :to="`/exchanges/${opportunity.toExchange.slug}`">{{
					opportunity.toExchange.title
				}}</router-link>
			</div>
		</div>
		<hr />
		<div>
			<h1>You have accepted deal with user "{{ opportunity.fromUser.username }}"</h1>
			<div class="catcher">
				Call "{{ opportunity.fromUser.username }}" on phone: <span class="phone-number">{{ opportunity.fromUser.phone }}</span>
			</div>
		</div>
		<template #activator>
			<button class="button is-block is-success is-light is-fullwidth">Details</button>
		</template>
		<template #footerButtons>
			<button class="button is-success">
                <a :href="'tel:' + opportunity.fromUser.phone" class="phone-number">Call "{{ opportunity.fromUser.username }}"</a>
                </button>
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
			type: Object,
		},
	},
};
</script>
<style scoped lang="scss">
.link {
	font-weight: 500;
	color: rgb(79, 79, 172);
	font-size: 18px;
	text-decoration: underline;
}
.label {
	font-size: 22px;
	margin: 0;
	span {
		font-weight: 400;
		font-size: 18px;
	}
}
.catcher {
	font-size: 23px;
}
.phone-number {
	font-size: 27px;
	font-weight: bold;
}
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
