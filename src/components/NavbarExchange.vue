<template>
	<div>
		<!-- NAVBAR -->
		<header class="header">
			<nav class="navbar">
				<div class="container">
					<div class="navbar-brand">
						<a
							class="navbar-item has-text-white is-size-2 has-text-weight-bold"
							href="#"
						>
							{{ title }}
						</a>
						<span
							role="button"
							tabindex="0"
							class="navbar-burger burger has-text-white"
							data-target="navbar-menu"
						>
							<span></span>
							<span></span>
							<span></span>
						</span>
					</div>
					<div id="navbar-menu" class="navbar-menu">
						<div class="navbar-end">
							<!-- Loop through the navigation items -->
							<a
								class="navbar-item nav-home"
								v-for="item in items"
								:href="item.link"
								:key="item.text"
							>
								{{ item.text }}
							</a>
						</div>
					</div>
				</div>
			</nav>
		</header>
		<!-- NAVBAR END -->
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true
		},

		items: {
			type: Array,
			required: true
		},
	},
};
</script>
