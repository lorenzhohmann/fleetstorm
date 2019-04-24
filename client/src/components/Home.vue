<template>
	<div>
		<div class="preloader">
			<div class="lds-ripple">
				<div></div>
				<div></div>
			</div>
		</div>

		<div id="main-bg" class="parallax"></div>

		<nav class="navbar navbar-light bg-light d-none">
			<a class="navbar-brand" href="/game/create" title="Schnellstart ;)">
				<img
					src="../../public/img/favicon.png"
					width="30"
					height="30"
					class="d-inline-block align-top"
					alt=""
				/>
				FleetStorm
			</a>
		</nav>

		<div class="section intro-section p-5 animated fadeIn delay-2s">
			<h1 class="mb-3 mb-sm-2 mb-md-0">
				<img
					src="../../public/img/logo.png"
					alt="FleetStorm Logo"
					class="logo pt-5 animated fadeIn delay-1s"
				/>
			</h1>
			<h2
				class="text-center text-light mt-0 mt-md-n5 subtitle animated fadeInUp delay-2s"
			>
				Spiele im Team oder alleine und versenke die gegnerischen Flotten!
			</h2>
			<div class="text-center animated fadeIn delay-3s mt-5 mt-md-0">
				<a
					href="/start"
					class="btn btn-lg btn-success text-uppercase px-5 animated pulse infinite slower delay-2s mt-5"
				>
					Jetzt Spielen!
				</a>
			</div>
			<span class="small text-center mt-5 d-block"
				><a class="text-light" href="#why-we"
					>Neugierig? Das macht uns einmalig!</a
				></span
			>
		</div>
		<div class="section half-section why-we-section p-5" id="why-we">
			<div class="row animated fadeInUp delay-2s">
				<div class="col-12 col-md-6 col-lg-4 mb-5">
					<span class="big-icon d-block text-center text-primary mb-3 mb-sm-0"
						><i class="fas fa-comment-dollar"></i
					></span>
					<h3 class="text-dark text-weight-bold border-0 text-center">
						Kostenlos
					</h3>
					<p class="text-center px-1 px-sm-2 px-md-4 px-lg-3 px-xl-5">
						Das Spiel ist für alle Spieler komplett kostenlos! Außerdem ist
						keine Registrierung notwendig. Einfach Spiel erstellen und loslegen!
					</p>
				</div>
				<div class="col-12 col-md-6 col-lg-4 mb-5">
					<span class="big-icon d-block text-center text-primary mb-3 mb-sm-0"
						><i class="fas fa-user-friends"></i
					></span>
					<h3 class="text-dark text-weight-bold border-0 text-center">
						Teams
					</h3>
					<p class="text-center px-1 px-sm-2 px-md-4 px-lg-3 px-xl-5">
						Spiele mit bis zu 12 Spielern pro Spiel und und entwickelt eigene
						Taktiken um die gegnerischen Flotten zu zerstören.
					</p>
				</div>
				<div class="col-12 col-md-6 col-lg-4 mb-5">
					<span class="big-icon d-block text-center text-primary mb-3 mb-sm-0"
						><i class="fas fa-sliders-h"></i
					></span>
					<h3 class="text-dark text-weight-bold border-0 text-center">
						Unabhängig & Individuell
					</h3>
					<p class="text-center px-1 px-sm-2 px-md-4 px-lg-3 px-xl-5">
						Du benötigst keine App oder Programm um zu spielen. Einfach im
						Browser öffnen und losspielen. Außerdem hast du als Spielleiter die
						Möglichkeiten, Einstellungen wie Spielfeldgröße oder maximale
						Spieleranzahl anzupassen.
					</p>
				</div>
			</div>
		</div>
		<footer class="section sm-section bg-dark px-5 py-3">
			<div class="row">
				<div class="col-12 col-md-6 text-center text-md-left my-md-0">
					<p class="text-light m-0 p-0">
						<i class="fas fa-code mr-2"></i>by
						<a
							class="text-light"
							target="_blank"
							href="https://lorenzhohmann.de"
							>Lorenz Hohmann</a
						>
					</p>
				</div>
				<div class="col-12 col-md-6 text-center text-md-right my-md-0">
					<a class="text-light mx-2" href="/imprint">Impressum</a>
					<a class="text-light mx-2" href="/privacy">Datenschutz</a>
				</div>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'home'
};
</script>
<style scoped>
nav {
	opacity: 0.6;
}
.section {
	min-height: 100vh;
}
.section.half-section {
	min-height: 50vh;
}
.section.sm-section {
	min-height: 2vh;
}
.intro-section {
	height: 100%;
	width: 100%;
	padding: 3rem 1rem;
}
.intro-section h2 {
	font-size: 2.5rem;
}
.intro-section h3 {
	border: none !important;
}
.intro-section .subtitle {
	width: 700px;
	margin: 0 auto;
}
.intro-section .logo {
	width: 80%;
	margin: 0 auto;
	display: block;
}
.why-we-section {
	background-color: #fff;
}
.why-we-section .big-icon {
	font-size: 5rem;
	transition: 0.4s ease all;
}
.why-we-section .big-icon:hover {
	transform: scale(1.2);
}
#main-bg {
	z-index: -1;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-image: url(../../public/img/main-background.jpg);
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
	background-attachment: fixed;
	filter: grayscale(100%) blur(1px);
}
</style>
