<template>
    <div class="home">
        <MovieCarousel v-bind:movies="featured"/>
        <div class="ma-4">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">Trending Movies</div>
            <MovieGrid v-bind:movies="trendingMovies"/>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import MovieCarousel from "@/components/MovieCarousel"
import MovieGrid from "@/components/MovieGrid"

export default {
    name: 'Home',
    components: {
        MovieCarousel, // Composant pour les films mis en avant
        MovieGrid // Composant pour les autres films tendance
    },
    mounted() {
        axios
            .get(this.trendingMoviesUrl)
            .then(res => {
                this.trendingMovies = res.data.results
                for (let i = 0; i < 5; i++) {
                    let item = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
                    if (!this.featured.includes(item)) {
                        this.featured.push(item);
                    }
                }
            })
            .catch(() => {})
    },
    data() {
        return {
            featured: [], // liste pour les films mis en avant
            trendingMovies: [], // liste pour les autres films tendance
            trendingMoviesUrl: "https://lebonfilm-prod.herokuapp.com/movies?trending=true" //l'url pour recuperer les films tendance
        };
    }
}
</script>
