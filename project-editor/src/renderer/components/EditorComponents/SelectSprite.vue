<template>
	<div>
		<h1>Тут будит сто-то</h1>
		
		<div class="sprite_select">
			<div class="spritesheet_list">
				<div
					v-for="spriteSheet in spriteSheets"
					class="spriteSheet"
					:id="spriteSheet.file">
					
					<h2>{{ spriteSheet.file }}</h2>
					<div 
						class="sprite_list"
						style="display: grid; grid-template-columns: repeat(3, 150px); grid-auto-rows: 200px;">
						<div 
							v-for="sprite in spriteFilteredList(spriteSheet.sprites)"
							class="sprite"
							:class="sprite.name || spriteSheet.file"
							style="width: 100px; height: 100%; display: grid; grid-template-rows: 1fr 5%"
							v-if="!sprite.frames">

							<div class="sprite_preview_container" style="overflow: auto">
								<div 
									class="sprite_preview"
									:style="spriteStyles(spriteSheet.file, sprite.rect)"></div> 
							</div>

							<p class="sprite_name">{{ sprite.name || spriteSheet.file }}</p>
						
						</div>
					</div>

				</div>
			</div>
			<div class="sprite_search_settings">
				<input type="text" v-model="spriteSearch">
			</div>
		</div>
	</div>
</template>
<script>
	import '../../store/index.js';
	import { mapGetters } from 'vuex';

	export default {
		data() {
			return {
				spriteSearch: ''
			}
		},
		computed: {
			...mapGetters(['projectAppPath'])
		},
		props: {
			spriteSheets: Array
		},
		methods: {
			spriteStyles(file, spriteCoordinations) {
				return {
					backgroundImage: `url(file://${this.projectAppPath}/${file})`,
					backgroundPosition: `-${spriteCoordinations[0]}px -${spriteCoordinations[1]}px`,
					width: `${spriteCoordinations[2]}px`,
					height: `${spriteCoordinations[3]}px`
				}
			},

			spriteFilteredList(spritesInSpriteSheet) {
				return spritesInSpriteSheet.filter(sprite => {
			    	return sprite.name.toLowerCase().includes(this.spriteSearch.toLowerCase())
				});
			}
		},
		mounted() {
			console.log(this.projectAppPath, this.spriteSheets);
		}
	}
</script>