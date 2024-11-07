<template >
    <div class="container px-0 mx-0  col cardBg " style="min-height: 100vh; min-width: -moz-available;">
        <div class="container navHead w-100" style="max-width: 100%;">
			<nav class="navbar navbar-expand-lg ftco_navbar ftco-navbar-light" id="ftco-navbar">
		    <div class="container">
                <img  style="width:60px;"  src="../assets/logo.png">
                <h5 class="fw-bolder">Greater Grace Chapel Assemblies of God</h5>
		    	<!-- <div class="social-media order-lg-last">
		    		<p class="mb-0 d-flex">
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-facebook"><i class="sr-only">Facebook</i></span></a>
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-twitter"><i class="sr-only">Twitter</i></span></a>
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-instagram"><i class="sr-only">Instagram</i></span></a>
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-dribbble"><i class="sr-only">Dribbble</i></span></a>
		    		</p>
	            </div> -->
		      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
		        <span class="fa fa-bars"></span> Menu
		      </button>
		      <!-- <div class="collapse navbar-collapse" id="ftco-nav">
		        <ul class="navbar-nav ml-auto mr-md-3">
		        	<li class="nav-item active"><a href="#" class="nav-link">Home</a></li>
		        	<li class="nav-item"><a href="#" class="nav-link">About</a></li>
		        	<li class="nav-item"><a href="#" class="nav-link">Work</a></li>
		        	<li class="nav-item"><a href="#" class="nav-link">Blog</a></li>
		          <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
		        </ul>
		      </div> -->
		    </div>
		  </nav>
        </div>
                <div style="max-width:8in" class="mx-auto">
            <label for="member" class="fw-bolder py-3">New Membership</label>
            <div class="row cardBg needs-validation pb-4 p-4"   >
                <div class="col-md-12 my-2">
                    <label for="inputName4" class="form-label">Name <span class="text-danger fw-bold fs-6">!</span></label>
                    <input type="text" required v-model="member.name"  class="form-control  rounded-pill px-3 form-control-sm" id="inputName4" placeholder="john doe">
                </div>
                <div class="col-md-6 my-2">
                    <label for="inputName4" class="form-label">Location <span class="text-danger fw-bold fs-6">!</span> </label>
                    <input type="text" required v-model="member.location" class="form-control  rounded-pill px-3 form-control-sm" id="inputName4" placeholder="Klagon Near ....">
                </div>
                <div class="col-md-6 my-2">
                    <label for="inputName4" class="form-label">Marital Status <span class="text-danger fw-bold fs-6">!</span></label>
                    <select v-model="member.status" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option v-for="(value, i) in statuses" :key="i"  :value="value">{{value}}</option>
                    </select>                        
                </div>
                <div class="col-md-6 my-2">
                    <label for="inputName4" class="form-label">Department  <span class="text-danger fw-bold fs-6">!</span></label>
                    <select v-model="member.department" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option v-for="(value, i) in departments" :key="i"  :value="value">{{value}}</option>
                    </select>                        
                </div>
                <div class="col-md-6 my-2">
                    <label for="inputName4" class="form-label">Ministry  <span class="text-danger fw-bold fs-6">!</span></label>
                    <select v-model="member.ministry" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option v-for="(value, i) in ministries" :key="i"  :value="value">{{value}}</option>
                    </select>                        
                </div>
                <div class="col-md-6 my-2">
                    <label for="inputName4" class="form-label">Cell  <span class="text-danger fw-bold fs-6">!</span></label>
                    <select v-model="member.cell" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option v-for="(value, i) in cells" :key="i"  :value="value">{{value}}</option>
                    </select>                        
                </div>
                    <div class="col-md-4 my-2">
                    <label for="inputName4" class="form-label">Date of Birth <span class="text-danger fw-bold fs-6">!</span></label>
                    <input type="date" v-model="member.dob" required  class="form-control  rounded-pill px-3 form-control-sm" id="inputName4" >
                </div>
                <div class="col-md-6 offset-md-3"></div>
                <div class="col-md-6 my-2">
                    <label for="inputName4" class="form-label">Phone 01 <span class="text-danger fw-bold fs-6">!</span></label>
                    <input type="text" required v-model="member.phone" class="form-control  rounded-pill px-3 form-control-sm" id="inputName4" placeholder="024 xxx xxxx">
                </div>
                <div class="col-md-6 my-2">
                    <label for="inputName4" class="form-label">Phone 02 <span class="text-primary">(optional)</span> </label>
                    <input type="text" v-model="member.phone_two"  class="form-control  rounded-pill px-3 form-control-sm" id="inputName4" placeholder="023 xxx xxxx">
                </div>
                <div class="col-md-8 my-2">
                    <label for="inputName4" class="form-label">Profession <span class="text-danger fw-bold fs-6">!</span></label>
                    <input type="text" v-model="member.profession"  class="form-control  rounded-pill px-3 form-control-sm" id="inputName4" placeholder="Officer">
                </div>
                <div class="col-md-12 my-2 d-flex align-items-end justify-content-between ">
                    <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                    <div class="my-2">
                        <button class="btn btn-sm btn-outline-warning rounded-pill px-5 " id="inputName4" type="submit" @click="createMember()" placeholder="john doe">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>
<script>
import axios from 'axios'
export default {
    components: {
    },
      props: {
    navData:Object
  },
    data() {
        return {
            statuses:['single','married','minor'],
            cells:['open house','glory chapel','porters', 'kodesh', 'sureReigners','N/A'],
            departments:['protocol','music', 'N/A'],
            ministries:['women','men','youth','children'],
            msgColor:null,
		    msg:'',
            member:{
                name:null,
                location:null,
                phone:null,
                phone_two:null,
                profession:null,
                dob:null,
                status:'single',
                ministry:'youth',
                department:'N/A',
                cell:'N/A'
            },
            token:null
        }
    },
    created(){
        this.token = this.getCookie('token')
    },
    methods:{
        createMember(){            
            axios.post('http://admin.greatergraceag.com/api/members/', this.member,
                      { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.msg = 'Saved Successfully'
                this.msgColor = 'text-success'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
            })
            .catch(error =>{
                this.msg = error.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
            })
        },
        getCookie(cname) {
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
    }
}
</script>
<style scoped >
    .form-label{
        font-size: 13px !important;
        margin-bottom: 0px;
        margin-left: 10px;
    }
</style>