<template>
    <div class="movie">
        <v-container :style="{ backgroundImage: 'url(' + movie.backdrop_url + ')' }" class="image" fluid pb-3>
            <v-row align="start" justify="end">
                <v-card class="mx-auto" width="600" color="transparent" outlined>
                    <v-card-title :title="movie.original_title || movie.title" class="display-2 font-weight-black white--text">{{ (movie.original_title || movie.title) | truncate(movie.original_title || movie.title, 33, "...")}}
                        <span :title="movie.new_date" class="ml-2 mb-4 pd-8 body-1 font-weight-regular white--text">{{ movie.new_date }}</span>
                    </v-card-title>
                    <v-card-text class="body-1 font-weight-regular white--text" :title="movie.overview">
                        <div :title="movie.category" class="font-weight-regular headline mb-4 white--text">{{ movie.category }}</div>
                        {{ movie.overview | truncate(movie.overview, 250, "...") }}
                        <div :title="movie.homepage_url" class="mt-2"><a class="font-weight-regular light-blue--text hidden-sm-and-down" v-bind:href=movie.homepage_url target="_blank" rel="noopener noreferrer">movie official page</a></div>
                        <div class="ma-2 hidden-sm-and-down">
                            <v-chip :title="key" class="ma-2" color="white" outlined v-for="(key, i) in movie.keys" :key="i">
                                {{ key }}
                            </v-chip>
                        </div>
                        <v-btn :title="movie.runtime" color="white" text>
                            <v-icon left color="white">mdi-clock</v-icon>
                            <span :title="movie.runtime" class="white--text">{{ movie.runtime }}</span>
                        </v-btn>
                        <div :title="movie.status">Status/{{ movie.status }}</div>
                    </v-card-text>
                    <v-rating class="ml-4" :title="movie.new_rating + '/5'" v-model="movie.new_rating" color="amber" background-color="amber darken-2" empty-icon="$ratingFull" dense readonly></v-rating>
                    <v-card-actions>
                        <v-dialog @click:outside="resetTrailer" width="1080" overlay-opacity="0.2">
                            <template v-slot:activator="{ on }">
                                <v-btn fab v-on="on" class="ml-2 ma-2" @click="trailer()" small color="light-blue">
                                    <v-icon dense medium color="white">mdi-play</v-icon>
                                </v-btn>
                            </template>
                            <LazyYoutubeVideo v-if="trailerLoaded" :src="movie.trailer_url" autoplay/>
                        </v-dialog>
                        <v-btn v-if="isLiked" fab class="ml-2 ma-2" @click="like(movie.id)" small color="pink">
                            <v-icon dense medium color="white">mdi-heart</v-icon>
                        </v-btn>
                        <v-btn v-else fab outlined class="ml-2 ma-2" @click="like(movie.id)" small color="white">
                            <v-icon dense medium color="white">mdi-heart</v-icon>
                        </v-btn>
                        <span class="white--text font-weight-medium">{{ this.nbLikes }}</span>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-container>
        <div class="ma-4 comments mb-8 pb-8">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">
                <span v-if="this.movieComments.length !== 0">Comments: ({{ this.movieComments.length }})
                </span>
                <span v-else>Comments: </span>
            </div>
            <div class="comment-input ">
                <v-textarea auto-grow dense counter="280" class="ma-4" ref="newComment" v-model="newComment" prepend-icon="mdi-comment" :rules="[rules.comment_length]" placeholder="Add a comment" color="light-blue"></v-textarea>
                <v-btn @click="addComment" color="light-blue" class="white--text ma-4">
                    <div class="font-weight-black subtitle-1">Add a comment</div>
                </v-btn>
                <Comments v-bind:comments="movieComments"></Comments>
            </div>
        </div>
        <div class="ma-4">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">Recommendations</div>
            <MovieGrid v-bind:movies="recoMovies"/>
        </div>
    </div>
</template>


<script>
import axios from "axios";
import LazyYoutubeVideo from "vue-lazy-youtube-video";
import Comments from "@/components/Comments";
import MovieGrid from "@/components/MovieGrid";

