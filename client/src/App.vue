<template>
	<div id="main">
		<div id="bg"></div>
		
		<div class="preloader">
			<div class="lds-ripple"><div></div><div></div></div>
		</div>

		<div class="container">
			<h1 class="main-headline">
				Battleship
				<!-- <span class="small">by Lorenz Hohmann</span> -->
			</h1>

			<router-view />
		</div>
	</div>
</template>
<style>
.preloader {
  width: 100vw;
  height: 100vh;
  background: #FFF;
  display: block;
  position: absolute;
  z-index: 99999;
}
.lds-ripple {
  display: inline-block;
  position: absolute;
  width: 64px;
  height: 64px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #08628a;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>