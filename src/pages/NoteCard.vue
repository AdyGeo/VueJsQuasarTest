<template>

        <q-card  class="my-card flex q-mt-md col-md-8 col-lg-6 col-sm-10 col-xs-12">
          <q-card-section >
            <div class="text-h6">{{note.title}}</div>
            <div class="text-body1">{{note.description}}</div>
          </q-card-section>

          <q-separator vertical class="q-ml-auto"/>

          <q-card-actions align="right">
            <q-btn flat @click="showDialog(note)"><q-icon name="o_edit" color="primary" /></q-btn>
            <q-btn flat @click="deleteNote(note.id)"><q-icon name="o_delete" color="negative" /></q-btn>
          </q-card-actions>
        </q-card>

</template>
<script>
export default {
  name:'NoteCard',
  props:['note','deleteNote','showDialog']
}

</script>