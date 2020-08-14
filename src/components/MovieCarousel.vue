<template>
    <v-carousel cycle vertical-delimiters delimiter-icon="mdi-circle-medium" hide-delimiter-background dark>
        <v-carousel-item v-for="(movie, i) in movies" :key="i" :src="movie.backdrop_url">
            <v-container fill-height fluid>
                <v-layout fill-height align-end>
                    <v-flex xs12>
                        <v-card class="ml-8 pl-8" width="850" height="350" color="transparent" outlined>
                            <v-card-title :title="(movie.title || movie.original_title)" class="display-3 font-weight-black">{{ (movie.title || movie.original_title) | truncate(24, '...') }}</v-card-title>
                            <v-card-text :title="movie.category" class="headline font-weight-regular">{{ movie.category }}</v-card-text>
                            <v-card-actions>
                                <router-link class="rt" :to="{ name: 'Movie', params: { id: movie.id } }">
                                    <v-btn class="ml-2 mt-4 subtitle-1 font-weight-bold" outlined large color="white">More Info</v-btn>
                                </router-link>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-carousel-item>
    </v-carousel>
</template>
<script>

export default {
    name: 'MovieCarousel',
    props: ['movies'],
    filters: {
        truncate: function(text, length, suffix) { // methode pour tronquer les titres de film trop long
            if (text && text.length > length) {
                return text.substring(0, length) + suffix;
            } else {
                return text;
            }
        }
    }
}
</script>

<style scoped>
.rt {
    text-decoration: none;
    display: block;
}
</style>