<template>
<Doughnut
    :options="chartOptions"
    :data="chartData"
    :plugins="plugins"
/>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)


export default {
    name: "DoughnutChart",
    components: { 
        Doughnut 
    },
    props: {
        categoryData: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            
            styles:{
                    height: '100%'
                },
            // chartData :{
            //     labels: ['Food', 'Transport', 'School', 'Others'],
            //     datasets: [
            //         {
            //             label: 'My First Dataset',
            //             data: [300, 50, 100,50],
            //             backgroundColor:['#ff7e44', '#7967d6' ,'#8cc086','#ffc412'],
            //             hoverOffset: 4,
            //             pointStyle: 'rectRot',
            //         }
            //     ]
            // },
            chartOptions : {
                plugins:{
                    
                    legend:{
                        labels: {
                        usePointStyle: true,
                        },
                        position: 'right'
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            },
            plugins: [{
                id: 'text',
                inner: this.innertext,
                beforeDraw: function(chart, a, b) {
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;

                ctx.restore();
                var fontSize = (height / 80).toFixed(2);
                ctx.font = fontSize + "em Raleway";
                ctx.textBaseline = "middle";
                var text = "", 
                    textX = Math.round((width - ctx.measureText(text).width) / 2.7),
                    textY = height / 2;

                ctx.fillText(text, textX, textY);
                ctx.save();
                }
            }]
        };
    },
    computed:{
        chartData(){
            return {
                labels:this.categoryData[1],
                datasets: [
                    {
                        label: 'My First Dataset',
                        data: this.categoryData[0],
                        backgroundColor:['#000633', '#fdd401' ,'#36cc00','#c200ad','#00535c','#970000'],
                        hoverOffset: 4,
                        pointStyle: 'rectRot',
                    }
                ]
            }
        }
    }
};
</script>    
<style scoped>
canvas{
       max-height: 195px !important;

}
</style>