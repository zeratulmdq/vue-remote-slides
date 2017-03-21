import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		file: {
			fullName: "",
			mimetype: "",
			name: "",
			path: "",
		},
		pdfDoc: {
			numPages: 0,
			fingerprint: ''
		},
		currentPage: 1,
		colorClass: 'bc-red',
	},
	mutations: {
		changePdfDoc(state, pdfDoc) {
			state.pdfDoc = pdfDoc;
		},
		changeFile(state, file) {
			state.file = file;
		},
		changePageNum(state, num) {
			state.currentPage = num;
		},
		previousPage(state) {
			state.pdf.pageNum--;
		},
		nextPage(state) {
			state.pdf.pageNum++;
		},
		changePageCount(state, num) {
			state.pdf.pageCount = num;
		},
		changeColorClass(state, color) {
			state.colorClass = color;
		}
	},
	getters: {
		numPages: state => {
			return state.pdfDoc ? state.pdfDoc.numPages : 0;
		},
	}
})