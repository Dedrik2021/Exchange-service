<template v-if="opportunities && opportunities.length">
	<di
		v-for="opportunity in opportunities"
		:key="opportunity.id"
		class="column is-3-tablet is-6-mobile"
	>
		<div class="card">
			<div class="card-image">
				<figure v-if="opportunity.fromExchangeId" class="image is-4by3">
					<img :src="opportunity.fromExchangeId.image" />
				</figure>
				<figure v-else class="image is-4by3">
					<img :src="opportunity.toExchange.image" />
				</figure>
			</div>
			<div class="card-content">
				<div class="media">
					<div class="media-content">
						<div v-if="opportunity.fromExchangeId">
							<span>Offer: </span>
							<span>{{ opportunity.fromExchangeId.title }}</span>
						</div>
						<div v-else>
							<span>Offer: </span>
							<span>{{ opportunity.price }}$</span>
						</div>
						<div class="title is-6">
							<span>Request: </span>
							<span>{{ opportunity.title }}</span>
						</div>
						<p class="subtitle is-6">
							<span
								:class="[
									{ 'is-success': opportunity.status === 'accepted' },
									{ 'is-danger': opportunity.status === 'declined' },
									{ 'is-warning': opportunity.status === 'pending' },
								]"
								class="tag is-dark subtitle"
								>{{ opportunity.status }}</span
							>
						</p>
					</div>
				</div>
				<div class="content">
					<p v-if="opportunity.fromExchangeId">
						{{ opportunity.fromExchangeId.descr }}
					</p>
					<p v-else>User want to exchange your item for money</p>
				</div>
			</div>
			<footer class="card-footer">
				<button type="button" class="button is-block is-success is-light is-fullwidth">
					Check deal
				</button>
			</footer>
		</div>
		<br />
	</di>
</template>

<script>
export default {
	props: {
		opportunities: {
			type: Object,
			required: true,
		},
	},
};
</script>
