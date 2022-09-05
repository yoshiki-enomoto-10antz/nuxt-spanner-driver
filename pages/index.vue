<template>
  <v-container fluid>
    <component
      v-for="(content,i) in contents"
      :key="`${i}-${content}`"
      :is="content"
      class="mt-6"
    />
    <v-row>
      <v-btn class="mx-auto mt-10" elevation="2" fab @click="contents.push('SchemaTable')">
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      table: null,
      tableData: {},
      contents: ['SchemaTable']
    }
  },
  created() {
    this.$store.dispatch('fetchTableNameList')
  }
}
</script>
