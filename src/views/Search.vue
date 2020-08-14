<template>
    <div class="search-result">
        <div class="ma-4 pb-8">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">
                <span v-if="this.searchResults.length !== 0">Search Results: ({{ this.totalResults }})</span>
                <span v-else>Search Results:</span>
            </div>
            <MovieGrid v-bind:movies="searchResults"/>
            <v-btn v-if="!noData && this.page != this.totalPages" @click="loadMore" block color="light-blue" class="white--text mb-8">
                <div class="font-weight-black subtitle-1">Load more</div>
            </v-btn>
        </div>
        <div v-if="noData && this.name">
            <h4 class="mt-8 mb-2 grey--text">No result found.</h4>
        </div>
  </div>
</template>

<script>
import axios from "axios"
import MovieGrid from "@/components/MovieGrid"

export default {
    data() {
        return {
        imageURL: "http://image.tmdb.org/t/p/w780", // Base d'url pour la taille des posters de film
        searchResults: [], // Liste des resultats de recherche de films
        totalResults: "", // Nombre de resultat
        totalPages: "", // Nombre de pages de resulat
        page: "1", // Page courante
        noData: false, // Si le nombre de resultat est nul
        searchUrl: "https://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&query="
            + this.$props.name 
            + "&api_key=" 
            + process.env.VUE_APP_TMDB_API_KEY 
            + "&page=" 
            + this.page, // Url pour faire une recherche de film par titre via l'api tmdb
        };
    },
    components: {
        MovieGrid // On utilise le composant MovieGrid et on passe searchResult comme propriete movies
    },
    props: ["name"], // Titre du film que l'on recherche
    mounted() {
        //On recupere les resulats de la recherche quand le composant est monte
        this.noData = false;
        this.searchResults = [];
        axios
            .get(this.searchUrl)
            .then(res => {
                this.totalPages = res.data.total_pages;
                this.totalResults = res.data.total_results;
                res.data.results.forEach(element => {
                    if (element.poster_path) {
                        element['poster_url'] = this.imageURL + element.poster_path
                    }
                    this.searchResults.push(element);
                });
                if (this.searchResults.length === 0) {
                    this.noData = true;
                }
            });
    },
    methods: {
        loadMore() { // pour charger plus de resultats
        this.page++;
        axios
            .get(this.searchUrl)
            .then(res => {
                res.data.results.forEach(element => {
                    if (element.poster_path) {
                        element['poster_url'] = this.imageURL + element.poster_path
                    }
                    this.searchResults.push(element);
                });
            });
        }
    },
    name: "Search",
    watch: {
        name() {
            // le composant navbar nous dirige vers la vue Search lorsqu'on fait une recherche dans une page differente de la page de resultats de recherche,
            // lorsque le composant est monte les resultats sont recuperer est afficher.
            // Or si on veut refaire une recherche juste apres, il ne se passera rien car le composant est deja monte
            // Pour eviter de rechargez la page et faire d'autres recherche depuis la page de resultats de recherche on va observer name (le titre du film a rechercher) 
            // et si il y a un changement refaire la recherche sans reload la page
            this.noData = false;
            this.searchResults = [];
            axios
                .get(this.searchUrl)
                .then(res => {
                    this.totalPages = res.data.total_pages;
                    this.totalResults = res.data.total_results;
                    res.data.results.forEach(element => {
                        if (element.poster_path) {
                            element['poster_url'] = this.imageURL + element.poster_path
                        }
                        this.searchResults.push(element);
                    });
                    if (this.searchResults.length === 0) {
                        this.noData = true;
                    }
                });
        },
        searchResults(newSearchResults) {
            this.searchResults = newSearchResults;
        },
        page(newPage) {
            this.page = newPage;
        }
    }
};
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
