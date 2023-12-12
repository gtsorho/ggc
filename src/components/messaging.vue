<template >
    <div class="m-2">
            <div class=" d-flex justify-content-around">
                <h4>Send Message</h4>
                <select style="height:30px" @change="setTemplate" v-model="selectedTemplate" class=" w-50 ms-5 form-select form-select-sm" aria-label="Small select example">
                    <option value="default" disabled>Select a Message Template</option>
                    <option v-for="(template,i) in templates" :key="i" :value="template">{{template.title}}</option>
                    <option value="3" @click="message=''">New Message</option>
                </select>
            </div>
            <hr>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Message</label>
                <textarea class="form-control" style="white-space:pre-line; font-size:13px !important"  :maxlength="maxCharacters" v-model="message" placeholder="enter message" id="exampleFormControlTextarea1" rows="5"></textarea>
            </div>
            <p class=" m-0" style="font-size:14px">Preview</p>
            <div class="p-3 border border-warning rounded-1">
                <p style="font-size:11px; white-space: pre-line;">{{msgPreview}}</p>
                <p style="font-size:11px" class="text-end">{{ remainingCharacters }}/{{maxCharacters}} characters remaining</p>
            </div>
            
            <p style="font-size:14px">Sending Message to : ({{selectedMembers.length}}) members</p>

            <button class="btn btn-sm btn-outline-warning my-3 float-end" v-if="selectedMembers.length > 0 && message.length > 0 " @click="sendMessage">send Message</button>
            <button class="btn btn-sm btn-outline-warning my-3 float-end" v-else disabled >send Message</button>


            <p class="text-success">{{successMsg}}</p>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    props:['selectedMembers'],
    data() {
        return {
            successMsg:'',
            apiKey:'tAUkX60KwFyFKzxCv4YZKdGH3',
            templates:[],
            message:'',
            maxCharacters: 158,
            selectedTemplate:'default',
            token:null
        }
    },
    created(){
        this.token = this.getCookie('token')
        if(this.token) this.getTemplates()
    },
    methods:{
        getTemplates(){
            axios.get('https://api.mnotify.com/api/template?key='+ this.apiKey)
            .then(response => {
                this.templates = response.data.template_list
            })
            .catch(error =>{
                console.log(error)
            })
        },
        sendMessage(){
            const sendSms = (member) => {
            const data = {
                recipient: member.phone,
                message: this.message.replace(/\[name\]/g, member.name.split(' ')[0]),
            };

            return axios.post('http://localhost:3000/api/members/send', data,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                })
            };

            Promise.all(this.selectedMembers.map(member => sendSms(member)))
            .then(responses => {
                responses.forEach(response => {
                setInterval(() => {
                    this.successMsg = response.data.message
                }, 5000);
                });
            })
            .catch(error => {
                console.log(error);
            });

        },
        setTemplate(){
            console.log(this.selectedTemplate)
            this.message = this.selectedTemplate.content.replace(/\[fname\]/g, '[name]');
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
    computed:{
        msgPreview(){
            return this.message.replace(/\[name\]/g, this.selectedMembers.length > 0 ? this.selectedMembers[0].name.split(' ')[0] :'Joyce');
        },
        remainingCharacters() {
        return this.maxCharacters - this.message.length;
        },
    }
}

</script>
<style>
    
</style>