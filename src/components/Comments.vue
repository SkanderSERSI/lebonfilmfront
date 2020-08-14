<template>
    <div>
        <div class="comment" v-for="(comment, i) in comments" :key="i">
            <v-list-item>
                <v-list-item-avatar v-if="comment.profil_image_url">
                    <v-img :src="comment.profil_image_url" size="50"></v-img>
                </v-list-item-avatar>
                <v-list-item-avatar v-else color="grey" size="50"></v-list-item-avatar>
                <v-list-item-content class="mb-4">
                    <router-link class="titre" :title="comment.username" :to="{name: 'Profil', params: { username: comment.username }}">
                        <v-list-item-title class="font-weight-medium">{{ comment.username }}</v-list-item-title>
                    </router-link>
                    <v-list-item-title class="font-weight-regular">{{ format_date(comment.date) }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <span class="com grey--text text--darken-1">{{ comment.content }}</span>
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'Comments',
    props: ['comments'], // les commentaires que l'on recupere
    methods: {
        format_date(value) { // formattage de la date
            if(value) {
                return moment.utc(String(value)).utcOffset('+02:00').format('MMMM Do YYYY, h:mm:ss a')
            }
        }
    }
}
</script>
<style scoped>
.comment {
  color: black;
}
.com {
    white-space: normal;
    word-wrap: break-word;
    display: block;
    margin: 0 20px 0 20px;
}
.titre:hover {
    color: #03a9f4;
}
.titre {
    color: black;
    width: 163px;
    display: block;
    text-decoration: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>