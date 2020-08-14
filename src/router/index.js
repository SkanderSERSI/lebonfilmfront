import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Movie from '@/views/Movie.vue'
import Search from '@/views/Search.vue'
import Register from '@/views/Register.vue'
import Profil from '@/views/Profil.vue'
import "vue-lazy-youtube-video/dist/style.simplified.css";

Vue.use(VueRouter)
Vue.use(require('vue-moment'))
    
    const routes = [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: "/movie/:id",
            name: "Movie",
            component: Movie,
            props: true
        },
        {
            path: "/search/:name",
            name: "Search",
            component: Search,
            props: true
        },
        {
            path: "/profil/:username",
            name: "Profil",
            component: Profil,
            props: true
        }
    ]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router
