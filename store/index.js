export const state = () => ({
    tableNameList: [],
    tableData: {}
});

export const mutations = {
    removeData(state, payload) {
        state.tableData[payload.tableName] = null
    },
    addTableData(state, payload) {
        state.tableData = Object.assign({}, state.tableData, { [payload.name]: payload.row })
    },
    updateTableNameList(state, payload) {
        state.tableNameList = payload
    }
};

export const actions = {
    async fetchTableNameList({ state, commit }) {
        if (state.tableNameList.length > 0) return
        await this.$axios.$get('/db')
            .then(res => commit('updateTableNameList', res.map(v => v.table_name)))
    },
    async fetchTableData({ state, commit }, payload) {
        const tableName = payload.tableName
        // できるだけリクエストは減らす
        if (!tableName || state.tableData[tableName]) return
        await this.$axios.$get(`/db/table/${tableName}`)
            .then(res => commit('addTableData', { name: tableName, row: res }))
    },
    async forceFetchTableData({ dispatch, commit }, payload) {
        commit('removeData', payload)
        dispatch('fetchTableData', payload)
    }
};

export const getters = {
    tableNameList: (state) => state.tableNameList,
    tableData: (state) => state.tableData,
};