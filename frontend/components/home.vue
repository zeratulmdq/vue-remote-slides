<template>
	<div class="home" :class="bcColor">
		<!-- PDF canvas should be a component -->
	    <canvas id="vuepdf"></canvas>
		<div class="home__controlbar">
			 <a class="home__control ripple" :class="colorClass" @click="toggleControls">
                <i class="fa" :class="eyeClass" aria-hidden="true"></i>
            </a>
            <div class="home__hiddencontrols" v-show="showHiddenControls">
            	<router-link class="home__control ripple" :class="colorClass" to="/control">
	                <i class="fa fa-play-circle-o" aria-hidden="true"></i>
	            </router-link>
	            <a class="home__control ripple" :class="colorClass" @click="toggleColorMenu">
	            	<div class="home__colormenu" v-show="showColorMenu">
	            		<!-- This should be a component-->
	            		<div class="home__colorpickerwrapper">
	            			<a class="home__colorpicker bc-gray" @click="changeBcColor('bc-gray')" style="top: -25px; left: -25px"></a>
	            			<a class="home__colorpicker bc-black" @click="changeBcColor('bc-black')" style="top: -25px; left: 25px"></a>
	            			<a class="home__colorpicker bc-white" @click="changeBcColor('bc-white')" style="top: 25px; left: -25px"></a>
	            			<a class="home__colorpicker bc-light" @click="changeBcColor('bc-light')" style="top: 25px; left: 25px"></a>
	            		</div>
	            		<div class="home__colorpickerwrapper">
	            			<a class="home__colorpicker bc-blue" @click="changeColor('bc-blue')" style="top: -25px; left: -25px"></a>
	            			<a class="home__colorpicker bc-red" @click="changeColor('bc-red')" style="top: -25px; left: 25px"></a>
	            			<a class="home__colorpicker bc-orange" @click="changeColor('bc-orange')" style="top: 25px; left: -25px"></a>
	            			<a class="home__colorpicker bc-purple" @click="changeColor('bc-purple')" style="top: 25px; left: 25px"></a>
	            		</div>
	            	</div>
	            	<i class="fa fa-eyedropper" aria-hidden="true"></i>
	            </a>
            	<form ref="pdf">
            		<a class="home__control ripple" :class="colorClass">
		                <i class="fa fa-upload home__fileContainer" aria-hidden="true">
		                    <input type="file" name="file" @change="upload">    
		                </i> 
	                </a>
	            </form>
	            <a class="home__control ripple" :class="colorClass" @click="nextPage">
	                <i class="fa fa-angle-double-right" aria-hidden="true"></i>
	            </a>
	            <a class="home__control ripple" :class="colorClass" @click="previousPage">
	                <i class="fa fa-angle-double-left" aria-hidden="true"></i>
	            </a>
            </div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'home',
		data() {
			return {
				formData: null,
				showHiddenControls: true,
				showColorMenu: false,
				bcColor: 'bc-gray',
				pageRendering: false,
                pageNumPending: null,
                scale: 1,
                canvas: null,
                ctx: null,
                viewport: null,
			}
		},
		computed: {
			/**
			 * Return class to be applied to
			 * eye button
			 * 
			 * @return String
			 */
			eyeClass() {
				return this.showHiddenControls ? 'fa-eye-slash' : 'fa-eye';
			},

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
             * Return current pdf doc
             * 
             * @return PDFDoc
             */
            pdfDoc() {
                return this.$store.state.pdfDoc;
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
			 * Upload a file to the server
			 * 
			 * @return void
			 */
			upload() {
                this.formData = new FormData(this.$refs.pdf);
                if(this.formData.get('file').name)
                {
                    this.$http.post('/api/upload', this.formData);
                }
            },

            /**
             * Toggle controls display
             * 
             * @return void
             */
            toggleControls() {
            	this.showHiddenControls = !this.showHiddenControls;
            },

            /**
             * Toggle color controls display
             * 
             * @return void
             */
            toggleColorMenu() {
            	this.showColorMenu = !this.showColorMenu;
            },

            /**
             * Change the color of the butons
             * 
             * @param  String color Class to be applied
             * @return String
             */
            changeColor(color) {
            	this.$store.commit('changeColorClass', color);
            },

            /**
             * Change the background color
             * of the app
             * 
             * @param  String color Class to be applied
             * @return String
             */
            changeBcColor(color) {
            	this.bcColor = color;
            },
            /**
             * Get page info from document, 
             * resize canvas accordingly, 
             * and render page.
             * 
             * @param num Page number.
             */
            renderPage(num) {
                this.pageRendering = true;
                // Using promise to fetch the page
                this.pdfDoc.getPage(num).then((page) => {
                    var viewport = page.getViewport(this.scale);
                    
                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: this.ctx,
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);

                    // Wait for rendering to finish
                    renderTask.promise.then(() => {
                        this.pageRendering = false;
                        if (this.pageNumPending !== null) {
                        // New page rendering is pending
                            this.renderPage(this.pageNumPending);
                            this.pageNumPending = null;
                        }
                    });
                });
            },

            /**
             * If another page rendering in progress, waits until the rendering is
             * finised. Otherwise, executes rendering immediately.
             * 
             * @param  int num Page number
             * @return void
             */
            queueRenderPage(num) {
                if (this.pageRendering) {
                    this.pageNumPending = num;
                } else {
                    this.renderPage(num);
                }
            },

            /**
             * Asynchronously render PDF.
             * 
             * @return void
             */
            init() {
                if(this.pdfDoc.numPages)
                {
                    this.pdfDoc.getPage(this.currentPage).then((page) => {
                        if(this.viewport == null)
                        {
                            this.scale = 1;
                            this.viewport = page.getViewport(this.scale);
                            let ratioH = window.innerHeight/this.viewport.height,
                                ratioW = window.innerWidth/this.viewport.width,
                                ratio = ratioH < ratioW ? ratioH : ratioW;
                            
                            this.canvas.height = this.viewport.height * ratio;
                            this.canvas.width = this.viewport.width * ratio;    
                            this.scale = ratio;
                        }

                        this.renderPage(this.currentPage);
                    });
                }
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
            changePage(n) {
				this.$socket.emit('page.change', n);
			},
		},
		watch: {
            'pdfDoc.fingerprint'() {
                this.viewport = null;
                if(this.currentPage == 1)
                    this.init();

                this.$socket.emit('page.change', 1);
            },
            currentPage() {
                this.init();
            }
        },
        mounted() {
            this.canvas = document.getElementById('vuepdf');
            this.ctx = this.canvas.getContext('2d');
            this.$socket.emit('files.current');
            this.init();
        },
	}
