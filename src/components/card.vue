<template>
  <div>
     <div class="card mb-3 bg-transparent border-0"  style="max-width: 540px;">
            <div class="row g-0 text-light rounded-2 shadow" :style="'background:' +  card.bgColor">
                <div class="col-12 col-lg-6 py-2">
                    <div class="card-body">
                        <p class="card-title">{{card.title}}</p>
                        <p class="card-text fw-bolder mb-0" style="font-size: calc(0.6em + 1vw)">GHS {{card.amount}}</p>
                        <p class="card-text"><span class="text-lightMuted" style="font-size:13px">{{card.comment}}</span></p>
                    </div>
                </div>
                <div class="col-12 col-lg-6 py-2 d-flex justify-content-center align-items-center" style="min-height: 9vh!important;">
                  <LevelChart 
                  :innertext="card.percentage" :data="{
                    labels: ['shortfall', 'sold'],
                    datasets: [
                      {
                        backgroundColor: ['#d9d9d9', card.color],
                        data: [100 - card.percentage, card.percentage]
                      }
                    ]}" 
                  ></LevelChart>
                </div>
            </div>
        </div>
  </div>
</template>
<script>
import LevelChart from "../components/levelchart.vue"
export default {
   components:{
    LevelChart
   },
   props:{
    card:Object
   }
};
</script>
<style scoped>
.portfolio-img {
  border-radius: 50%;
  object-fit: cover;
}
.notify{
    border: 2px solid rgb(176, 176, 176) ;
}
form {
  display: flex;
  flex-direction: row;
}
.search-field {
    background-color: rgb(238, 238, 238);
    border: none;
    width: 3in !important;
    border-radius: 100px;
    outline: none;
}

.search-button {
  background: transparent;
  border: none;
  outline: none;
  margin-left: -33px;
}

.search-button svg {
  width: 20px;
  height: 20px;
  object-fit: cover;
    color: rgb(69, 69, 69);
}
.start-100 {
    left: 80% !important;
}
.top-0 {
    top: 4px !important;
}
text-lightMute{
  color:rgb(237, 237, 237);
}
</style>