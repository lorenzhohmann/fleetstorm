<template>
	<div>
		<h3>Anleitung</h3>
		<h4>Allgemein</h4>
		<p>
			Diese Version von &bdquo;Schiffe versenken&ldquo; ist <u>einmalig</u>!
			Insbesondere Spielerzahlen bis zu 12 Spielern pro Spiel sind absolut
			einmalig! Außerdem kann man die Spielfeldgröße uvm. einstellen.
		</p>
		<p>Probier's doch einfach mal aus! ;)</p>
		<h4>Spiel erstellen</h4>
		<p>
			Unter &bdquo;Spiel erstellen&ldquo; kann ein neues Spiel mit einem
			einmaligen Benutzernamen und einem eindeutigen Spiel-Code erstellt werden.
			Über den Spielcode können andere Spieler dem Spiel beitreten.
		</p>
		<p>
			Der Spiel-Ersteller hat hier die Möglichkeiten einige Spielereinstellung,
			wie maximale Spieleranzahl und Spielfeldgröße festzulegen.
		</p>
		<h4>Spiel beitreten</h4>
		<p>
			Andere Spieler können unter &bdquo;Spiel beitreten&ldquo; einem Spiel
			beitreten. Das ist aber nur möglich, solange sich das Spiel noch im
			Wartemodus befindet. Ein nachträgliches Beitreten ist nicht möglich.
		</p>
		<p>
			Privaten Spielen kann nur über den entsprechenden Spiel-Code beigetreten
			werden. Sind Spiele auf &bdquo;Öffentlich&ldquo; gestellt, werden sie
			aufgelistet und jeder kann beitreten.
		</p>
		<h4>Noch Fragen?</h4>
		<p>
			Das Spiel basiert auf dem normalen Prinzip von Schiffe versenken. Die
			genauen Regeln findest du
			<a href="https://de.wikipedia.org/wiki/Schiffe_versenken" target="_blank"
				>auf diesem Wikipedia-Beitrag.</a
			>
		</p>
		<router-link class="btn btn-secondary" to="/start"
			><i class="fas fa-arrow-left pr-2"></i> Zurück</router-link
		>
	</div>
</template>

<script>
export default {
	name: 'instruction'
};
</script>
