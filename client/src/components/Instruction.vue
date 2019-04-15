<template>
	<div>
		<h3>Anleitung</h3>
		<h4>Allgemein</h4>
		<p>
			Diese Version von "Schiffe versenken" ist <u>einmalig</u>! Insbesondere
			Spielerzahlen bis 12 Spieler pro Spiel sind absolut einmalig!
		</p>
		<h4>Spiel erstellen</h4>
		<p>
			Unter "Spiel erstellen" kann ein neues Spiel mit einem einmaligen
			Benutzernamen und einem eindeutigen Spiel-Code erstellt werden. Über den
			Spielcode können andere Spieler dem Spiel beitreten.
		</p>
		<p>
			Der Spiel-Ersteller hat hier die Möglichkeiten einige Spielereinstellung,
			wie maximale Spieleranzahl und Spielfeldgröße festzulegen.
		</p>
		<h4>Spiel beitreten</h4>
		<router-link class="btn btn-secondary" to="/"
			><i class="fas fa-arrow-left pr-2"></i> Zurück</router-link
		>
	</div>
</template>

<script>
export default {
	name: 'instruction'
};
</script>
