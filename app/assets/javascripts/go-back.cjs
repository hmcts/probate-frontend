const backLink = document.getElementById('backLink');

if (backLink) {
    backLink.onclick = function (e) {
        e.preventDefault();
        history.go(-1);
    };
    backLink.classList.remove('govuk-visually-hidden');
}
