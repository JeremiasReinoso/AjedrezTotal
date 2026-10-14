/**
 * Valida localmente el formulario para incorporar entrenadores y muestra su estado.
 * Lee el endpoint de js/configuracion.js; sin proveedor configurado no realiza un envío real.
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

		status.textContent = 'El formulario está listo para enviarse, pero la integración ' +
			'requiere completar la configuración del proveedor.';
		status.className = 'status-message';
	});
}());
