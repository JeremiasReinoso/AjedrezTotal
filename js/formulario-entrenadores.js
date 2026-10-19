/**
 * Valida y envía el formulario para incorporar entrenadores al backend configurado.
 */
(function () {
	'use strict';
	var form = document.querySelector('#formulario-entrenador');
	if (!form) return;

	form.addEventListener('submit', function (event) {
		event.preventDefault();
		var status = document.querySelector('#form-status');
		if (!form.checkValidity()) {
			status.textContent = 'Revisá los campos obligatorios antes de continuar.';
			status.className = 'status-message error';
			form.reportValidity();
			return;
		}

		var endpoint = window.AjedrezConfig && window.AjedrezConfig.formularioEndpoint;
		if (!endpoint) {
			status.textContent = 'Solicitud validada localmente. El envío real está pendiente: ' +
				'configurá un proveedor externo en js/configuracion.js.';
			status.className = 'status-message success';
			form.reset();
			return;
		}

		var button = form.querySelector('button[type="submit"]');
		var payload = Object.fromEntries(new FormData(form).entries());
		button.disabled = true;
		button.textContent = 'Enviando…';
		status.textContent = 'Enviando tu solicitud…';
		status.className = 'status-message';

		fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(payload)
		}).then(function (response) {
			return response.json().catch(function () { return {}; }).then(function (body) {
				if (!response.ok) throw Error(body.error || 'No se pudo enviar la solicitud.');
				return body;
			});
		}).then(function () {
			status.textContent = 'Solicitud enviada. Gracias; vamos a revisar tu información.';
			status.className = 'status-message success';
			form.reset();
		}).catch(function (error) {
			status.textContent = error.message || 'No se pudo enviar la solicitud. Intentá nuevamente.';
			status.className = 'status-message error';
		}).finally(function () {
			button.disabled = false;
			button.textContent = 'Enviar solicitud';
		});
	});
}());
