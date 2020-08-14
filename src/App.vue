<template>
    <v-app id="app">
        <Navbar></Navbar>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
    name: 'App',
    components: {
        Navbar
    }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
#app {
    font-family: "Roboto", sans-serif;
}
* {
    text-transform: none !important;
}
</style>