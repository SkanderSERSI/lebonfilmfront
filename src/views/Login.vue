<template>
    <v-container :style="{ backgroundImage: 'url(' + require('@/assets/landingLogin.png') + ')' }" class="background-img" fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card raised>
                    <v-card-title class="justify-center">
                        <img class="ma-8" width="300" src="@/assets/logo.png" />
                    </v-card-title>
                    <v-toolbar color="light-blue" dark flat>
                        <v-spacer></v-spacer>
                        <v-toolbar-title class="headline font-weight-black">Le bon film pour vous.</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field color="black" ref="username" v-model="form['username']" label="Username" type="text" :rules="[rules.required]"></v-text-field>
                            <v-text-field color="black" ref="password" v-model="form['password']" label="Password" type="password" :rules="[rules.required]"></v-text-field>
                        </v-form>
                        <div class="mb-4">
                            <v-alert dense v-if="error" text color="error">{{ errorMessage }}</v-alert>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="login" color="light-blue" class="mr-4 white--text">
                            <div class="font-weight-black subtitle-1">Login</div>
                        </v-btn>
                        <router-link class="sign-up-btn ma-4" :to="{name: 'Register'}">Sign up</router-link>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data: function() {
        return {
            form: {}, //objet representant le formulaire

            // pour les messages d'erreurs
            errorMessage: "",
            error: false,

            rules: { //regle a verifier avant de pouvoir se connecter
                required: value => !!value || "Required."
            },
            loginUserUrl: "https://lebonfilm-prod.herokuapp.com/login" //l'url pour se connecter en faisant un POST
        };
    },
    methods: {
        login() {
            this.error = false;
            this.errorMessage = "";
            //Si un des champs n'est pas renseigne on ne peut pas se connecter
            if (!(this.form["username"] && this.form["password"])) {
                this.$refs["username"].validate(true);
                this.$refs["password"].validate(true);
            } else {
                axios({
                    method: 'POST',
                    url: this.loginUserUrl,
                    data: {
                        username: this.form["username"],
                        password: this.form["password"]
                    },
                    withCredentials: true // car requete CORS necessaire pour la session
                })
                .then(() => {
                    //redirection vers la page d'accueil en cas de connexion reussi
                    this.$router.push({
                        name: "Home"
                    });
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.error = true
                        this.errorMessage = err.response.data.error
                    }
                })
            }
            setTimeout(() => {this.error = false;}, 2000);
        }
    }
};
</script>

<style scoped>
.background-img {
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.sign-up-btn {
    text-decoration: none;
    display: block;
    color: #03a9f4;
}
.sign-up-btn:hover {
    text-decoration: underline;
    color: #03a9f4;
}
</style>
