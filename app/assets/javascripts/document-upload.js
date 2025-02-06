$(document).ready(function () {
    DocumentUpload.initDropzone();
    DocumentUpload.displayWidgetElements();
    DocumentUpload.makeDropzoneLinkClickable();
});

var DocumentUpload = {
    initDropzone: function() {
        if ($('.document-upload__dropzone').length) {
            new Dropzone('.document-upload__dropzone', {
                url: '/provide-information',
                previewsContainer: '.document-upload__preview',
                headers: {
                    'x-csrf-token': documentUploadConfig.csrfToken
                },
                params: {
                    'isUploadingDocument': true
                },
                acceptedFiles: documentUploadConfig.validMimeTypes,
                maxFiles: documentUploadConfig.maxFiles,
                maxFilesize: documentUploadConfig.maxSizeBytes,
                addRemoveLinks: true,
                parallelUploads: 1,
                previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-error-message"><span data-dz-errormessage></span></div><div class="dz-details"><div class="dz-filename"><span data-dz-name class="govuk-body"></span></div></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div></div>',
                dictRemoveFile: documentUploadConfig.content.removeFileText,
                dictInvalidFileType: documentUploadConfig.content.invalidFileType,
                dictMaxFilesExceeded: documentUploadConfig.content.maxFiles,
                dictFileTooBig: documentUploadConfig.content.maxSize
            })
                .on('addedfile', function() {
                    DocumentUpload.hideEmptyListMessage();
                    DocumentUpload.disableButtonAndLinks();
                    DocumentUpload.updateLinkAttributes();
                })
                .on('removedfile', function(file) {
                    DocumentUpload.showEmptyListMessage();
                    DocumentUpload.removeErrorSummaryLine(file.previewElement.firstElementChild.innerText);
                    DocumentUpload.removeErrorSummary();
                    DocumentUpload.removeDocument(file._removeLink.dataset.index);
                    DocumentUpload.updateLinkAttributes();
                })
                .on('error', function(file, error) {
                    DocumentUpload.showErrorSummary();
                    DocumentUpload.showErrorSummaryLine(error);
                })
                .on('queuecomplete', function(file) {
                    DocumentUpload.enableButtonAndLinks();
                });
        }
    },
    makeDropzoneLinkClickable: function() {
        $('.document-upload__dropzone-text--choose-file').click(function() {
            $('.document-upload__dropzone').click();
        });
    },
    getErrorKey: function(error) {
        return Object.keys(documentUploadConfig.content).filter(function(value) {
            if (documentUploadConfig.content[value] === error) {
                return value;
            }
        })[0];
    },
    displayWidgetElements: function() {
        $('.document-upload__text').addClass('document-upload__text--javascript');
        $('.document-upload__image').addClass('document-upload__image--javascript');
        $('.document-upload__dropzone').addClass('document-upload__dropzone--javascript');
    },
    showEmptyListMessage: function() {
        if ($('.dz-preview').length === 0) {
            $('.document-upload__empty-list-text').show();
        }
    },
    hideEmptyListMessage: function() {
        $('.document-upload__empty-list-text').hide();
    },
    showErrorSummary: function() {
        if ($('.govuk-error-summary').length === 0) {
            $('.uploadDocumentH1').before('<div class="govuk-error-summary" role="alert" aria-labelledby="error-summary-title" tabindex="-1" data-module="govuk-error-summary"><h2 class="govuk-error-summary__title" id="error-summary-title">' + documentUploadConfig.content.errorSummaryHeading + '</h2><div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"></ul></div></div>');
        }
    },
    removeErrorSummary: function() {
        if ($('[data-fielderror]').length === 0) {
            $('.govuk-error-summary').remove();
        }
    },
    showErrorSummaryLine: function(error) {
        if ($('[data-fielderror="' + error + '"]').length === 0) {
            var summaryLine = documentUploadConfig.content[DocumentUpload.getErrorKey(error) + 'Summary'];
            $('.govuk-error-summary__list').append('<li><a href="#uploaded-files" data-fielderror="' + error + '" class="govuk-link">' + summaryLine + '</a></li>');
        }
    },
    removeErrorSummaryLine: function(errorMessage) {
        if ($('[data-dz-errormessage]:contains(' + errorMessage + ')').length === 0) {
            $('[data-fielderror="' + errorMessage + '"]').remove();
        }
    },
    enableButtonAndLinks: function() {
        $('.govuk-button').removeAttr('disabled');
        $('.dz-remove').removeClass('govuk-visually-hidden');
    },
    disableButtonAndLinks: function() {
        $('.govuk-button').attr('disabled', 'disabled');
        $('.dz-remove').addClass('govuk-visually-hidden');
    },
    updateLinkAttributes: function() {
        $('.dz-preview').each(function(key) {
            $(this).find('.dz-remove').addClass('govuk-link');
            $(this).find('.dz-remove').attr('data-index', key);
            $(this).find('.dz-remove').attr('href', '/document-upload/remove/' + key);
        });
    },
    removeDocument: function(index) {
        $.get('/provide-information/remove/' + index);
    }
};