export default {
    name: "Home",
    data: function() {
        return {
            movie: "", // l'id du film de la page
            trailerLoaded: false, // indique si la bande d'annonce est visionne ou pas
            username: "", // pseudo de l'utilisateur connecte
            movieComments: [], // commentaires du films
            newComment: "", // nouveau commentaire a ajouter
            isLiked: false, // indique si l'utilisateur connecte a like le film ou pas
            nbLikes: 0, // le nombre de likes total que le film a obtenu
            recoMovies: [], // la liste des films recommendees
            details: false, // pour savoir si on a recuperer les details du film de la page
            movieDetailsUrl: "https://lebonfilm-prod.herokuapp.com/movies?", // url pour les requetes sur les films
            movieLikeUrl: "https://lebonfilm-prod.herokuapp.com/likes?", // url pour les requetes sur les likes
            movieCommentsUrl: "https://lebonfilm-prod.herokuapp.com/comments?", // url pour les requetes sur les commentaires
            rules: { //regle pour ajouter un commentaire
                comment_length: () => !!this.newComment && this.newComment.length <= 280 || 'Comment must be less than 280 characters',
            },
        };
    },
    filters: {
        truncate: function(text, length, suffix) {
            if (text && text.length > length) {
                return text.substring(0, length) + suffix;
            } else {
                return text;
            }
        }
    },
    components: {
        LazyYoutubeVideo, //Composant pour afficher la video youtube de bande d'annonce du film
        Comments, //Composant pour afficher la liste de commentaires
        MovieGrid //Composant pour les films likes par l'utilisateur connecte
    },
    props: ["id"], // id du film
    mounted() {
        //On recupere les details du films
        this.details = false;
        axios.get(this.movieDetailsUrl+"id="+this.id)
        .then(res => {
            if (res.data.result) {
                this.movie = res.data.result;
                this.movie["new_date"] = this.movie.release_date.substring(0, 4);
                this.movie["new_rating"] = (this.movie.vote_average * 5) / 10;
                if (this.movie.keywords) {
                    this.movie["keys"] = this.movie.keywords.split(' ');
                }
                this.details = true;
                //et on recupere les likes et commentaires associés au film
                this.getLikes();
                this.getComments();
            }
        })
        .catch(() => {});
        //on recupere le pseudo de l'utilisateur connecte avec l'event envoyer par navbar
        this.$root.$on('user', (res) => {this.username = res});
    },
    updated() {
        //Une fois que l'on a les details, il faut recuperer le poster de chaque film recommandees
        //pour ça il faut parcourir la liste des films recommandees (des ids) et faire une recuperer les details pour chaque films
        if (this.details) {
            this.recoMovies = [];
            if (this.movie.recommendations) {
                this.movie.recommendations.split(" ").forEach(m => {
                    axios.get(this.movieDetailsUrl+"id="+m)
                    .then(res => {
                        if (res.data.result) {
                            this.recoMovies.push(res.data.result);
                        }
                    })
                    .catch(() => {});
                })
                this.details = false;
            }
        }
    },
    computed: {
        getFullPath() {
            return this.$route.path
        }
    },
    methods: {
        trailer() {
            this.trailerLoaded = true;
        },
        addComment() { // pour ajouter un commentaire
            if (this.newComment) {
                axios({
                        method: 'POST',
                        url: this.movieCommentsUrl,
                        data: {
                            username: this.username,
                            tmdb_id: this.id,
                            content: this.newComment
                        }
                    })
                    .then(() => {
                        this.getComments();
                    })
                    .catch(() => {})
                this.newComment = "";
            }
        },
        getComments() { // recupere les commentaires
            axios({
                method: 'GET',
                url: this.movieCommentsUrl + "id=" + this.id,
            })
            .then(res => {
                if(res.data.results) {
                    this.movieComments = res.data.results
                }
            })
            .catch(() => {})
        },
        getLikes() { // recupere les likes
            axios({
                method: 'GET',
                url: this.movieLikeUrl + "id=" + this.id,
            })
            .then(res => {
                if(res.data.results) {
                    this.nbLikes = res.data.results.length
                    this.isLiked = false
                    res.data.results.forEach(element => {
                        if (element === this.username) {
                            this.isLiked = true
                        }
                    });
                }
            })
            .catch(() => {})
        },
        like() { // on like le film (requete POST) si on ne l'a pas deja liker sinon on retire le like (requete DELETE)
            if (!this.isLiked) {
                axios({
                    method: 'POST',
                    url: this.movieLikeUrl,
                    data: {
                        username: this.username,
                        tmdb_id: this.id
                    }
                })
                .then(() => {
                    this.getLikes();
                })
                .catch(() => {})
            } else {
                axios({
                    method: 'DELETE',
                    url: this.movieLikeUrl,
                    data: {
                        username: this.username,
                        tmdb_id: this.id
                    }
                })
                .then(() => {
                    this.getLikes();
                })
                .catch(() => {})
            }
            
        },
        resetTrailer() {
            this.trailerLoaded = false;
        },
        reload() {
            //pour mettre a jour la page du film visite quand on navigue en cliquant sur un film puis un films des films recommendees et ainsi de suite
            this.details = false;
            axios.get(this.movieDetailsUrl+"id="+this.id)
            .then(res => {
                if (res.data.result) {
                    this.movie = res.data.result;
                    this.movie["new_date"] = this.movie.release_date.substring(0, 4);
                    this.movie["new_rating"] = (this.movie.vote_average * 5) / 10;
                    this.details = true;
                }
            })
            .catch(() => {});
            this.getLikes();
            this.getComments();
        }
    },
    watch: {
        nbLikes(newNbLikes) {
            this.nbLikes = newNbLikes;
        },
        isLiked(newIsLiked) {
            this.isLiked = newIsLiked;
        },
        movieComments(newMovieComments) {
            this.movieComments = newMovieComments;
        },
        recoMovies(newRecoMovies) {
            this.recoMovies = newRecoMovies;
        },
        getFullPath() {
            this.reload();
        }
    }
};
</script>

<style scoped>
.image {
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: inset 0 0 0 50vw rgb(0, 0, 0, 0.2);
}
.comment-input {
    color: white;
    border: 2px solid white;
    border-radius: 5px;
    background-color: white;
    display: block;
    text-decoration: none;
}
</style>
