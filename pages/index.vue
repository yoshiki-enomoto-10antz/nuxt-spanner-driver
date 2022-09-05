<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
        <v-combobox
          v-model="table"
          :items="items"
          label="Table"
          dense
          @change="fetchTableData()"
        ></v-combobox>
      </v-card-title>
    </v-card>
    <schema-table :table-name="table" :rows="rows" />
  </v-container>
</template>

<script>
// @ is an alias to /src
import SchemaTable from '@/components/SchemaTable.vue'

export default {
  name: 'IndexPage',
  components: {
    SchemaTable
  },
  computed: {
    items() {
      return this.tables ? this.tables.map(v => v.table_name) : []
    },
    rows() {
      return this.tableData[this.table] ? this.tableData[this.table] : []
    }
  },
  async asyncData ({ $axios }) {
    const tables = await $axios.$get('/db')
    return {
      tables
    }
  },
  data() {
    return {
      table: null,
      tableData: {}
    }
  },
  methods: {
    async fetchTableData() {
      if (!this.table || this.tableData[this.table]) return
      const data = await this.$axios.$get(`/db/table/${this.table}`)
      this.tableData = Object.assign({}, this.tableData, { [this.table]: data })
    }
  }
}
</script>
