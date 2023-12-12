<template>
<div class="center-body">
    <div class="loader-line-17"></div>
</div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
    .center-body {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 70vh !important;
    }
    .loader-line-17 {
        position: relative;
        background: #c60c0c;
        width: 4px;
        height: 30px;
        animation: anm-LL-17-move-1 1s ease infinite alternate;
        animation-delay: 0.20s;
    }
    .loader-line-17:before,
    .loader-line-17:after {
        content: "";
        position: absolute;
        background: #008080;
        width: 4px;
        height: 30px;
        top: 0;
        animation: anm-LL-17-move-2 1s ease infinite;
        animation-direction: alternate;
    }
    .loader-line-17:before {
        left: -8px;
    }
    .loader-line-17:after {
        left: 8px;
        animation-delay: 0.4s;
    }
    @keyframes anm-LL-17-move-1 {
        from {
            transform: translateY(20px);
        }
        to {
            transform: translateY(-16px);
        }
    }
    @keyframes anm-LL-17-move-2 {
        from {
            transform: translateY(16px);
        }
        to {
            transform: translateY(-16px);
        }
    }
</style>