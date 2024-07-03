<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

/* 回到首页 */
const backHome = () => {
  router.replace("/");
};
</script>
<template>
  <div class="background-img">
    <div class="wrapper">
      <div class="img-wrapper">
        <span>44</span>
      </div>
      <p>Oops...看起来你进入了另一个星球</p>
      <button @click="backHome" type="button">回到首页</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.background-img {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url("@/assets/bg_purple.jpg");
  background-repeat: repeat-x;
  background-size: cover;
  background-position: left top;

  .wrapper {
    position: absolute;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    width: fit-content;
    text-align: center;
    z-index: 4;

    span {
      &:first-letter {
        letter-spacing: 12vmax;
      }
      position: relative;
      color: #fff;
      font-weight: 900;
      font-size: 20.4em;
      display: block;
      overflow: hidden;
      width: fit-content;
      height: max-content;
      &:before {
        content: "";
        background-image: url("@/assets/404.png");
        position: absolute;
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        animation: rotateIn 0.5s ease-out;
      }
    }
    p {
      text-align: center;
      font-style: italic;
      font-weight: 400;
      color: #fff;
      margin-top: 0;
      line-height: 22px;
      margin-bottom: 10px;
    }

    button {
      background-color: #f96e4d;
      border: 0;
      font-size: 16px;
      font-style: italic;
      padding: 11px 22px;
      border-radius: 50px;
      color: #fff;
      margin-top: 10px;
      cursor: pointer;
      font-weight: 900;
    }
  }

  @keyframes rotateIn {
    from {
      transform: rotate(0deg) scale(0.2);
      opacity: 0;
    }
    to {
      transform: rotate(360deg) scale(1);
      opacity: 1;
    }
  }
}
</style>
