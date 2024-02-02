<template >
    <div class="container  ">
        <div class="row  p-2">
            <div class=" col mx-2 ">
                <div class="container ">
                    <div class="row border rounded-1  border-warning needs-validation pb-4"   >
                        <div class="col-md-6">
                            <label for="inputName4" class="form-label">Name</label>
                            <input type="text" required v-model="member.name"  class="form-control form-control-sm" id="inputName4" placeholder="john doe">
                        </div>
                        <div class="col-md-6">
                            <label for="inputName4" class="form-label">Location</label>
                            <input type="text" required v-model="member.location" class="form-control form-control-sm" id="inputName4" placeholder="Klagon Near ....">
                        </div>
                        <div class="col-md-6 my-2">
                            <label for="inputName4" class="form-label">Marital Status</label>
                            <select v-model="member.status" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option v-for="(value, i) in statuses" :key="i"  :value="value">{{value}}</option>
                            </select>                        
                        </div>
                        <div class="col-md-6 my-2">
                            <label for="inputName4" class="form-label">Department</label>
                            <select v-model="member.department" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option v-for="(value, i) in departments" :key="i"  :value="value">{{value}}</option>
                            </select>                        
                        </div>
                        <div class="col-md-6 my-2">
                            <label for="inputName4" class="form-label">Ministry</label>
                            <select v-model="member.ministry" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option v-for="(value, i) in ministries" :key="i"  :value="value">{{value}}</option>
                            </select>                        
                        </div>
                        <div class="col-md-6 my-2">
                            <label for="inputName4" class="form-label">Cell</label>
                            <select v-model="member.cell" class="form-select form-select-sm rounded-pill" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option v-for="(value, i) in cells" :key="i"  :value="value">{{value}}</option>
                            </select>                        
                        </div>
                            <div class="col-md-4 my-2">
                            <label for="inputName4" class="form-label">Date of Birth</label>
                            <input type="date" v-model="member.dob" required  class="form-control  rounded-pill px-3 form-control-sm" id="inputName4" >
                        </div>
                         <div class="col-md-6">
                            <label for="inputName4" class="form-label">Phone 01</label>
                            <input type="text" required v-model="member.phone" class="form-control form-control-sm" id="inputName4" placeholder="024 xxx xxxx">
                        </div>
                         <div class="col-md-6">
                            <label for="inputName4" class="form-label">Phone 02</label>
                            <input type="text" v-model="member.phone_two"  class="form-control form-control-sm" id="inputName4" placeholder="023 xxx xxxx">
                        </div>
                        <div class="col-md-8">
                            <label for="inputName4" class="form-label">Profession</label>
                            <input type="text" v-model="member.profession"  class="form-control form-control-sm" id="inputName4" placeholder="Tailor">
                        </div>
                         <div class="col-md-12 d-flex align-items-end justify-content-between my-2 ">
                            <div>
                                <button class="btn btn-sm btn-outline-warning" v-if="!update" id="inputName4" type="submit" @click="createMember()" placeholder="john doe">Save</button>
                                <button class="btn btn-sm btn-outline-info mx-1" @click="updateMember" v-else id="inputName4"  placeholder="john doe">update</button>
                                <button class="btn btn-sm btn-success" v-if="update" @click="update = false, member={  name:null, location:null,phone:null,phone_two:null,profession:null}" id="inputName4" placeholder="john doe">+</button>
                            </div>
                            <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-responsive my-3"  style="max-height:4in">
                        <table class="table table-hover " style="font-size:14px">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 20px;"> 
                                    <input class="form-check-input"  type="checkbox" v-model="selectAll" @change="selectAllItems" id="flexCheckDefault">
                                </th>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Phone 01</th>
                                <th scope="col">Phone 02</th>
                                <th scope="col">Profession</th>
                                <th scope="col">Location</th>
                                <th scope="col" class="d-flex justify-content-center ">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(member, i) in members" :key="i">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="member"  id="flexCheckDefault">
                                </div>
                                </td>
                                <td>{{i +1}}</td>
                                <td>{{member.name}}</td>
                                <td>{{member.phone}}</td>
                                <td>{{member.phone_two}}</td>
                                <td>{{member.profession}}</td>  
                                <td>{{member.location}}</td>  
                                <td class="d-flex justify-content-center ">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignMember(member)"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteMember(member.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <div class="col border rounded-1 border-warning">
                <Messaging :selectedMembers="selectedItems"/>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Messaging from '../components/messaging.vue'

export default {
    components: {
        Messaging
    },
      props: {
    navData:Object
  },
    data() {
        return {
            statuses:['single','married','child'],
            cells:['open house','glory chapel','porters', 'kodesh','N/A'],
            departments:['protocol','music', 'N/A'],
            ministries:['women','men','youth','children'],
            update:false,
            members:[],
            selectedItems: [],
            selectAll: false,
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
        if(this.token) this.getMembers()
    },
    methods:{
        selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.members.map(member => member);
            } else {
                this.selectedItems = [];
            }
        },
        assignMember(data){
            this.member = data
            this.update = true
        },
        getType(index){
            return this.typeofDept[index]
        },
        createMember(){            
            axios.post('http://ggc.pangtresses.com/api/members/', this.member,
                      { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getMembers()
                })
            .catch(error =>{
                this.msg = error.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
                // console.log(error)
            })
        },
        updateMember(){
            axios.post('http://ggc.pangtresses.com/api/members/update/'+this.member.id, this.member,
                      { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getMembers()
                })
            .catch(error =>{
                this.msg = error.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
                // console.log(error)
            })
        },
        deleteMember(id){
            axios.get('http://ggc.pangtresses.com/api/members/delete/'+ id,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getMembers()
            })
            .catch(error =>{
                console.log(error)
            })
        }, 
        deleteSelectedItems() {
            const deletePromises = this.selectedItems.map(member =>
                axios.delete(`http://ggc.pangtresses.com/api/members/delete/${member.id}`,           
                { headers:{'Authorization': `Bearer ${this.token}`}}));
            Promise.all(deletePromises)
            .then(responses => {
            console.log('Items deleted successfully', responses);
            })
            .catch(error => {
            console.error('Error deleting items', error);
            });
        },
        getMembers(){
            axios.get('http://ggc.pangtresses.com/api/members/',
                      { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.members =  response.data
            })
            .catch(error =>{
                console.log(error)
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
    },
    watch:{
        navData(newData, oldData){
        if(newData || newData != null){
            this.members = newData
        }else{
            this.getMembers()
        }
        }
    },
}
</script>
<style >
    
</style>