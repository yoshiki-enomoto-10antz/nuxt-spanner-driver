<template>
  <v-data-table
    :headers="headers"
    :items="rows"
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
</template>

<script>
export default {
  name: 'SchemaTable',
  props: {
    rows: {
      type: Array,
      default: null
    },
    tableName: {
      type: String,
      default: ''
    }
  },
  computed: {
    // Time系は見せない（見たかったら消してね）
    headers() {
      return this.rows.length > 0 ? Object.keys(this.rows[0]).map(key => {
        if (['CreateTime', 'UpdateTime', 'DeleteTime'].includes(key)) return null
        return { text: key, value: key }
      }).filter(v => v) : []
    },
  },
  data() {
    return {
      tableData: {}
    }
  },
  methods: {
    async save (item) {
      await this.$axios.$post(`/db/table/${this.tableName}`, item)
    }
  }
}
</script>
