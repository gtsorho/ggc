<template>
  <div>
    <Doughnut :data="data" :options="options" :plugins="plugins" />
  </div>
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'App',
  components: {
    Doughnut
  },
  props: {
    innertext:{
      type:Number,
    },
    data: {
        type: Object,
        required: true
      },
  },
data() {
    return {
        // data:{
        //   labels: ['shortfall', 'sold'],
        //   datasets: [
        //     {
        //       backgroundColor: ['#d9d9d9', '#174cfe'],
        //       data: [20, 80]
        //     }
        //   ]
        // },
        options: {
            cutout:"80%",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            }
        }
        },
        plugins: [{
        id: 'text',
        inner: this.innertext,
        beforeDraw: function(chart, a, b) {
          var width = chart.width,
            height = chart.height,
            ctx = chart.ctx;

          ctx.restore();
          var fontSize = (height / 70).toFixed(2);
          ctx.font = fontSize + "em Raleway";
          ctx.textBaseline = "middle";
          var text = `${this.inner}%`, 
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }]

    }
},
}
</script>
<style scoped>
canvas{
    width:90px !important;
}
</style>
