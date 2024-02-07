<template >
    <div class="container p-5 shadow-lg m-auto my-5" style="max-width:7in">
        <label for="member" class="fw-bolder py-3">New Membership</label>
        <div class="row border rounded-1 shadow  border-warning needs-validation pb-4 p-4"   >
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
            statuses:['single','married','child'],
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