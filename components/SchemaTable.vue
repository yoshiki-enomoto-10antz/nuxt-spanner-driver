<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <v-combobox
          v-model="tableName"
          :items="tableNameList"
          label="Table"
          dense
          @change="fetchTableData"
        ></v-combobox>
      </v-card-title>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-for="(header, index) in headers" v-slot:[`item.${header.value}`]="props">
        <v-edit-dialog
            :key="index"
            :return-value.sync="props.item[header.value]"
            @save="save(props.item)"
          >
            <div>{{ props.item[header.value] }}</div>
            <template v-slot:input>
              <v-text-field
                v-model="props.item[header.value]"
                :label="`Edit - ${header.value}`"
                counter
                autofocus
              />
            </template>
          </v-edit-dialog>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'SchemaTable',
  computed: {
    // Time系は見せない（見たかったら消してね）
    headers() {
      return this.items.length > 0 ? Object.keys(this.items[0]).map(key => {
        if (['CreateTime', 'UpdateTime', 'DeleteTime'].includes(key)) return null
        return { text: key, value: key }
      }).filter(v => v) : []
    },
    tableNameList() {
      return this.$store.getters.tableNameList
    },
    tableData() {
      return this.$store.getters.tableData
    },
    items () {
      return this.tableData[this.tableName] ?? []
    }
  },
  data() {
    return {
      tableName: ''
    }
  },
  methods: {
    async fetchTableData () {
      await this.$store.dispatch('fetchTableData', { tableName: this.tableName })
    },
    async save (item) {
      await this.$axios.$post(`/db/table/${this.tableName}`, item)
    }
  }
}
</script>
