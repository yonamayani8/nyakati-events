function showPage(pageId) {
	const selectedPage = document.getElementById(pageId);
	if (!selectedPage) return;

	document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
	selectedPage.classList.add('active');
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function requestService(service) {
	const serviceField = document.getElementById('oservices');
	if (!serviceField) return;

	const selectedServices = serviceField.value.split(',').map((item) => item.trim()).filter(Boolean);
	if (!selectedServices.some((item) => item.toLowerCase() === service.toLowerCase())) {
		selectedServices.push(service);
	}
	serviceField.value = selectedServices.join(', ');
	showPage('order');
	serviceField.focus({ preventScroll: true });
}

document.addEventListener('click', (event) => {
	if (!(event.target instanceof Element)) return;

	const pageControl = event.target.closest('[data-page]');
	if (pageControl) {
		event.preventDefault();
		showPage(pageControl.dataset.page);
		return;
	}

	const serviceControl = event.target.closest('[data-service]');
	if (serviceControl) requestService(serviceControl.dataset.service);
});

function createWhatsAppUrl(message) {
	return `https://wa.me/255620290961?text=${encodeURIComponent(message)}`;
}

function showFormReview(result, message, fileName, whatsappUrl, statusMessage) {
	const status = document.createElement('strong');
	status.textContent = statusMessage;

	const preview = document.createElement('pre');
	preview.className = 'form-review__preview';
	preview.textContent = message;

	const actions = document.createElement('div');
	actions.className = 'form-review__actions';

	const downloadButton = document.createElement('button');
	downloadButton.className = 'btn';
	downloadButton.type = 'button';
	downloadButton.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i><span>Pakua ujumbe</span>';
	downloadButton.addEventListener('click', () => {
		const file = new Blob([message], { type: 'text/plain;charset=utf-8' });
		const fileUrl = URL.createObjectURL(file);
		const downloadLink = document.createElement('a');
		downloadLink.href = fileUrl;
		downloadLink.download = fileName;
		document.body.append(downloadLink);
		downloadLink.click();
		downloadLink.remove();
		window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
	});

	const whatsappLink = document.createElement('a');
	whatsappLink.className = 'btn green';
	whatsappLink.href = whatsappUrl;
	whatsappLink.target = '_blank';
	whatsappLink.rel = 'noopener noreferrer';
	whatsappLink.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>Endelea WhatsApp</span>';

	actions.append(downloadButton, whatsappLink);
	result.replaceChildren(status, preview, actions);
	result.classList.remove('hidden');
}

const bookingForm = document.getElementById('form');
if (bookingForm) {
	bookingForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const message = [
			'Habari NYAKATI EVENTS,',
			'',
			`Jina: ${document.getElementById('name').value}`,
			`Namba: ${document.getElementById('phone').value}`,
			`Aina ya Event: ${document.getElementById('event').value}`,
			`Tarehe: ${document.getElementById('date').value}`,
			`Huduma ninazohitaji: ${document.getElementById('need').value || 'Bado sijachagua'}`,
			'',
			'Nahitaji booking.'
		].join('\n');
		const result = document.getElementById('result');
		showFormReview(result, message, 'booking-nyakati-events.txt', createWhatsAppUrl(message), 'Ujumbe wa booking uko tayari kukaguliwa.');
	});
}

const orderForm = document.getElementById('orderForm');
if (orderForm) {
	orderForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const message = [
			'Habari NYAKATI EVENTS,',
			'',
			'*ODA YA MTEJA*',
			`Jina: ${document.getElementById('oname').value}`,
			`Namba: ${document.getElementById('ophone').value}`,
			`Event: ${document.getElementById('otype').value}`,
			`Tarehe: ${document.getElementById('odate').value}`,
			`Eneo: ${document.getElementById('venue').value}`,
			`Huduma: ${document.getElementById('oservices').value}`,
			`Wageni: ${document.getElementById('guests').value}`,
			`Bajeti: ${document.getElementById('budget').value || 'Haijawekwa'} TZS`,
			`Maelezo: ${document.getElementById('odetails').value || 'Hakuna'}`,
			'',
			'Naomba quotation na booking.'
		].join('\n');
		const result = document.getElementById('orderResult');
		showFormReview(result, message, 'oda-nyakati-events.txt', createWhatsAppUrl(message), 'Oda yako iko tayari kukaguliwa.');
	});
}

function initializeLightbox(itemSelector, dialogSelector, imageSelector, captionSelector) {
	const dialog = document.querySelector(dialogSelector);
	if (!dialog) return;

	const lightboxImage = dialog.querySelector(imageSelector);
	const lightboxCaption = dialog.querySelector(captionSelector);
	const closeButton = dialog.querySelector('button');

	document.querySelectorAll(itemSelector).forEach((item) => {
		item.addEventListener('click', () => {
			const thumbnail = item.querySelector('img');
			lightboxImage.src = item.dataset.photo;
			lightboxImage.alt = thumbnail ? thumbnail.alt : '';
			lightboxCaption.textContent = item.dataset.caption;
			dialog.showModal();
		});
	});

	closeButton.addEventListener('click', () => dialog.close());
	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) dialog.close();
	});
}

initializeLightbox('.cake-photo', '.cake-lightbox', '.cake-lightbox__image', '.cake-lightbox__caption');
initializeLightbox('.mc-gallery__item', '.mc-lightbox', '.mc-lightbox__image', '.mc-lightbox__caption');
