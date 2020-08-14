<template>
    <v-container :style="{ backgroundImage: 'url(' + require('@/assets/landingRegister.png') + ')' }" class="background-img" fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card raised>
                    <v-card-title class="justify-center">
                        <img class="ma-8" width="300" src="@/assets/logo.png" />
                    </v-card-title>
                    <v-toolbar color="light-blue" dark flat>
                        <v-spacer></v-spacer>
                        <v-toolbar-title class="headline font-weight-black">Sign up for an account</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field color="black" ref="username" v-model="form['username']" label="Username" type="text" :rules="[rules.required]"></v-text-field>
                            <v-text-field color="black" ref="password" v-model="form['password']" label="Password" type="password" :rules="[rules.required]"></v-text-field>
                            <v-text-field color="black" ref="lastname" v-model="form['lastname']" label="Lastname" type="text" :rules="[rules.required]"></v-text-field>
                            <v-text-field color="black" ref="firstname" v-model="form['firstname']" label="Firstname" type="text" :rules="[rules.required]"></v-text-field>
                            <v-text-field color="black" ref="email" v-model="form['email']" label="Email" type="text" :rules="[rules.required, rules.email]"></v-text-field>
                        </v-form>
                        <div class="mb-4">
                            <v-alert dense v-if="error" text color="error">{{ errorMessage }}</v-alert>
                            <v-alert dense v-if="success" text color="success">{{ successMessage }}</v-alert>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <router-link class="sign-in-btn ma-4" :to="{name: 'Login'}">Login</router-link>
                        <v-btn @click="register" color="light-blue" class="mr-4 white--text">
                            <div class="font-weight-black subtitle-1">Sign up</div>
                        </v-btn>
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
            
            //pour les messages si succes
            successMessage: "",
            success: false, 
            
            rules: { //regle a verifier avant de pouvoir s'inscrire
                required: value => !!value || "Required.",
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value) || "Invalid e-mail.";
                }
            },
            newUserUrl: "https://lebonfilm-prod.herokuapp.com/users" //l'url pour s'inscrire en faisant un POST
        };
    },
    methods: {
        register() {
            this.error = false;
            this.errorMessage = "";
            this.success = false;
            this.successMessage = "";
            //Si un des champs n'est pas renseigne on ne peut pas s'inscrire
            if (!(this.form["username"] && this.form["password"] && this.form["lastname"] && this.form["firstname"] && this.form["email"])) {
                this.$refs["username"].validate(true);
                this.$refs["password"].validate(true);
                this.$refs["lastname"].validate(true);
                this.$refs["firstname"].validate(true);
                this.$refs["email"].validate(true);
            } else {
                axios
                .post(
                    this.newUserUrl, 
                    {
                        username: this.form["username"],
                        password: this.form["password"],
                        lastname: this.form["lastname"],
                        firstname: this.form["firstname"],
                        email: this.form["email"]
                    }
                )
                .then(res => {
                    this.success = true;
                    this.successMessage = res.data.message;
                    //redirection si succes
                    setTimeout(() => this.$router.push("/login"), 2000);
                })
                .catch(err => {
                    //message d'erreur si erreur
                    if (err.response.status == 400) {
                        this.error = true
                        this.errorMessage = err.response.data.error
                    }
                })
            }
            //on enleve les messages d'erreurs
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
.sign-in-btn {
    text-decoration: none;
    display: block;
    color: #03a9f4;
}
.sign-in-btn:hover {
    text-decoration: underline;
    color: #03a9f4;
}
</style>
