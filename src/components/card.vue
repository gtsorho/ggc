<template>
  <div>
     <div class="card mb-3 bg-transparent" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">{{card.title}}</h5>
                        <p class="card-text fs-4 fw-bolder mb-0">GHS {{card.amount}}</p>
                        <p class="card-text"><small class="text-muted">{{card.comment}}</small></p>
                    </div>
                </div>
                <div class="col-md-6 d-flex justify-content-center align-items-center" style="min-height: 9vh!important;">
                  <LevelChart :innertext="card.percentage" :data="{
                    labels: ['shortfall', 'sold'],
                    datasets: [
                      {
                        backgroundColor: ['#d9d9d9', card.color],
                        data: [100 - card.percentage, card.percentage]
                      }
                    ]}" 
                  />
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
</style>