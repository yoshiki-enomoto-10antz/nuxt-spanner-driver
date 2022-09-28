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
        />
        <v-dialog v-model="dialog" max-width="800px">
          <template #activator="{ on, attrs }">
            <v-btn class="ml-4" v-bind="attrs" v-on="on">Insert</v-btn>
          </template>
          <v-card>
            <v-card-title primary-title>
              後で実装
            </v-card-title>
          </v-card>
        </v-dialog>
        <v-btn class="ml-4" icon @click="forceFetchTableData">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
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
            <div>{{ props.item[header.value] | textHider }}</div>
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
      <template v-slot:item.actions="{ item }">
        <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
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
      }).filter(v => v).concat({ text: 'Delete', value: 'actions', sortable: false }) : []
    },
    tableNameList() {
      return this.$store.getters.tableNameList
    },
    tableData() {
      return this.$store.getters.tableData
    },
    items() {
      return this.cloneTableData[this.tableName] ?? []
    }
  },
  data() {
    return {
      cloneTableData: [],
      tableName: '',
      dialog: false
    }
  },
  methods: {
    async forceFetchTableData () {
      await this.$store.dispatch('forceFetchTableData', { tableName: this.tableName })
    },
    async fetchTableData () {
      await this.$store.dispatch('fetchTableData', { tableName: this.tableName })
    },
    async save (item) {
      await this.$axios.$post(`/db/table/${this.tableName}`, item)
    },
    async deleteItem(item) {
      await this.$axios.$delete(`/db/table/${this.tableName}`, { data: item })
      await this.forceFetchTableData()
    }
  },
  filters: {
    textHider (text) {
      return text && text.length > 10 ? text.slice(0, 10) + "…" : text;
    }
  },
  watch: {
    tableData() {
      // storeのstateは直接いじれないのでdeep copy
      this.cloneTableData = JSON.parse(JSON.stringify(this.tableData));
    }
  }
}
</script>
