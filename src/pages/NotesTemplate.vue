
<script>
import NoteCard from './NoteCard.vue';

export default {
    name:'NotesTemplate',
    data() {
        return {
            notes: null,
            showModal: false,
            fetchError: null,
            id: null,
            title: {
                value: "",
                isValid: true,
                errorMessage: ""
            },
            description: {
                value: "",
                isValid: true,
                errorMessage: ""
            }
        };
    },
    methods: {
        showDialog(note) {
            this.showModal = true;
            this.fetchError = null;
            this.id = note ? note.id : null;
            this.title.value = note ? note.title : "";
            this.title.errorMessage = "";
            this.title.isValid = true;
            this.description.value = note ? note.description : "";
            this.description.errorMessage = "";
            this.description.isValid = true;
        },
        async saveNote() {
            this.title.isValid = true;
            this.description.isValid = true;
            if (!this.title.value) {
                this.$refs.dialog.shake();
                this.title.errorMessage = "Title is required";
                this.title.isValid = false;
                this.$refs.title.focus();
            }
            else if (!this.description.value) {
                this.$refs.dialog.shake();
                this.description.errorMessage = "Description is required";
                this.description.isValid = false;
                this.$refs.description.focus();
            }
            else {
                const url = this.id ? `http://localhost:8000/api/notes/${this.id}/` : "http://localhost:8000/api/notes/";
                const method = this.id ? "PUT" : "POST";
                try {
                    const res = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: this.title.value,
                            description: this.description.value
                        })
                    });
                    if (!res.ok) {
                        throw new Error(res.status + " " + res.statusText);
                    }
                    const newNote = await res.json();
                    if (this.id) {
                        this.notes.map(el => {
                            if (el.id === newNote.id) {
                                el.title = newNote.title;
                                el.description = newNote.description;
                            }
                        });
                    }
                    else {
                        this.notes.push(newNote);
                    }
                    this.showModal = false;
                }
                catch (err) {
                    this.fetchError = err;
                }
            }
        },
        async fetchData() {
            this.notes = null;
            const res = await fetch("http://127.0.0.1:8000/api/notes/");
            this.notes = await res.json();
        },
        async deleteNote(id) {
            try {
                const res = await fetch(`http://localhost:8000/api/notes/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (!res.ok) {
                    throw new Error(res.status + " " + res.statusText);
                }
                this.notes = this.notes.filter(note => note.id != id);
            }
            catch (err) {
                this.fetchError = err;
            }
        }
    },
    mounted() {
        this.fetchData();
    },
    components: { NoteCard }
}

</script>

<template>
  <q-page class="q-px-md" v-if="notes" >

    <q-card-section>
      <div v-if="fetchError" class="text-red">{{fetchError}}</div>
    </q-card-section>
    <div class="row justify-center">
      <div class="q-pr-md q-mt-md col-md-8 col-lg-6 col-sm-10 col-xs-12 row justify-between">
        <div class="text-h4 text-primary">Notes</div>
        <q-btn size="xl" flat @click="showDialog"><q-icon name="o_add_circle_outline" color="primary" /></q-btn>
      </div>
    </div>
    <div v-for="note in notes" :key="note.id" class="row justify-center">
      <NoteCard :note="note" :showDialog="showDialog" :deleteNote="deleteNote"></NoteCard>
    </div>
    
  </q-page>
    <q-dialog ref="dialog" v-model="showModal" persistent>
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section>
          <div v-if="this.id" class="text-h6">Edit Note</div>
          <div v-else class="text-h6">New Note</div>
        </q-card-section>

        <q-card-section>
          <div v-if="fetchError" class="text-red">{{fetchError}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input ref="title" class="q-mb-md" required :error="!title.isValid" :error-message="title.errorMessage" label="Title" v-model="title.value" autofocus />
          
          <q-input ref="description" label="Description" :error="!description.isValid" :error-message="description.errorMessage" autogrow dense v-model="description.value" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" @click="saveNote"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>