<template>
    <div class="trello-skeleton">
        <div class="skeleton-card-list" v-for="(item, index) in Array(3).fill(null)" :key="index">
            <div class="card mb-3" v-for="(item, index) in Array(5).fill(null)" :key="index">
                <div class="skeleton-container">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="d-flex justify-between items-center box position-relative">
                        <div class="position-absolute" v-for="(item, index) in Array(5).fill(null)" :key="index">
                            <div class="skeleton skeleton-avatar" :style="{ left: `${index * 15}px`, zIndex: index }">
                            </div>
                        </div>
                        <div class="position-absolute end-0 d-flex gap-4 pb-0">
                            <div class="skeleton skeleton-box mb-0"></div>
                            <div class="skeleton skeleton-box mb-0"></div>
                        </div>
                    </div>
                    <div class="divide mb-3"></div>
                    <div class="d-flex gap-1 shrink-0 flex-wrap m-0 p-0">
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                        <div class="skeleton skeleton-box"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.trello-skeleton {
    max-height: calc(100vh - 5.2rem);
    overflow: hidden;
    width: 100%;
    display: flex;
    gap: 20px;
}

.card-list {
    height: 100% !important;
}

.card {
    padding: 10px 20px;
    background-color: #e6ecfa;
}

.card .skeleton-container .skeleton {
    background-color: #aab0d0;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
}

.card .skeleton-container .skeleton::before {
    content: "";
    display: block;
    position: absolute;
    left: -100%;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
    animation: shimmer 0.9s infinite;
}

.card .skeleton-container .skeleton.skeleton-text {
    height: 10px;
    width: 100%;
    margin-bottom: 10px;
}

.card .skeleton-container .skeleton.skeleton-text:last-of-type {
    width: 80%;
}

.card .skeleton-container .skeleton.skeleton-avatar {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    border: 2px solid #fff;
}

.card .skeleton-container .skeleton.skeleton-box {
    height: 25px;
    width: 55px;

    margin-bottom: 10px;
}

.divide {
    height: 2px;
    width: 100%;
    background: #cfd4f3;
}

.box {
    height: 55px;
    display: flex;
    align-items: center;
}


.skeleton-card-list {
    width: 290px;
}

@media (min-width: 768px) {
    .skeleton-card-list {
        width: 360px;
    }
}

@media (min-width: 992px) {
    .skeleton-card-list {
        width: 460px;
    }
}

@keyframes shimmer {
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
}
</style>