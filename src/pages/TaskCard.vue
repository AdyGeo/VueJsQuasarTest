<template>

        <q-card class="my-card flex q-mt-md col-md-8 col-lg-6 col-sm-10 col-xs-12" :class="{taskDone: task.done}">
          <q-card-section >
            <div class="text-subtitle2 q-mb-sm">{{task.description}}</div>
             <div class="flex items-center">
                <q-chip v-if="!task.done" :color="priorityColors[task.priority]" class="q-mr-sm" text-color="white">{{task.priorityName}}</q-chip>
                <div class="text-subtitle2 text-primary" v-if="task.duedate && !task.done"><q-icon size="sm" class="q-mr-xs" name="o_event" />{{new Date(task.duedate).toLocaleDateString("en-GB")}}</div>
             </div>
          </q-card-section>

          <q-separator vertical class="q-ml-auto"/>

          <q-card-actions align="right">
            <q-checkbox v-model="taskDone"  class="q-mr-sm" color="primary"  />
            <q-btn flat @click="showDialog(task)"><q-icon name="o_edit" color="primary" /></q-btn>
            <q-btn flat @click="deleteTask(task.id)"><q-icon name="o_delete" color="negative" /></q-btn>
          </q-card-actions>
        </q-card>

</template>
<script>
export default {
  name:'TaskCard',
  props:['task','deleteTask','showDialog'],
  data(){
    return{
      priorityColors:{
        L:'secondary',
        M:'warning',
        H:'negative'
      }
    }
  },
  computed:{
    taskDone: {
      get: function() {
        return this.task.done;
      },
      set: function(){
        this.$emit("markDone", this.task);
      }
    }
  }
}

</script>

<style lang="sass">
.taskDone
  background-color: $grey-5
</style>