</script>
<style>
	.home {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        overflow: hidden;
    }

	.home__controlbar {
		position: fixed;
		overflow: visible;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.home__control {
	    height: 50px;
	    width: 50px;
	    font-size: 25px;
	    display: flex;
	    color: #FFF;
	    align-items: center;
	    justify-content: center;
	    border-radius: 50%;
	    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.23), 0 3px 10px rgba(0, 0, 0, 0.16);
	    float: right;
	    cursor: pointer;
	    margin: 10px;
	    overflow: visible;
	}

	.home__hiddencontrols {
		overflow: visible;
	}

	.home__control[disabled], .home__control[disabled]:hover {
	   pointer-events: none;
	   color: #e1e1e1;
	}

	.home__fileContainer {
	    overflow: hidden;
	    position: relative;
	    cursor: pointer;
	}

	.home__fileContainer [type=file] {
	    cursor: inherit;
	    display: block;
	    font-size: 999px;
	    filter: alpha(opacity=0);
	    min-height: 100%;
	    min-width: 100%;
	    opacity: 0;
	    position: absolute;
	    right: 0;
	    text-align: right;
	    top: 0;
	}

	.home__colormenu {
		position: absolute;
		bottom: 60px;
		left: -10px;
		width: 70px;
	}

	.home__colorpickerwrapper {
	    height: 50px;
	    width: 50px;
	    border-radius: 50%;
	    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.23), 0 3px 10px rgba(0, 0, 0, 0.16);
	    cursor: pointer;
	    margin: 10px;
	    overflow: hidden;
	    position: relative;
	}

	.home__colorpicker {
		height: 50px;
		width: 50px;
		position: absolute;
	}
</style>