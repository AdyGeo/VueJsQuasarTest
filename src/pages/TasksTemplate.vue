
<script>
import TaskCard from './TaskCard.vue';
import { date } from 'quasar'
export default {
    name: 'TasksTemplate',
    data() {
        return {
            priorityOptions:[
               {label:'Low', value:'L'},
               {label:'Medium', value:'M'},
               {label:'High', value:'H'}
            ],
            tasks: null,
            showModal: false,
            fetchError: null,
            id: null,
            done: null,
            priority: null,
            priorityName: null,
            dueDate: '2022-06-13',
            description: {
                value: "",
                isValid: true,
                errorMessage: ""
            }
        };
    },
    methods: {
        dateIsValid(dateStr) {
            if(!dateStr){
                return true;
            }
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (dateStr.match(regex) === null) {
                return false;
            }
            const [day, month, year] = dateStr.split('/');
            // 👇️ format Date string as `yyyy-mm-dd`
            const isoFormattedStr = `${year}-${month}-${day}`;
            const date = new Date(isoFormattedStr);
            const timestamp = date.getTime();
            if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
                return false;
            }
            return date.toISOString().startsWith(isoFormattedStr);
        },
         formatDate(dateStr) {
            if(!dateStr){
                return null;
            }
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (dateStr.match(regex) === null) {
                return null;
            }
            const [day, month, year] = dateStr.split('/');
            // 👇️ format Date string as `yyyy-mm-dd`
            const isoFormattedStr = `${year}-${month}-${day}`;
            const date = new Date(isoFormattedStr);
            const timestamp = date.getTime();
            if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
                return null;
            }
            if(date.toISOString().startsWith(isoFormattedStr)){
                return date.toLocaleDateString('en-CA')
            }else{
                return null
            };
        },

        async markAsDone(task){
            try{
                const res = await fetch(`http://localhost:8000/api/complete-task/${task.id}/`,{
                    method:'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        id: task.id,
                        done: !task.done
                    })
                })
                if (!res.ok) {
                    throw new Error(res.status + " " + res.statusText);
                }
                const modifTask = await res.json();
                this.tasks.map(task =>{
                    if(task.id === modifTask.id){
                        task.done = modifTask.done
                    }
                })
            }catch(err){
                this.fetchError = err;
            }
        },
        showDialog(task) {
            this.showModal = true;
            this.fetchError = null;
            this.id = task ? task.id : null;
            this.description.value = task ? task.description : "";
            this.description.errorMessage = "";
            this.description.isValid = true;
            this.dueDate = task && task.duedate ? new Date(task.duedate).toLocaleDateString('en-GB') : null ;
            this.priority = task ? {label:task.priorityName, value:task.priority} : {label:'Low', value:'L'};
        },
        async saveTask() {
            this.description.isValid = true;
            if (!this.description.value) {
                this.$refs.dialog.shake();
                this.description.errorMessage = "Description is required";
                this.description.isValid = false;
                this.$refs.description.focus();
            }
            else {
                const url = this.id ? `http://localhost:8000/api/tasks/${this.id}/` : "http://localhost:8000/api/tasks/";
                const method = this.id ? "PUT" : "POST";
                try {
                    const res = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            description: this.description.value,
                            duedate: this.formatDate(this.dueDate),
                            priority: this.priority.value
                        })
                    });
                    if (!res.ok) {
                        throw new Error(res.status + " " + res.statusText);
                    }
                    const newTask = await res.json();
                    if (this.id) {
                        this.tasks.map(el => {
                            if (el.id === newTask.id) {
                                el.priorityName= newTask.priorityName;
                                el.description= newTask.description;
                                el.insdate= newTask.insdate;
                                el.duedate= newTask.duedate;
                                el.priority= newTask.priority;
                                el.done= newTask.done;
                            }
                        });
                    }
                    else {
                        this.tasks.push(newTask);
                    }
                    this.showModal = false;
                }
                catch (err) {
                    this.fetchError = err;
                }
            }
        },
        async fetchData() {
            this.tasks = null;
            const res = await fetch("http://127.0.0.1:8000/api/tasks/");
            this.tasks = await res.json();
        },
        async deleteTask(id) {
            try {
                const res = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (!res.ok) {
                    throw new Error(res.status + " " + res.statusText);
                }
                this.tasks = this.tasks.filter(task => task.id != id);
            }
            catch (err) {
                this.fetchError = err;
            }
        }
    },
    mounted() {
        this.fetchData();
    },
    components: { TaskCard }
}

</script>

<template>
  <q-page class="q-px-md" v-if="tasks" >

    <q-card-section>
      <div v-if="fetchError" class="text-red">{{fetchError}}</div>
    </q-card-section>
    <div class="row justify-center">
      <div class="q-pr-md q-mt-md col-md-8 col-lg-6 col-sm-10 col-xs-12 row justify-between">
        <div class="text-h4 text-primary">Tasks</div>
        <q-btn size="xl" flat @click="showDialog"><q-icon name="o_add_circle_outline" color="primary" /></q-btn>
      </div>
    </div>
    <div v-for="task in tasks" :key="task.id" class="row justify-center">
      <TaskCard :task="task" :showDialog="showDialog" :deleteTask="deleteTask" @markDone="markAsDone"></TaskCard>
    </div>
    
  </q-page>
    <q-dialog ref="dialog" v-model="showModal" persistent>
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section>
          <div v-if="this.id" class="text-h6">Edit Task</div>
          <div v-else class="text-h6">New Task</div>
        </q-card-section>

        <q-card-section>
          <div v-if="fetchError" class="text-red">{{fetchError}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">    
            <q-input class="q-mb-md" ref="description" label="Task description" :error="!description.isValid" :error-message="description.errorMessage" autogrow v-model="description.value" autofocus />
            <q-select class="q-mb-lg" dense stack-label v-model="priority" :options="priorityOptions" label="Priority" />
            <q-input class="q-mb-md" label="Due date" v-model="dueDate" mask="##/##/####" :rules="[dateIsValid]">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dueDate" mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
    

        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" @click="saveTask"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
full-width row  justify-center  content-start