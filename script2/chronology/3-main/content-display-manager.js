/**
 * Met à jour une zone d'affichage avec une photo et un texte,
 * en adaptant dynamiquement la mise en page (verticale ou horizontale)
 * en fonction du ratio de l'image.
 *
 * @param {object} options
 * @param {HTMLElement} options.photoContainer - L'élément conteneur pour la photo.
 * @param {HTMLElement} options.textContainer - L'élément conteneur pour le texte.
 * @param {string} options.photoUrl - L'URL de l'image à afficher.
 * @param {string} options.text - Le texte à afficher.
 */
export function updateContentDisplay({ photoContainer, textContainer, photoUrl, text }) {
    if (!photoContainer || !textContainer) {
        console.warn("Les conteneurs photo ou texte sont manquants pour la mise à jour.");
        return;
    }

    // Vider le contenu précédent et afficher le texte immédiatement
    photoContainer.innerHTML = '<p>Chargement de l\'image...</p>';
    textContainer.innerHTML = `<p>${text.replace(/\n/g, '</p><p>')}</p>`;

    const img = new Image();
    img.src = photoUrl;
    img.alt = `Illustration`;

    img.onload = () => {
        const displayArea = photoContainer.closest('.content-display-area');
        if (!displayArea) return;

        displayArea.classList.remove('layout-vertical', 'layout-horizontal');

        // Nouvelle logique : portrait OU carré = horizontal, paysage = vertical
        if (img.naturalHeight >= img.naturalWidth) {
            displayArea.classList.add('layout-horizontal');
        } else {
            displayArea.classList.add('layout-vertical');
        }

        photoContainer.innerHTML = '';
        photoContainer.appendChild(img);
    };

    img.onerror = () => {
        photoContainer.innerHTML = '<p>L\'image n\'a pas pu être chargée.</p>';
    };
}