<template >
  <div v-if="welcome" class="welcome d-flex align-items-center  mx-0  row">
    <div class="col">
          <img class="w-100" src='../assets/welcome.svg' alt="">        
    </div>
    <div class="col d-flex align-items-center justify-content-center">
      <h1 class="fw-bolder text-light "  style="font-size:60px;"> <span class="text-warning" style="font-size:90px; letter-spacing: 10px!important;">NYX</span> <br> <span class="text-warning">B</span>udget <span class="text-warning">P</span>lanner</h1>
    </div>
  </div>
	<div v-else class="d-flex justify-content-center align-items-center something" style="min-height: 80vh!important;">
		<div class="row main-content bg-success text-center shadow-lg">
			<div class="col-md-4 text-center company__info">
				<span class="company__logo"> 
                    <!-- <img src="../assets/logo.png" width="70" alt=""> -->
                </span>
				<h1 class="company_title "><h1 class="fw-bolder text-light "  style="font-size:20px;letter-spacing: 1px"> <span class="text-light" style="font-size:60px; letter-spacing: 10px!important;">NYX</span> <br> <span class="text-dark">B</span>udget <span class="text-dark">P</span>lanner</h1></h1>
			</div>
			<div class="col-md-8 col-xs-12 col-sm-12 login_form ">
				<div class="container-fluid">
					<div class="row mt-3">
						<h4>{{hasAccount ? 'Signin' : 'Signup'}}</h4>
					</div>
					<div class="row">
						<div  class="form-group" >
							<div class="row">
								<input type="text" v-model="creds.username" name="username" id="username" class="form__input form-control-sm" placeholder="Username">
							</div>
              <div v-if="!hasAccount">
                <div class="row">
								  <input type="text" v-model="creds.fullname" name="fullname" id="fullname" class="form__input form-control-sm" placeholder="Fullname">
							  </div>
                <div class="d-flex  justify-content-start mt-2">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input form-check-input-sm" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
                    <label class="form-check-label" for="inlineRadio1">Male</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input form-check-input-sm" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
                    <label class="form-check-label" for="inlineRadio2">Female</label>
                  </div>
                </div>
                <div class="row">
					<input type="email" v-model="creds.email" name="email" id="email" class="form__input form-control-sm" placeholder="email">
				</div>
                <div class="row">
					<input type="text" v-model="creds.phone" name="phone" id="phone" class="form__input form-control-sm" placeholder="phone">
				</div>
                <QuestionSlide v-if="showSlide" />
                <!-- <button class="btn btn-sm btn-outline-warning" v-else @click="startSlide">Start Slide</button> -->
              </div>
				<div class="row">
					<input type="password" v-model="creds.password" name="password" id="password" class="form__input form-control-sm" placeholder="Password">
				</div>
              <div class="row">
					<input v-if="!hasAccount" type="password" v-model="creds.confirmPassword" name="confirmPassword" id="confirmPassword" class="form__input form-control-sm" placeholder="confirmPassword">
				</div>
				<div class="row">
					<p :class="msgColor" class="text-capitalize" style="font-size:13px">{{msg}}</p>
                <a class="btn btn-sm  mx-auto btn-outline-warning" @click="login()" >Sign In</a>
					<!-- <input type="button" value="Submit" @click="login" class="btn btn-sm mx-auto"> -->
				</div>
              <!-- <span style="font-size:13px" class="muted">I don't have an account <a href="#" @click="hasAccount = !hasAccount" >{{hasAccount ? 'Signup' : 'Signin'}}</a> </span> -->
              <br>
              <!-- <router-link :to="{name:'expense'}">page</router-link> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
import QuestionSlide from "@/components/questionSlide.vue";

import axios from 'axios'
export default {
    components: {
      QuestionSlide,
    },
    data() {
        return {
          welcome:false,
          showSlide: true,
          hasAccount:true,
		  msgColor:null,
		  msg:'',
            creds:{
                username:'',
                password:''
            }
        }
    },
    created(){
      this.welcome = true
      setInterval(() => {
        this.welcome = false
      }, 5000);
    },
    methods:{
        login(){
            axios.post('http://ggc.pangtresses.com/api/users/login', this.creds,
            )
            .then((response) => {
                this.setCookie('token', response.data)
                this.$router.push({name: 'dashboards'})
            })
            .catch((error) => {
				this.msg = error.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
                // console.log(error);
            });
        },
        getCookie(cname){
          let name = cname + "=";
          let ca = document.cookie.split(';');
          for(let i = 0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
              c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
              }
          }
          return "";
        },
        setCookie(cname, cvalue, exdays) {
          const d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          let expires = "expires=" + d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";"+ expires + ";path=/";
        },
    },
}
</script>
<style scoped>
/* img{
	max-height: 3in;
    object-fit: cover;
} */
.welcome{
  background-image: linear-gradient(45deg, rgb(0 0 0) , rgb(255 235 178));
  height: inherit;
}

.main-content{
	width: 50%;
	border-radius: 20px;
	margin: 5em auto;
	display: flex;
}
.company__info{
	background-color: #ffc107;
	border-top-left-radius: 20px;
	border-bottom-left-radius: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: #fff;
}
.fa-android{
	font-size:3em;
}
@media screen and (max-width: 640px) {
	.main-content{width: 90%;}
	.company__info{
		border-top-right-radius: 20px;
		padding-block: 20px;
	}
	.login_form{
		border-top-left-radius:20px;
		border-bottom-left-radius:20px;
	}
}
@media screen and (min-width: 642px) and (max-width:800px){
	.main-content{width: 70%;}
}
.row > h4{
	color:#ffc107;
}
.login_form{
	background-color: #fff;
	border-top-right-radius:20px;
	border-bottom-right-radius:20px;
	border-top:1px solid #ccc;
	border-right:1px solid #ccc;
}
form{
	padding: 0 2em;
}
.form__input{
	width: 100%;
	border:0px solid transparent;
	border-radius: 0;
	border-bottom: 1px solid #aaa;
	padding: .1em .1em .1em;
	padding-left: 2em;
	outline:none;
	margin:.5em auto;
	transition: all .5s ease;
}
.form__input:focus{
	border-bottom-color: #ffc107;
	box-shadow: 0 0 5px #ffc1078d; 
	border-radius: 4px;
}
.btn{
	transition: all .5s ease;
	width: 70%;
	border-radius: 30px;
	color:#ffc107;
	font-weight: 600;
	background-color: #fff;
	border: 1px solid #ffc107;
	margin-top: 1.5em;
	margin-bottom: 1em;
}
.btn:hover, .btn:focus{
	background-color: #ffc107;
	color:#fff;
}
</style>