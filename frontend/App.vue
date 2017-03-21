<template>
    <div id="app">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    import pdfjsLib from 'pdfjs-dist'
    import worker from 'pdf-worker'

    pdfjsLib.PDFJS.workerSrc = worker;

    export default {
        name: 'app',
        methods: {
            /**
             * Register socket "new file" event
             * 
             * @return void
             */
            registerSocketFileNewEvent() {
                this.$socket.on('files.new', (data) => {
                    this.$store.commit('changeFile', data);

                    pdfjsLib.getDocument(data.path).then((pdfDoc_) => {
                        this.$store.commit('changePdfDoc', pdfDoc_);
                    });
                });
            },

            /**
             * Register socket "page change" event
             * 
             * @return void
             */
            registerSocketChangePageEvent() {
                this.$socket.on('page.change', (data) => {
                    this.$store.commit('changePageNum', data);
                });
            },

        },
        mounted() {
            this.registerSocketFileNewEvent();
            this.registerSocketChangePageEvent();
        },
    }
</script>
<style>
    #app {
        width: 100%;
        height: 100%;
    }

    /**
     * Classes applied across the
     * entire app
     */
    
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    a {
        text-decoration: none;
        outline: none;
    }

    .ripple {
        overflow: hidden;
        transform: translate3d(0, 0, 0);
    }
    
    .ripple::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(10,10);
        opacity: 0;
        transition: transform .5s, opacity 1s;
    }

    .ripple:active::after {
        transform: scale(0,0);
        opacity: .2;
        transition: 0s;
    }

    .bc-purple {
        background-color: #7B1FA2;
    }

    .bc-red {
        background-color: #F44336;
    }

    .bc-blue {
        background-color: #448AFF;
    }

    .bc-orange {
        background-color: #FF9800;
    }

    .bc-gray {
        background-color: #CCC;
    }

    .bc-white {
        background-color: #FFF;
    }

    .bc-black {
        background-color: #000;
    }

    .bc-light {
        background-color: #B2EBF2;
    }
</style>