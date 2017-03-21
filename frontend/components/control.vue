<template>
	<div class="control">
		<div class="control__bottom">
			<div class="control__page ripple" :class="{'control__page--active': n == currentPage }" v-for="n in numPages" @click="changePage(n)">
				{{ n }}
			</div>
		</div>
		<div class="control__bottombar">
			<router-link to="/" class="control__home" :class="colorClass">
	            <i class="fa fa-home"></i>
	        </router-link>
			<a class="control__home ripple" :class="colorClass" @click="nextPage">
                <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </a>
            <a class="control__home ripple" :class="colorClass" @click="previousPage">
                <i class="fa fa-angle-double-left" aria-hidden="true"></i>
            </a>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'control',
		computed: {
			/**
			 * Return total pages of
			 * current PDF doc
			 * 
			 * @return int
			 */
			numPages() {
				return this.$store.getters.numPages;
			},

			/**
			 * Return current page
			 * 
			 * @return int
			 */
			currentPage() {
				return this.$store.state.currentPage;
			},

			/**
			 * Return color class to be applied
			 * to control buttons
			 * 
			 * @return String
			 */
			colorClass() {
				return this.$store.state.colorClass;
			}
		},
		methods: {
			/**
			 * Change rendered page
			 * 
			 * @param  Int n Page to render
			 * @return void
			 */
			changePage(n) {
				this.$socket.emit('page.change', n);
			},
			
			/**
			 * Go to previous page if available
			 * 
			 * @return void
			 */
            previousPage() {
                if (this.currentPage <= 1) {
                    return;
                }
                this.changePage(this.currentPage - 1);
            },

            /**
             * Go to next page if available
             * 
             * @return void
             */
            nextPage() {
                if (this.currentPage >= this.numPages) {
                    return;
                }
                this.changePage(this.currentPage + 1);
            },
		}
	}
</script>
<style>
	.control {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		overflow: auto;
		background-color: #CCC;
	}

	.control__bottom {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		align-content: flex-start;
	}

	.control__page {
		background-color: #455A64;
		color: #FFF;
		width: 100px;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		margin: 10px;
		box-sizing: border-box;
		float: left;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.23), 0 3px 10px rgba(0, 0, 0, 0.16);
	}

	.control__page--active {
		background-color: #CFD8DC
	}

	.control__bottombar {
		position: fixed;
		overflow: visible;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.control__home {
		height: 50px;
	    width: 50px;
	    font-size: 25px;
	    display: flex;
	    color: #FFF;
	    align-items: center;
	    justify-content: center;
	    border-radius: 50%;
	    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.23), 0 3px 10px rgba(0, 0, 0, 0.16);
	    cursor: pointer;
	    float: right;
	    margin: 10px;
	}
</style>