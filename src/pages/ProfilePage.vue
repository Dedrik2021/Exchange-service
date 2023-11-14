<template>
	<div class="page-wrapper">
		<div class="columns">
			<div class="container profile">
				<div class="section profile-heading">
					<div class="columns is-mobile is-multiline">
						<div class="column is-2">
							<figure class="image header-icon user-profile-image">
								<img class="is-rounded" :src="user?.avatar" />
							</figure>
						</div>
						<div class="column is-4-tablet is-10-mobile name">
							<div class="user-info">
								<p>
									<span class="title is-bold">{{ user?.username }}</span>
									<br />
								</p>
								<p class="tagline">{{ user?.info }}</p>
							</div>
							<profile-modal :user="user" />
						</div>
						<div
							@click="selectedOpportunities = 'received'"
							:class="{'is-active': selectedOpportunities === 'received'}"
							class=" stats-tab stats-tab-interactive column is-2-tablet is-4-mobile has-text-centered"
						>
							<p class="stat-val">Received</p>
							<p class="stat-key">{{ opportunities.length }} Opportunities</p>
						</div>
						<div
							@click="selectedOpportunities = 'sent'"
							:class="{'is-active': selectedOpportunities === 'sent'}"
							class="stats-tab stats-tab-interactive column is-2-tablet is-4-mobile has-text-centered"
						>
							<p class="stat-val">Sent </p>
							<p class="stat-key"> {{ sendOpportunities.length }} Opportunities</p>
						</div>
						<div class="stats-tab column is-2-tablet is-4-mobile has-text-centered">
							<p class="stat-val">{{ user?.credit }}</p>
							<p class="stat-key">Credits</p>
						</div>
					</div>
				</div>
				<div v-if="selectedOpportunities === 'received'" class="columns is-mobile is-multiline">
					<opportunities-card :opportunities="opportunities" />
				</div>
				<div v-if="selectedOpportunities === 'sent'" class="columns is-mobile is-multiline">
					<opportunities-card :opportunities="sendOpportunities" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import useAuth from '@/composition/useAuth';
import ProfileModal from '@/components/ProfileModal.vue';
import OpportunitiesCard from '@/components/OpportunitiesCard.vue';

export default {
	components: {
		ProfileModal,
		OpportunitiesCard
	},

	data() {
		return {
			selectedOpportunities: "received"
		}
	},

	setup() {
		const { isProcessing, isAuthenticated, user } = useAuth();
		return { isProcessing, isAuthenticated, user };
	},

	watch: {
		isAuthenticated(isAuth) {
			if (!isAuth) this.$router.push('/');
		},

		created() {
			this.$store.dispatch('opportunity/getOpportunities');
		},

		createdOpportunity() {
			this.$store.dispatch('opportunity/getSendOpportunities');
		},
	},

	computed: {
		sendOpportunities() {
			return this.$store.state.opportunity.sendOpportunities; 
		},

		opportunities() {
			return this.$store.state.opportunity.opportunities;
		},

		created() {
			return this.$store.dispatch('opportunity/getOpportunities');
		},

		createdOpportunity() {
			return this.$store.dispatch('opportunity/getSendOpportunities');
		},
	},
};
</script>

<style scoped>
.link {
	font-weight: 500;
	color: rgb(79, 79, 172);
	text-decoration: underline;
}
.user-info {
	margin-bottom: 10px;
}
.stats-error {
	font-size: 40px;
	font-weight: bold;
	margin-top: 30px;
}
.delete-item {
	color: red;
}
.stats-tab {
	border-bottom: 2px solid transparent;
	transition: 0.5s;
}
.stats-tab:hover {
	cursor: pointer;
	border-bottom: 2px solid black;
}
.stats-tab.is-active {
	border-bottom: 2px solid black;
}
.stat-val {
	font-size: 2em;
	padding-top: 20px;
	font-weight: bold;
}
.stat-key {
	font-size: 1.4em;
	font-weight: 200;
}
.section.profile-heading .column.is-2-tablet.has-text-centered + .has-text-centered {
	border-left: 1px dotted rgba(0, 0, 0, 0.2);
}
.container.profile {
	margin-top: 1%;
}
.control.is-pulled-left span.select {
	margin-right: 5px;
	border-radius: 2px;
}
.modal-card .content h1 {
	padding: 40px 10px 10px;
	border-bottom: 1px solid #dadada;
}
.container.profile .profile-options .tabs ul li.link a {
	margin-bottom: 20px;
	padding: 20px;
	background-color: #f1f1f1;
}
.card-footer {
	justify-content: center;
	padding: 5px;
}
</style>
