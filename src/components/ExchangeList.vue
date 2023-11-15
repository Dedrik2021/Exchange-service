<template>
	<!-- POST LIST START -->
	<section class="posts">
		<div class="container">
			<div class="posts-type">Latest Posts</div>
			<ul class="columns is-multiline">
				<li
					class="column is-12-mobile is-6-tablet is-4-widescreen is-6-desktop"
					v-for="item in exchanges"
					:key="item.id"
				>
					<div class="item post-card bottom-border">
						<router-link class="item-link" :to="{name: 'ExchangeDetail', params: {slug: item.slug}}">
							<img class="post-card__image" width="426" height="213" :src="item.image" :alt="item.title">
							<div class="item-featured">
								<div class="exchange-icon">
									<font-awesome-icon icon="star" />
								</div>
							</div>
						</router-link>
						<div class="item-tags">
							<a
								class="button is-rounded"
								href="#"
								v-for="tag in item.tags"
								:key="tag"
							>
								#{{ tag }}
							</a>
						</div>
						<h2 class="title item-title is-size-4 has-text-weight-extra-bold">
							<router-link :to="{name: 'ExchangeDetail', params: {slug: item.slug}}" class="item-link" >{{ item.title }}</router-link>
						</h2>
						<div class="level">
							<div class="level-left">
								<div class="item-author">{{ item?.type }}</div>
								<!-- <div class="item-author">{{ item.user?.id }}</div> -->
							</div>
							<div class="level-right">{{ item.createAt.toDate().toDateString() }}</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</section>
	<!-- POST LIST END -->
</template>

<script>
export default {
	props: {
		exchanges: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.posts {
	padding-top: 70px;
}
.posts-type {
	font-size: 34px;
	margin-bottom: 10px;
	font-weight: bold;
}

.post-card__image {
	height: 213px;
	object-fit: cover;
}

.exchange-icon {
	color: #ffbc8c;
	height: 25px;
	width: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
