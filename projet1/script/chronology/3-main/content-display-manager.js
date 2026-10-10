/**
 * Met à jour une zone d'affichage avec une photo et un texte,
 * en adaptant dynamiquement la mise en page (verticale ou horizontale)
 * en fonction du ratio de l'image.
 *
 * @param {object} options
 * @param {HTMLElement} options.photoContainer - L'élément conteneur pour la photo.
 * @param {HTMLElement} options.textContainer - L'élément conteneur pour le texte.
 * @param {string} options.photoUrl - L'URL de l'image à afficher.
 * @param {string} options.text - Le contenu HTML à afficher.
 */
export function updateContentDisplay({ photoContainer, textContainer, photoUrl, text }) {
    if (!photoContainer || !textContainer) {
        console.warn("Les conteneurs photo ou texte sont manquants pour la mise à jour.");
        return;
    }

    // CORRIGÉ : Affiche le contenu HTML directement, sans l'envelopper dans des <p>
    textContainer.innerHTML = text;
    photoContainer.innerHTML = '<p>Chargement de l\'image...</p>';

    const img = new Image();
    img.src = photoUrl;
    img.alt = `Illustration`;

    img.onload = () => {
        const displayArea = photoContainer.closest('.content-display-area');
        if (!displayArea) return;

        // Réinitialiser les classes de layout
        displayArea.classList.remove('layout-vertical', 'layout-horizontal');

        // Appliquer la classe en fonction du ratio de l'image
        if (img.naturalHeight >= img.naturalWidth) {
            displayArea.classList.add('layout-horizontal'); // Portrait ou carré
        } else {
            displayArea.classList.add('layout-vertical');   // Paysage
        }

        // Vider le message de chargement et afficher l'image
        photoContainer.innerHTML = '';
        photoContainer.appendChild(img);
    };

    img.onerror = () => {
        photoContainer.innerHTML = '<p>L\'image n\'a pas pu être chargée.</p>';
        // En cas d'erreur, le layout ne sera pas modifié, ce qui peut expliquer l'affichage sur 3 lignes.
    };
}