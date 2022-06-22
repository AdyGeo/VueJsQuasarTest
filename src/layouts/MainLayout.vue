
<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <router-link style="text-decoration: none; color: inherit;" :to="{name:'Tasks'}" >
          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            ToDoApp
          </q-toolbar-title>
        </router-link>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab :to="{name:'Tasks'}" label="Tasks" />
        <q-route-tab :to="{name:'Notes'}" label="Notes" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>