import Ember from 'ember';

export default Ember.Controller.extend({
	speechRecognizer: Ember.inject.service(),
	actions: {
		record,
		reset,
		stop,
	},
});

function record() {
	this.send('stop');
	this.send('reset');

	const model = this.get('model');
	const speechRecognizer = this.get('speechRecognizer');

	const recorder = speechRecognizer.getRecorder();

	recorder.on('transcribed', (text) => {
		model.set('transcript', model.get('transcript') + text);
	});
	recorder.on('error', (err) => {
		model.set('error', err.msg);
	});

	recorder.start();

	model.set('recorder', recorder);
}

function reset() {
	this.get('model').setProperties({
		confidence: '',
		transcript: '',
		error: '',
	});
}

function stop() {
	const recorder = this.get('model.recorder');
	if (recorder) {
		recorder.stop();
	}
}