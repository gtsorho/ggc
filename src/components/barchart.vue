<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  props: {
  monthlyData: {
      type: Array,
      required: true
    },
  },
  components: { Bar },
  data() {
    return {
    };
  },
  created(){
    // this.chartData.datasets[0].data = this.monthlyData
    // console.log(this.monthlyData)
  },
  computed:{
    chartData(){
      return  {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "June",
          "July",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec",

        ],
        datasets: [
          {
            data: this.monthlyData,
            label: "Total",
            backgroundColor: "#ffc412",
            barThickness: "15",
            borderRadius: 500,
            borderSkipped: false,
          },
          {
            data: Array.from({ length: 12 }, () => Math.max(...this.monthlyData) +20),
            label: "Ref Max",
            backgroundColor: "#d9d9d9",
            barThickness: "15",
            borderRadius: 0,
            borderSkipped: false,
          },
        ],
      }
    },
    chartOptions(){
      return {
        plugins: {
            tooltip:{
                enabled:true
            },
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: true,
            },
          },
          y: {
            stacked: true,
            min: 0,
            max:Math.max(...this.monthlyData) +20,
            grid: {
              display: true,
            },
             ticks: {
                stepSize: 20
            }
          },
        },
      }
    }
  }
};
</script>
<style scoped>
canvas {
  max-height: 200px !important;
}
</style>