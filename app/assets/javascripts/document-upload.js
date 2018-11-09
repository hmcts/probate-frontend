$(document).ready(function () {
    DocumentUpload.initDropzone();
    DocumentUpload.displayWidgetElements();
    DocumentUpload.makeDropzoneLinkClickable();
});

var DocumentUpload = {
    initDropzone: function() {
        new Dropzone('.document-upload__dropzone', {
            url: '/document-upload',
            previewsContainer: '.document-upload__preview',
            headers: {
                'x-csrf-token': documentUploadConfig.csrfToken
            },
            acceptedFiles: documentUploadConfig.validMimeTypes,
            maxFiles: documentUploadConfig.maxFiles,
            maxFilesize: documentUploadConfig.maxSizeBytes,
            addRemoveLinks: true,
            previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-error-message"><span data-dz-errormessage></span></div><div class="dz-details"><div class="dz-filename"><span data-dz-name></span></div></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div></div>',
            dictRemoveFile: documentUploadConfig.content.removeFileText,
            dictInvalidFileType: documentUploadConfig.content.invalidFileType,
            dictMaxFilesExceeded: documentUploadConfig.content.maxFilesExceeded,
            dictFileTooBig: documentUploadConfig.content.maxSize
        })
            .on('addedfile', function() {
                DocumentUpload.hideEmptyListMessage();
                DocumentUpload.disableSubmitButton();
            })
            .on('removedfile', function(file) {
                DocumentUpload.showEmptyListMessage();
                DocumentUpload.removeErrorSummaryLine(file.previewElement.firstElementChild.innerText);
                DocumentUpload.removeErrorSummary();
            })
            .on('error', function(file, error) {
                DocumentUpload.showErrorSummary();
                DocumentUpload.showErrorSummaryLine(error);
            })
            .on('queuecomplete', function(file) {
                DocumentUpload.enableSubmitButton();
            });
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
        if ($('.error-summary').length === 0) {
            $('h1').before('<div class="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1"><h2 class="heading-medium error-summary-heading" id="error-summary-heading">' + documentUploadConfig.content.errorSummaryHeading + '</h2><ul class="error-summary-list"></ul></div>');
        }
    },
    removeErrorSummary: function() {
        if ($('[data-fielderror]').length === 0) {
            $('.error-summary').remove();
        }
    },
    showErrorSummaryLine: function(error) {
        if ($('[data-fielderror="' + error + '"]').length === 0) {
            var summaryLine = documentUploadConfig.content[DocumentUpload.getErrorKey(error) + 'Summary'];
            $('.error-summary-list').append('<li><a href="#uploaded-files" data-fielderror="' + error + '">' + summaryLine + '</a></li>');
        }
    },
    removeErrorSummaryLine: function(errorMessage) {
        if ($('[data-dz-errormessage]:contains(' + errorMessage + ')').length === 0) {
            $('[data-fielderror="' + errorMessage + '"]').remove();
        }
    },
    enableSubmitButton: function() {
        $('.button').removeAttr('disabled');
    },
    disableSubmitButton: function() {
        $('.button').attr('disabled', 'disabled');
    }
}
