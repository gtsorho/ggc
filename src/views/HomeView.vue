<template>
	<div class="welcome d-flex align-items-center  mx-0  row">
		<div class="col">
			<img style="width: 90%;" src='../assets/welcome3.svg' alt="">
		</div>
		<div class="main-content bg-transparent text-center">
			<div class="col-md-8 col-xs-12 col-sm-12 login_form mx-auto w-50 rounded-2">
				<div class="container-fluid">
					<div class="row mt-3">
						<span class="company__logo  mb-5">
							<img src="../assets/logo1.png" width="170" alt="">
						</span>
						<h4 class="fw-bolder" style=" font-size: 14px ;">{{ hasAccount ? 'Signin' : 'Signup' }}</h4>
					</div>
					<div class="row">
						<div class="form-group px-5">
							<div class="row">
								<input type="text" v-model="creds.username" name="username" id="username"
									class="form__input form-control-sm shadow-sm" placeholder="Username">
							</div>
							<div v-if="!hasAccount">
								<div class="row">
									<input type="text" v-model="creds.fullname" name="fullname" id="fullname"
										class="form__input form-control-sm" placeholder="Fullname">
								</div>
								<div class="d-flex  justify-content-start mt-2">
									<div class="form-check form-check-inline">
										<input class="form-check-input form-check-input-sm" type="radio"
											name="inlineRadioOptions" id="inlineRadio1" value="option1">
										<label class="form-check-label" for="inlineRadio1">Male</label>
									</div>
									<div class="form-check form-check-inline">
										<input class="form-check-input form-check-input-sm" type="radio"
											name="inlineRadioOptions" id="inlineRadio2" value="option2">
										<label class="form-check-label" for="inlineRadio2">Female</label>
									</div>
								</div>
								<div class="row">
									<input type="email" v-model="creds.email" name="email" id="email"
										class="form__input form-control-sm" placeholder="email">
								</div>
								<div class="row">
									<input type="text" v-model="creds.phone" name="phone" id="phone"
										class="form__input form-control-sm" placeholder="phone">
								</div>
								<QuestionSlide v-if="showSlide" />
								<!-- <button class="btn btn-sm btn-outline-warning" v-else @click="startSlide">Start Slide</button> -->
							</div>
							<div class="row">
								<input type="password" v-model="creds.password" name="password" id="password"
									class="form__input form-control-sm shadow-sm" placeholder="Password">
							</div>
							<div class="row">
								<input v-if="!hasAccount" type="password" v-model="creds.confirmPassword"
									name="confirmPassword" id="confirmPassword" class="form__input form-control-sm"
									placeholder="confirmPassword">
							</div>
							<div class="row mb-5">
								<p :class="msgColor" class="text-capitalize" style="font-size:13px">{{ msg }}</p>
								<a class="btn btn-sm w-100  shadow mx-auto" @click="login()">Sign In</a>
							</div>
							<br>
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
			welcome: false,
			showSlide: true,
			hasAccount: true,
			msgColor: null,
			msg: '',
			creds: {
				username: '',
				password: ''
			}
		}
	},
	created() {
		this.welcome = true
		setInterval(() => {
			this.welcome = false
		}, 5000);
	},
	methods: {
		login() {
			axios.post('http://admin.greatergraceag.com/api/users/login', this.creds,
			)
				.then((response) => {
					this.setCookie('token', response.data)
					this.$router.push({ name: 'dashboards' })
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
		getCookie(cname) {
			let name = cname + "=";
			let ca = document.cookie.split(';');
			for (let i = 0; i < ca.length; i++) {
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
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		},
	},
}
</script>
<style scoped>
/* img{
	max-height: 3in;
    object-fit: cover;
} */
.welcome {
	background-image: linear-gradient(45deg, rgba(4, 1, 71, 0.682), rgb(9, 0, 46));
	height: inherit;
}

.main-content {
	width: 50%;
	margin: 5em auto;
}

.company__info {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.fa-android {
	font-size: 3em;
}

@media screen and (max-width: 640px) {
	.main-content {
		width: 90%;
	}

	.company__info {
		border-top-right-radius: 20px;
		padding-block: 20px;
	}

	.login_form {
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
	}
}

@media screen and (min-width: 642px) and (max-width:800px) {
	.main-content {
		width: 70%;
	}
}

.row>h4 {
	color: #040154;
}

.login_form {
	background-color: #f3f3f3;
	border-top: 1px solid #ccc;
	border-right: 1px solid #ccc;
}

form {
	padding: 0 2em;
}

.form__input {
	width: 100%;
	border-radius: 2;
	border: 1px solid #bbbbbb7d;
	background: #bbbbbb48;
	/* color:#fff; */
	padding: .1em .1em .1em;
	padding-left: 2em;
	outline: none;
	margin: .5em auto;
	transition: all .5s ease;
}

.form__input:focus {
	border-color: #040154;
	box-shadow: 0 0 5px #0401548d;
	border-radius: 4px;
	background: #f0f0f0;
}

.btn {
	transition: all .5s ease;
	width: 70%;
	border-radius: 3px;
	color: #040154;
	font-weight: 600;
	background-color: #ffffff00;
	border: 1px solid #040154;
	margin-top: 1.5em;
	margin-bottom: 1em;
}

.btn:hover,
.btn:focus {
	background-color: #040154;
	color: #fff;
}
</style>