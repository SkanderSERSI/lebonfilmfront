<template>
    <v-layout class="ma-8" justify-start row wrap>
        <v-flex xs6 sm4 md3 lg2 v-for="(movie, i) in movies" :key="i">
            <router-link class="ml-2 pb-8 titre" :title="(movie.title || movie.original_title)" :to="{ name: 'Movie', params: { id: (movie.id) } }">
                <v-card class="mb-2" raised width="187" color="grey lighten-1" image>
                    <v-img class="carte" v-if="movie.poster_url" :src="movie.poster_url" lazy-src="" height="275" cover>
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="white"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                    <v-img class="carte" v-if="!movie.poster_url" src="@/assets/poster404.jpg" height="275" cover>
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="white"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                </v-card>
                <span>{{ (movie.title || movie.original_title) }}</span>
          </router-link>
        </v-flex>
      </v-layout>
</template>

<script>

export default {
    name: 'MovieGrid',
    props: ['movies'] // les films que l'on recupere
}
</script>

<style scoped>
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