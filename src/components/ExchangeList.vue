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
						<a class="item-link" href="#">
							<figure
								class="image is-2by1 item-figure background-img"
								:style="{
									'background-image':
										`url(${item.image})`,
								}"
								:alt="item.title"
							></figure>
							<div class="item-featured">Icon</div>
						</a>
						<div class="item-tags">
							<a 
								class="button is-rounded" href="#"
								v-for="tag in item.tags"
								:key="tag"
								>
								#{{tag}}
							</a>
						</div>
						<h2 class="title item-title is-size-4 has-text-weight-extra-bold">
							<a class="item-link" href="#">{{ item.title }}</a>
						</h2>
						<div class="level">
							<div class="level-left">
								<div class="item-author">{{ item.user }}</div>
							</div>
							<div class="level-right">27th December 2019</div>
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
			required: true
		}
	}
}
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
</style>